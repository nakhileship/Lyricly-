import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { GenerationResponse, GenerateRequestBody } from "@/lib/types";

export const runtime = "nodejs";

const SONG_TYPE_INSTRUCTIONS: Record<
  string,
  { label: string; instruction: string; structure: string }
> = {
  auto: {
    label: "Auto (AI Best Fit)",
    instruction:
      "Select the musical genre that most naturally matches the emotion, pacing, and mood of the described scene.",
    structure:
      "[Verse 1] (Setting the scene), [Chorus] (Core emotional theme), [Verse 2] (Deeper shift), [Chorus], [Bridge] (Peak revelation), [Chorus], [Outro] (Poignant resolution)",
  },
  "indie-acoustic": {
    label: "Indie / Acoustic Folk",
    instruction:
      "Indie / Acoustic Folk: Warm acoustic guitars, fingerpicking, intimate and vulnerable vocal delivery, organic percussion, rich poetic subtext, unvarnished human truth.",
    structure:
      "[Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus], [Outro]",
  },
  "rap-hiphop": {
    label: "Rap / Hip-Hop",
    instruction:
      "Rap / Hip-Hop: Hard-hitting rhythmic flow, internal rhymes, multisyllabic rhyme schemes, punchy cadence, wordplay, and a catchy melodic hook. In Malayalam or South Asian languages, incorporate authentic street rhythm, syncopated flow, and real storytelling cadence.",
    structure:
      "[Intro], [Verse 1 (16 bars)], [Hook / Chorus], [Verse 2 (16 bars)], [Hook / Chorus], [Bridge / Beat Switch], [Hook / Chorus], [Outro]",
  },
  "melody-ghazal": {
    label: "Melody / Classical / Ghazal",
    instruction:
      "Melodic / Classical / Ghazal (ഭാവഗീതം / ഗസൽ / മെലഡി): Flowing melodious lines, classical raga/scale sensibilities, expressive poetic meters, soaring emotive vocal phrasing, gentle traditional orchestration (violins, flutes, sitar/tabla).",
    structure:
      "[Pallavi / Chorus], [Anupallavi / Verse 1], [Pallavi], [Charanam / Verse 2], [Pallavi], [Outro]",
  },
  "pop-synth": {
    label: "Pop / Synth-Pop",
    instruction:
      "Pop / Synth-Pop: Radio-ready anthemic hooks, driving upbeat pulse or modern 80s synth textures, memorable rhythmic bounce, dynamic pre-chorus builds, and irresistible singalong choruses.",
    structure:
      "[Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Chorus], [Outro]",
  },
  "rock-alternative": {
    label: "Rock / Alternative",
    instruction:
      "Rock / Alternative: Gritty energy, driving live drums, raw electric guitar riffs, passionate and expressive vocal power, dynamic contrast between moody verses and explosive choruses.",
    structure:
      "[Intro], [Verse 1], [Chorus], [Verse 2], [Chorus], [Guitar Solo / Bridge], [Chorus], [Outro]",
  },
  "rnb-soul": {
    label: "R&B / Soul",
    instruction:
      "R&B / Soul: Smooth laid-back groove, lush seventh chords, melismatic vocal runs, deep emotional pocket, sensual or vulnerable romantic confession.",
    structure:
      "[Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Chorus], [Outro]",
  },
  "lofi-chill": {
    label: "Lo-Fi / Chillhop",
    instruction:
      "Lo-Fi / Chillhop: Mellow, relaxed, dusty vinyl warmth, laid-back jazzy chords, whispered or spoken-sung intimate cadence, nostalgic loop vibes.",
    structure:
      "[Verse 1], [Hook], [Verse 2], [Hook], [Outro]",
  },
  "electronic-edm": {
    label: "EDM / Electronic",
    instruction:
      "EDM / Electronic: Hypnotic synthesizer sequences, rising energy, euphoric drops, rhythmic vocal hooks, and high-energy propulsion.",
    structure:
      "[Verse 1], [Build-up], [Drop / Chorus], [Verse 2], [Build-up], [Drop / Chorus], [Outro]",
  },
  "reggae-dub": {
    label: "Reggae / Dub",
    instruction:
      "Reggae / Dub: Relaxed offbeat guitar skank, deep rolling bassline, conscious or chilled sunny storytelling, rhythmic vocal delivery.",
    structure:
      "[Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus], [Outro]",
  },
};

