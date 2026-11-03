import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { GenerationResponse, GenerateRequestBody } from "@/lib/types";
import { buildSystemInstruction, buildPolishPrompt } from "./prompts";

export const runtime = "nodejs";
// Allow up to 90 seconds for polish pass (2 AI calls)
export const maxDuration = 90;

// ─────────────────────────────────────────────
// GEMINI RESPONSE SCHEMA
// ─────────────────────────────────────────────
const geminiResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    detectedLanguage: { type: SchemaType.STRING },
    targetLanguage: { type: SchemaType.STRING },
    songType: { type: SchemaType.STRING },
    poeticVibe: { type: SchemaType.STRING },
    emotionalDepth: { type: SchemaType.STRING },
    songEnding: { type: SchemaType.STRING },
    titles: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3 creative title options for the song",
    },
    lyrics: {
      type: SchemaType.STRING,
      description: "Full song lyrics with [Section] tags, singable and human-sounding",
    },
    phoneticHelper: {
      type: SchemaType.STRING,
      description: "Romanized phonetic version of non-Latin script lyrics for Suno AI. Empty string if not needed.",
    },
    music: {
      type: SchemaType.OBJECT,
      properties: {
        genre: { type: SchemaType.STRING },
        tempo: { type: SchemaType.STRING },
        instrumentation: { type: SchemaType.STRING },
        vocalStyle: { type: SchemaType.STRING },
        sunoPrompt: {
          type: SchemaType.STRING,
          description: "≤120 chars English Suno style prompt: language, genre, voice, instruments, tempo, mood",
        },
        negativeStyleTags: {
          type: SchemaType.STRING,
          description: "Comma-separated tags to exclude, e.g. 'no autotune, no EDM drops, no rap'",
        },
      },
      required: ["genre", "tempo", "instrumentation", "sunoPrompt"],
    },
    visual: {
      type: SchemaType.OBJECT,
      properties: {
        colorPalette: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              hex: { type: SchemaType.STRING },
              role: { type: SchemaType.STRING },
            },
            required: ["name", "hex"],
          },
        },
        imagery: { type: SchemaType.STRING },
        imagePrompt: { type: SchemaType.STRING },
      },
      required: ["colorPalette", "imagery", "imagePrompt"],
    },
    youtubeMeta: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        hashtags: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["title", "description", "hashtags"],
    },
  },
  required: ["detectedLanguage", "lyrics", "music", "visual"],
};

// ─────────────────────────────────────────────
// CALL GEMINI HELPER
// ─────────────────────────────────────────────
async function callGemini(
  geminiKey: string,
  systemInstruction: string,
  promptText: string,
  structured: boolean = true
): Promise<{ text: string | null; error?: string }> {
  const geminiModels = [
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  let lastError = "";
  let isQuotaExceeded = false;

  for (const modelName of geminiModels) {
    if (isQuotaExceeded) break;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
          generationConfig: structured
            ? {
                responseMimeType: "application/json",
                responseSchema: geminiResponseSchema as any,
                temperature: 0.9,
              }
            : { temperature: 0.85 },
        });

        console.log(`Gemini ${modelName} attempt ${attempt}`);
        const response = await model.generateContent(promptText);
        const text = response.response.text();
        if (text) return { text };
      } catch (err: any) {
        const msg = err?.message || String(err);
        lastError = msg;

        // Quota check (429)
        if (msg.includes("429") || msg.includes("quota") || msg.includes("Quota exceeded")) {
          console.error(`Gemini quota limit reached on ${modelName}`);
          isQuotaExceeded = true;
          break; // Stop immediately, no wasteful retries
        }

        const is503 = msg.includes("503") || msg.includes("high demand");
        const is404 = msg.includes("404") || msg.includes("not found");
        if (is404) break; // skip to next model

        if (is503 && attempt < 2) {
          console.log(`${modelName} overloaded, retrying in 1.5s...`);
          await sleep(1500);
        } else {
          console.error(`${modelName} failed:`, msg.slice(0, 100));
          break;
        }
      }
    }
  }

  let userFriendlyError = "Gemini is under high demand right now. Please wait a moment and try again.";
  if (isQuotaExceeded) {
    userFriendlyError =
      "Daily Gemini API request quota exceeded for this key (Free Tier limit reached).\n\nPlease get a free standard key at https://aistudio.google.com/app/apikey and update GEMINI_API_KEY in .env.local, or add an ANTHROPIC_API_KEY.";
  } else if (lastError.includes("503") || lastError.includes("high demand")) {
    userFriendlyError =
      "Gemini is experiencing heavy traffic right now (503 Service Unavailable). Please wait 30 seconds and click Retry, or configure an API key at https://aistudio.google.com/app/apikey.";
  }

  console.error("All Gemini models failed. Last error:", lastError.slice(0, 200));
  return { text: null, error: userFriendlyError };
}