const EMOTIONAL_DEPTH_INSTRUCTIONS: Record<string, string> = {
  "heartfelt-raw":
    "Raw, Heart-Touching & Intimate (ഉള്ള് തൊടുന്ന ഭാവം / ഹൃദയസ്പർശി): Write with genuine vulnerability, emotional weight, and unpretentious human truth. Avoid high-flown abstract clichés; focus on micro-actions, hesitations, and real human details that make the chest ache. Let the emotion feel earned and deeply human.",
  "bittersweet-longing":
    "Bittersweet Longing (നൊമ്പരം / വിരഹം): Capture the ache of passing time, distance between people, unsaid goodbyes, and memories triggered by familiar sights or scents specific to this scene.",
  "contemplative-soulful":
    "Soulful & Philosophical (ആത്മഗതം / ധ്യാനാത്മകം): Deep and reflective. The specific scene becomes a mirror to life, existence, and the quiet inner landscape of a person.",
  "warm-comfort":
    "Warm, Tender & Comforting (ആർദ്രമായ സാന്ത്വനം): A soothing embrace. Convey tenderness, hope, companionship, and the quiet beauty of small shared moments.",
};

const SONG_ENDING_INSTRUCTIONS: Record<string, string> = {
  "lingering-fade":
    "Lingering Fadeout (മാഞ്ഞുപോകുന്ന പര്യവസാനം): The song ends on a haunting, unresolved detail or an unanswered whisper that echoes in the listener's mind like mist fading away.",
  "emotional-punchline":
    "Emotional Climax & Final Realization (വൈകാരികമായ പൂർണ്ണത): The Outro delivers a powerful, touching closing realization that ties the entire story together and brings deep emotional closure.",
  "quiet-acceptance":
    "Quiet Acceptance & Letting Go (ശാന്തമായ യാത്രാമൊഴി): The song reaches a serene, peaceful resolution — accepting the moment as it is, letting the breath out, and quietly moving forward.",
};

const POETIC_VIBE_DESCRIPTIONS: Record<string, string> = {
  "deep-poetic":
    "Deeply Poetic & Metaphorical (കവിതാത്മകം / ആഴമേറിയ കവിത): Rich literary metaphors, evocative imagery, and melodic cadence inspired by master poets (like ONV Kurup, Rafeeq Ahamed in Malayalam; Gulzar in Hindi/Urdu; Leonard Cohen in English).",
  "nostalgic-solitary":
    "Nostalgic & Solitary (ഓർമ്മകളും ഏകാന്തതയും): Wistful, bittersweet atmosphere of passing time, solitude, and quiet yearning.",
  "romantic-melodic":
    "Romantic & Soulful (പ്രണയാർദ്രം): Tender romance, gentle touch, emotional intimacy, sweet melodic flow.",
  "cinematic-storytelling":
    "Cinematic & Dramatic (സിനിമാറ്റിക്): Narrative progression with atmospheric build, emotional tension, and vivid scene changes.",
  "folk-pop":
    "Folk & Contemporary Groove (നാടൻ / ആധുനിക പോപ്പ്): Earthy, organic rhythm, conversational yet deeply poetic expressions, and singable refrains.",
};