// ─────────────────────────────────────────────
// CALL CLAUDE HELPER
// ─────────────────────────────────────────────
async function callClaude(
  anthropicKey: string,
  systemInstruction: string,
  userMessage: string,
  maxTokens: number = 3000
): Promise<string | null> {
  try {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const claudeMsg = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: maxTokens,
      temperature: 0.9,
      system: `${systemInstruction}\n\nYou must reply ONLY with valid JSON matching the schema. No markdown fences.`,
      messages: [{ role: "user", content: userMessage }],
    });
    const firstContent = claudeMsg.content[0];
    if (firstContent.type === "text") {
      return firstContent.text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }
  } catch (err: any) {
    console.error("Claude failed:", err?.message?.slice(0, 100));
  }
  return null;
}

// ─────────────────────────────────────────────
// MAIN API ROUTE
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();
    const prompt = (body?.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Please enter a scene or moment description." },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!geminiKey && !anthropicKey) {
      return NextResponse.json(
        { error: "No API key configured. Set GEMINI_API_KEY or ANTHROPIC_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const polishPass = body?.polishPass !== false; // default ON
    const targetLanguage = body?.targetLanguage || "auto";
    const songType = body?.songType || "auto";

    // Build the system prompt using the new prompts module
    const systemInstruction = buildSystemInstruction(body);

    const userPromptText = `═══════════════════════════════════════════════
USER'S SCENE DESCRIPTION
═══════════════════════════════════════════════
"""
${prompt}
"""

${body.specificDetails ? `SPECIFIC DETAILS PROVIDED: ${body.specificDetails}` : ""}
${body.referenceVibe ? `REFERENCE VIBE: ${body.referenceVibe}` : ""}

REMINDER: All imagery must come ONLY from the scene above.
Return strict valid JSON with the complete song, titles, music direction, visual direction, and YouTube metadata.`;

    // ── STEP 1: Generate initial draft ──────────────────────────
    let rawText: string | null = null;
    let geminiErrorMessage = "Gemini API error occurred.";

    if (geminiKey) {
      const geminiRes = await callGemini(geminiKey, systemInstruction, userPromptText, true);
      rawText = geminiRes.text;
      if (geminiRes.error) geminiErrorMessage = geminiRes.error;
    }

    if (!rawText && anthropicKey) {
      rawText = await callClaude(anthropicKey, systemInstruction, userPromptText);
    }

    if (!rawText) {
      return NextResponse.json(
        {
          error: geminiErrorMessage,
        },
        { status: 503 }
      );
    }

    const cleanedJson = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let resultData: GenerationResponse;
    try {
      resultData = JSON.parse(cleanedJson);
    } catch (parseErr: any) {
      console.error("Failed to parse JSON response:", parseErr?.message);
      return NextResponse.json(
        { error: "The AI returned an invalid response structure. Please click Retry." },
        { status: 502 }
      );
    }

    // ── STEP 2: Polish pass (self-critique + line rewrite) ─────────
    if (polishPass && resultData.lyrics) {
      try {
        const polishPrompt = buildPolishPrompt(
          resultData.lyrics,
          resultData.targetLanguage || resultData.detectedLanguage || targetLanguage,
          resultData.songType || songType
        );
        const polishSystem =
          "You are a senior song editor. Improve only the weak lines. Return the FINAL improved lyrics text only — no JSON, no explanations.";

        let polishedLyrics: string | null = null;

        if (geminiKey) {
          const polishRes = await callGemini(geminiKey, polishSystem, polishPrompt, false);
          polishedLyrics = polishRes.text;
        }
        if (!polishedLyrics && anthropicKey) {
          const anthropic = new Anthropic({ apiKey: anthropicKey });
          const msg = await anthropic.messages.create({
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 2000,
            temperature: 0.8,
            system: polishSystem,
            messages: [{ role: "user", content: polishPrompt }],
          });
          if (msg.content[0]?.type === "text") {
            polishedLyrics = msg.content[0].text.trim();
          }
        }

        if (polishedLyrics && polishedLyrics.length > 50) {
          resultData.lyrics = polishedLyrics;
          resultData.polished = true;
        }
      } catch (polishErr) {
        // Polish pass failure is non-fatal — use original lyrics
        console.warn("Polish pass failed (non-fatal):", polishErr);
      }
    }

    // ── STEP 3: Assemble sunoBlock for easy copy-paste ─────────
    if (resultData.music?.sunoPrompt && resultData.lyrics) {
      resultData.sunoBlock = `[Style of Music]\n${resultData.music.sunoPrompt}\n\n[Lyrics]\n${resultData.lyrics}`;
    }

    // ── STEP 4: Normalize metadata ─────────────────────────────
    resultData.targetLanguage =
      targetLanguage === "auto" ? resultData.detectedLanguage : targetLanguage;
    resultData.songType = songType;
    resultData.poeticVibe = body.poeticVibe || "deep-poetic";
    resultData.emotionalDepth = body.emotionalDepth || "heartfelt-raw";
    resultData.songEnding = body.songEnding || "emotional-punchline";

    return NextResponse.json(resultData);
  } catch (error: any) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "An unexpected error occurred. Please check your API key and try again.",
      },
      { status: 500 }
    );
  }
}