function buildSystemInstruction(
  targetLanguage: string,
  songTypeKey: string,
  poeticVibeKey: string,
  emotionalDepthKey: string,
  songEndingKey: string
): string {
  const songTypeInfo =
    SONG_TYPE_INSTRUCTIONS[songTypeKey] || SONG_TYPE_INSTRUCTIONS["auto"];

  const vibeInstruction =
    POETIC_VIBE_DESCRIPTIONS[poeticVibeKey] ||
    POETIC_VIBE_DESCRIPTIONS["deep-poetic"];

  const emotionalInstruction =
    EMOTIONAL_DEPTH_INSTRUCTIONS[emotionalDepthKey] ||
    EMOTIONAL_DEPTH_INSTRUCTIONS["heartfelt-raw"];

  const endingInstruction =
    SONG_ENDING_INSTRUCTIONS[songEndingKey] ||
    SONG_ENDING_INSTRUCTIONS["emotional-punchline"];

  const languageGuidance =
    targetLanguage && targetLanguage.toLowerCase() !== "auto"
      ? `COMPOSE IN: **${targetLanguage}** (in its authentic script, e.g. Malayalam script മലയാളം if Malayalam is selected).
         - Recompose the emotional core, imagery, and unsaid subtext natively into ${targetLanguage}.
         - Do NOT write a flat literal translation. Compose as an original native poet writing in ${targetLanguage}.`
      : `COMPOSE DIRECTLY IN THE INPUT LANGUAGE:
         - If the input is in Malayalam (മലയാളം), write purely in authentic, evocative Malayalam script.
         - If in English, write in English. If in Manglish, write in Manglish.
         - Never translate to English before writing lyrics unless explicitly requested.`;

  return `You are a master lyricist, poet, and creative musical director capable of writing songs across diverse genres with the emotional soul of legendary writers.

Your goal is to transform the user's specific scene into an original, deeply touching, and fully human song in the chosen musical style.

=== CRITICAL GROUNDING RULES (NEVER DEFAULT TO CLICHÉS) ===
1. EXCLUSIVE SCENE GROUNDING:
- You must draw ALL imagery, metaphors, objects, characters, and settings EXCLUSIVELY from the user's prompt.
- DO NOT import unrelated default elements (e.g. tea stalls, rain, wooden benches, radios, trains, coffee) UNLESS the user explicitly mentioned them in their description!
- If the user writes about a sunny beach, a classroom, a neon city, a funeral, a newborn baby, a highway drive, or a quiet bedroom, your lyrics MUST inhabit that exact world and only that world.
- Make every song feel 100% unique to the user's words.

2. MUSICAL GENRE & SONG TYPE:
- Chosen Genre / Style: **${songTypeInfo.label}**
- Genre Directive: ${songTypeInfo.instruction}
- Recommended Song Architecture: ${songTypeInfo.structure}
- If Rap/Hip-Hop is selected, write rhythmic, bar-based lyrical flow with internal rhymes and a hard-hitting or melodic hook.
- If Melody/Ghazal is selected, write with soaring, classical poetic meters and emotional grace.
- If Indie/Folk is selected, write with intimate, acoustic folk lyricism.

3. HUMAN SUBTEXT & "SHOW, DON'T STATE":
- BANNED: Do not use generic emotion words like "മനസ്സിൽ ദുഃഖം" ("sadness in my heart"), "I am so happy", or "my heart breaks".
- INSTEAD: Express feelings through the specific physical objects, glances, silences, textures, and sensory actions inherent to the user's chosen scene.
- Avoid forced AABB nursery-rhyme patterns. Use fluid human cadence, natural conversational pauses (...), and varied line lengths that breathe.

4. DEFINITIVE TOUCHING ENDING:
- No aimless wandering. The song must have a clear emotional progression and a memorable, touching [Outro] that provides closure: ${endingInstruction}

5. STYLE & LANGUAGE:
- Emotional Soul: ${emotionalInstruction}
- Poetic Tone: ${vibeInstruction}
- ${languageGuidance}

6. MUSIC & VISUAL DIRECTION:
- Music Direction: Genre (strictly matching ${songTypeInfo.label}), tempo (specific BPM), instrumentation matching THIS genre and scene, vocal style, and one dense ready-to-paste Suno.ai prompt.
- Visual Direction: 3-4 named colors with hex codes, visual concept, and one ready-to-paste Midjourney prompt.

Always return strict, valid JSON matching the schema.`;
}

const geminiResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    detectedLanguage: {
      type: SchemaType.STRING,
      description: "The language detected in the input (e.g., 'Malayalam', 'English')",
    },
    targetLanguage: {
      type: SchemaType.STRING,
      description: "The language the lyrics were written in",
    },
    songType: {
      type: SchemaType.STRING,
      description: "The song type/genre applied (e.g., 'Rap / Hip-Hop', 'Indie / Acoustic Folk')",
    },
    poeticVibe: {
      type: SchemaType.STRING,
      description: "The poetic vibe applied",
    },
    emotionalDepth: {
      type: SchemaType.STRING,
      description: "The emotional depth mode applied",
    },
    songEnding: {
      type: SchemaType.STRING,
      description: "The ending resolution style applied",
    },
    lyrics: {
      type: SchemaType.STRING,
      description: "The complete, emotionally touching song lyrics tailored strictly to the scene and genre",
    },
    music: {
      type: SchemaType.OBJECT,
      properties: {
        genre: { type: SchemaType.STRING, description: "Specific musical genre" },
        tempo: { type: SchemaType.STRING, description: "Tempo with BPM and rhythmic feel" },
        instrumentation: { type: SchemaType.STRING, description: "Key instruments used" },
        vocalStyle: { type: SchemaType.STRING, description: "Suggested vocal timbre and style" },
        sunoPrompt: {
          type: SchemaType.STRING,
          description: "Dense comma-separated tags ready for Suno.ai/Udio",
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
              name: { type: SchemaType.STRING, description: "Color name" },
              hex: { type: SchemaType.STRING, description: "Hex code e.g. '#2A3439'" },
              role: { type: SchemaType.STRING, description: "Mood or element role" },
            },
            required: ["name", "hex"],
          },
          description: "3-4 distinct named colors",
        },
        imagery: {
          type: SchemaType.STRING,
          description: "Artistic concept for album cover art matching this scene",
        },
        imagePrompt: {
          type: SchemaType.STRING,
          description: "Dense ready-to-paste prompt for Midjourney / DALL-E",
        },
      },
      required: ["colorPalette", "imagery", "imagePrompt"],
    },
  },
  required: ["detectedLanguage", "lyrics", "music", "visual"],
};

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();
    const prompt = (body?.prompt || "").trim();
    const targetLanguage = (body?.targetLanguage || "auto").trim();
    const songType = (body?.songType || "auto").trim();
    const poeticVibe = (body?.poeticVibe || "deep-poetic").trim();
    const emotionalDepth = (body?.emotionalDepth || "heartfelt-raw").trim();
    const songEnding = (body?.songEnding || "emotional-punchline").trim();

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
        {
          error:
            "No API key configured. Please set GEMINI_API_KEY or ANTHROPIC_API_KEY in your environment variables (.env.local).",
        },
        { status: 500 }
      );
    }

    const systemInstruction = buildSystemInstruction(
      targetLanguage,
      songType,
      poeticVibe,
      emotionalDepth,
      songEnding
    );
    let resultData: GenerationResponse | null = null;

    // 1. Try Gemini (with model fallback chain)
    if (geminiKey) {
      const geminiModels = [
        "gemini-3.8-flash",           // Latest (may have high demand)
        "gemini-3.6-flash",           // Previous generation
        "gemini-2.0-flash",           // Stable
        "gemini-2.0-flash-lite",      // Lighter, more available
        "gemini-1.5-flash",           // Legacy fallback
        "gemini-1.5-flash-8b",        // Smallest, highest availability
      ];
      const promptText = `=== USER'S UNIQUE SCENE DESCRIPTION ===
"""
${prompt}
"""

TARGET SPECIFICATIONS:
- Output Language: ${targetLanguage}
- Song Type / Genre: ${songType}
- Poetic Vibe: ${poeticVibe}
- Emotional Soul: ${emotionalDepth}
- Ending Style: ${songEnding}

CRITICAL EXECUTION RULE:
Compose a song born 100% OUT OF THE USER'S SCENE ABOVE in the style of ${songType}.
Do NOT default to tea stalls, rain, or wooden benches unless specifically mentioned above.
Use the unique sights, objects, actions, and atmosphere of THIS scene.
Deliver human-touching lyrics with subtle subtext and an [Outro] that provides true closure.
Return strict JSON.`;

      let lastGeminiError = "";
      for (const modelName of geminiModels) {
        if (resultData) break;
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction,
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: geminiResponseSchema as any,
              temperature: 0.9,
            },
          });

          console.log(`Trying Gemini model: ${modelName}`);
          const response = await model.generateContent(promptText);
          const text = response.response.text();
          if (text) {
            resultData = JSON.parse(text) as GenerationResponse;
            resultData.targetLanguage =
              targetLanguage === "auto" ? resultData.detectedLanguage : targetLanguage;
            resultData.songType = songType;
            resultData.poeticVibe = poeticVibe;
            resultData.emotionalDepth = emotionalDepth;
            resultData.songEnding = songEnding;
          }
        } catch (geminiError: any) {
          const errMsg = geminiError?.message || String(geminiError);
          lastGeminiError = errMsg;
          console.error(`Gemini model ${modelName} failed:`, errMsg);
          // Continue to next model in chain
        }
      }

      // If all Gemini models failed and no Claude key, throw with the real error
      if (!resultData && !anthropicKey) {
        // Provide specific, actionable guidance based on error type
        let guidance = "Please get a free key at https://aistudio.google.com/app/apikey and update GEMINI_API_KEY in .env.local";
        if (lastGeminiError.includes("API_KEY_INVALID") || lastGeminiError.includes("400")) {
          guidance = "Your GEMINI_API_KEY appears to be invalid. Get a fresh key at https://aistudio.google.com/app/apikey and update it in .env.local (or in Vercel Environment Variables).";
        } else if (lastGeminiError.includes("QUOTA") || lastGeminiError.includes("429")) {
          guidance = "Your Gemini API quota has been exceeded. Either wait for the quota to reset, or get a new key at https://aistudio.google.com/app/apikey.";
        } else if (lastGeminiError.includes("503") || lastGeminiError.includes("Service Unavailable")) {
          guidance = "Gemini is temporarily overloaded. Please wait a minute and try again, or add ANTHROPIC_API_KEY to .env.local as a backup.";
        }
        throw new Error(`Gemini API failed: ${lastGeminiError}\n\n${guidance}`);
      }
    }

    // 2. Try Anthropic Claude Fallback
    if (!resultData && anthropicKey) {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const claudeMsg = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 3000,
        temperature: 0.9,
        system: `${systemInstruction}\n\nYou must reply ONLY with a valid JSON object matching this structure:
{
  "detectedLanguage": string,
  "targetLanguage": string,
  "songType": string,
  "poeticVibe": string,
  "emotionalDepth": string,
  "songEnding": string,
  "lyrics": string,
  "music": {
    "genre": string,
    "tempo": string,
    "instrumentation": string,
    "vocalStyle": string,
    "sunoPrompt": string
  },
  "visual": {
    "colorPalette": [
      { "name": string, "hex": string, "role": string }
    ],
    "imagery": string,
    "imagePrompt": string
  }
}`,
        messages: [
          {
            role: "user",
            content: `User Scene Description:\n"""\n${prompt}\n"""\n\nCompose a song strictly tailored to this unique scene in the genre of ${songType}, avoiding generic tropes. Return strict JSON.`,
          },
        ],
      });

      const firstContent = claudeMsg.content[0];
      if (firstContent.type === "text") {
        const cleaned = firstContent.text
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
        resultData = JSON.parse(cleaned) as GenerationResponse;
      }
    }

    if (!resultData) {
      return NextResponse.json(
        { error: "Failed to generate content from AI model." },
        { status: 500 }
      );
    }

    return NextResponse.json(resultData);
  } catch (error: any) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "An unexpected error occurred while generating your song. Please check your API key and try again.",
      },
      { status: 500 }
    );
  }
}
