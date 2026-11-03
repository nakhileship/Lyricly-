import { GenerateRequestBody } from "@/lib/types";

// ─────────────────────────────────────────────
// SONG TYPE INSTRUCTIONS
// ─────────────────────────────────────────────
export const SONG_TYPE_INSTRUCTIONS: Record<
  string,
  { label: string; instruction: string; structure: string }
> = {
  auto: {
    label: "Auto (AI Best Fit)",
    instruction:
      "Select the genre that most naturally matches the emotion, pacing, and mood of the described scene.",
    structure:
      "[Intro], [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Final Chorus], [Outro]",
  },
  "indie-acoustic": {
    label: "Indie / Acoustic Folk",
    instruction:
      "Warm acoustic guitars, fingerpicking, intimate and vulnerable vocal delivery, organic percussion, rich poetic subtext, unvarnished human truth.",
    structure:
      "[Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Final Chorus], [Outro]",
  },
  "rap-hiphop": {
    label: "Rap / Hip-Hop",
    instruction:
      "Hard-hitting rhythmic flow, internal rhymes, multisyllabic rhyme schemes, punchy cadence, wordplay, catchy melodic hook. Each verse is 16 bars. Mark [Hook] for the repeated chorus.",
    structure:
      "[Intro], [Verse 1 (16 bars)], [Hook], [Verse 2 (16 bars)], [Hook], [Bridge / Beat Switch], [Hook], [Outro]",
  },
  "melody-ghazal": {
    label: "Melody / Classical / Ghazal",
    instruction:
      "Flowing melodious lines, classical raga sensibilities, soaring emotive vocal phrasing, gentle traditional orchestration (violins, flutes, sitar/tabla). For ghazal: each couplet must be self-contained.",
    structure:
      "[Pallavi], [Anupallavi], [Pallavi], [Charanam 1], [Pallavi], [Charanam 2], [Pallavi], [Outro]",
  },
  "pop-synth": {
    label: "Pop / Synth-Pop",
    instruction:
      "Radio-ready anthemic hooks, driving upbeat pulse or modern 80s synth textures, memorable pre-chorus builds, irresistible singalong choruses.",
    structure:
      "[Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Final Chorus], [Outro]",
  },
  "rock-alternative": {
    label: "Rock / Alternative",
    instruction:
      "Gritty energy, driving live drums, raw electric guitar riffs, passionate vocal power, dynamic contrast between moody verses and explosive choruses.",
    structure:
      "[Intro], [Verse 1], [Chorus], [Verse 2], [Chorus], [Guitar Solo / Bridge], [Final Chorus], [Outro]",
  },
  "rnb-soul": {
    label: "R&B / Soul",
    instruction:
      "Smooth laid-back groove, lush seventh chords, melismatic vocal runs, deep emotional pocket, sensual or vulnerable romantic confession.",
    structure:
      "[Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Final Chorus], [Outro]",
  },
  "lofi-chill": {
    label: "Lo-Fi / Chillhop",
    instruction:
      "Mellow, relaxed, dusty vinyl warmth, laid-back jazzy chords, whispered or spoken-sung intimate cadence, nostalgic loop vibes.",
    structure: "[Verse 1], [Hook], [Verse 2], [Hook], [Bridge], [Outro]",
  },
  "electronic-edm": {
    label: "EDM / Electronic",
    instruction:
      "Hypnotic synthesizer sequences, rising energy, euphoric drops, rhythmic vocal hooks, and high-energy propulsion.",
    structure:
      "[Verse 1], [Build-up], [Drop / Chorus], [Verse 2], [Build-up], [Drop / Chorus], [Outro]",
  },
  "reggae-dub": {
    label: "Reggae / Dub",
    instruction:
      "Relaxed offbeat guitar skank, deep rolling bassline, conscious or chilled sunny storytelling, rhythmic vocal delivery.",
    structure:
      "[Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Final Chorus], [Outro]",
  },
  devotional: {
    label: "Devotional / Bhajan / Qawwali",
    instruction:
      "Devotional intent, repetitive meditative refrains, call-and-response patterns, sacred imagery, pure and uplifting. Bhajan style for Hindu traditions, Qawwali for Sufi traditions.",
    structure:
      "[Sthayi / Main Refrain], [Antara 1], [Sthayi], [Antara 2], [Sthayi], [Outro]",
  },
  "kids-nursery": {
    label: "Kids / Nursery Rhyme",
    instruction:
      "Simple vocabulary (max 2 syllable words), strong repetition, playful sounds and onomatopoeia, fun and safe content, consistent AABB rhyme scheme, upbeat and cheerful.",
    structure:
      "[Verse 1 (4 lines)], [Chorus (4 lines)], [Verse 2 (4 lines)], [Chorus], [Outro (2 lines)]",
  },
  "kpop-style": {
    label: "K-Pop Style",
    instruction:
      "Catchy Korean pop style with mix of Korean and English phrases, punchy verse delivery, melodic pre-chorus build, explosive anthemic chorus, rap bridge section.",
    structure:
      "[Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Pre-Chorus], [Chorus], [Rap Bridge], [Final Chorus], [Outro]",
  },
  "film-melody": {
    label: "Film / Cinematic",
    instruction:
      "Cinematic storytelling arc, orchestral feel, emotionally climactic, built for a visual scene. Rich imagery-driven narrative with a powerful emotional peak.",
    structure:
      "[Theme / Intro], [Verse 1], [Chorus], [Verse 2], [Chorus], [Emotional Bridge / Key Change], [Final Chorus], [Outro]",
  },
};

// ─────────────────────────────────────────────
// EMOTIONAL DEPTH INSTRUCTIONS
// ─────────────────────────────────────────────
export const EMOTIONAL_DEPTH_INSTRUCTIONS: Record<string, string> = {
  "heartfelt-raw":
    "Raw, Heart-Touching & Intimate: Write with genuine vulnerability, emotional weight, and unpretentious human truth. Avoid abstract clichés; focus on micro-actions, hesitations, and real human details that make the chest ache. Let the emotion feel earned.",
  "bittersweet-longing":
    "Bittersweet Longing: Capture the ache of passing time, distance between people, unsaid goodbyes, and memories triggered by familiar sights or scents in this scene.",
  "contemplative-soulful":
    "Soulful & Philosophical: Deep and reflective. The specific scene becomes a mirror to life, existence, and the quiet inner landscape of a person.",
  "warm-comfort":
    "Warm, Tender & Comforting: A soothing embrace. Convey tenderness, hope, companionship, and the quiet beauty of small shared moments.",
};

// ─────────────────────────────────────────────
// SONG ENDING INSTRUCTIONS
// ─────────────────────────────────────────────
export const SONG_ENDING_INSTRUCTIONS: Record<string, string> = {
  "lingering-fade":
    "Lingering Fadeout: End on a haunting, unresolved detail or unanswered whisper that echoes in the listener's mind. Do NOT resolve — leave a trace.",
  "emotional-punchline":
    "Emotional Climax: The Outro delivers a powerful, touching closing realization that ties the entire story together and brings deep emotional closure.",
  "quiet-acceptance":
    "Quiet Acceptance: The song reaches serene, peaceful resolution — accepting the moment, letting the breath out, and quietly moving forward.",
  "hopeful-resolution":
    "Hopeful Resolution: End with forward-looking warmth — the weight of the scene transforms into quiet strength or a gentle reason to carry on.",
  "open-ending":
    "Open Ending: Leave the final line deliberately ambiguous — the listener completes the meaning. No moral, no tidy bow.",
};

// ─────────────────────────────────────────────
// POETIC VIBE DESCRIPTIONS
// ─────────────────────────────────────────────
export const POETIC_VIBE_DESCRIPTIONS: Record<string, string> = {
  "deep-poetic":
    "Deeply Poetic & Metaphorical: Rich literary metaphors, evocative imagery, and melodic cadence inspired by master poets (ONV Kurup, Gulzar, Pablo Neruda, Leonard Cohen).",
  "nostalgic-solitary":
    "Nostalgic & Solitary: Wistful, bittersweet atmosphere of passing time, solitude, and quiet yearning.",
  "romantic-melodic":
    "Romantic & Soulful: Tender romance, gentle touch, emotional intimacy, sweet melodic flow.",
  "cinematic-storytelling":
    "Cinematic & Dramatic: Narrative progression with atmospheric build, emotional tension, and vivid scene changes.",
  "folk-pop":
    "Folk & Contemporary Groove: Earthy, organic rhythm, conversational yet deeply poetic expressions, and singable refrains.",
};

// ─────────────────────────────────────────────
// BUILD SYSTEM PROMPT
// ─────────────────────────────────────────────
export function buildSystemInstruction(body: GenerateRequestBody): string {
  const {
    targetLanguage = "auto",
    songType = "auto",
    poeticVibe = "deep-poetic",
    emotionalDepth = "heartfelt-raw",
    songEnding = "emotional-punchline",
    perspective = "first-person",
    voice = "auto",
    tempo = "auto",
    songLength = "2:30",
    structure = "standard",
    referenceVibe = "",
    specificDetails = "",
    wordsToAvoid = "",
    targetAudience = "general",
    scriptStyle = "native",
  } = body;

  const songTypeInfo =
    SONG_TYPE_INSTRUCTIONS[songType] || SONG_TYPE_INSTRUCTIONS["auto"];
  const vibeInstruction =
    POETIC_VIBE_DESCRIPTIONS[poeticVibe] || POETIC_VIBE_DESCRIPTIONS["deep-poetic"];
  const emotionalInstruction =
    EMOTIONAL_DEPTH_INSTRUCTIONS[emotionalDepth] || EMOTIONAL_DEPTH_INSTRUCTIONS["heartfelt-raw"];
  const endingInstruction =
    SONG_ENDING_INSTRUCTIONS[songEnding] || SONG_ENDING_INSTRUCTIONS["emotional-punchline"];

  // Song length → verse count
  const lengthGuide =
    songLength === "1:30"
      ? "Short form: 1 verse + chorus + outro (~1:30). Tight, focused."
      : songLength === "3:30"
      ? "Full length: 2 verses + 2 choruses + bridge + outro (~3:30). Full arc."
      : "Standard: 2 verses + 2 choruses + bridge + outro (~2:30).";

  // Structure override
  const structureGuide =
    structure === "reel"
      ? "Short-form reel (45 sec): Start with the HOOK first, then 1 verse, hook repeat, fast outro."
      : structure === "kids"
      ? "Kids rhyme structure: Simple AABB repeating verse + chorus + 1 more verse + chorus."
      : structure === "custom"
      ? `Follow the song type's recommended structure: ${songTypeInfo.structure}`
      : songTypeInfo.structure;

  // Language guidance
  const languageGuidance =
    targetLanguage && targetLanguage.toLowerCase() !== "auto"
      ? `OUTPUT LANGUAGE: **${targetLanguage}**
- Write DIRECTLY in ${targetLanguage} authentic script and spoken register.
- Do NOT translate from English first — compose natively in ${targetLanguage}.
- Script style: ${scriptStyle === "romanized" ? "Write in romanized/phonetic Latin script (no native script)." : scriptStyle === "both" ? "Write in native script AND provide romanized version labeled [Phonetic]." : "Use native script exclusively."}`
      : `COMPOSE IN THE INPUT LANGUAGE:
- Auto-detect the language from the scene description and write lyrics in that same language.
- Use authentic spoken register, not textbook or formal register.
- If Malayalam: use natural Malayalam script. If Hindi: Devanagari. Etc.`;

  // Banned words list
  const builtInBanList = [
    "heart is broken", "tears like rain", "shattered dreams",
    "journey of life", "endless love", "stars in your eyes",
    "ocean of pain", "wings to fly", "follow your heart",
    "live your life", "rise and shine",
  ];
  const userBanList = wordsToAvoid
    ? wordsToAvoid.split(",").map((w) => w.trim()).filter(Boolean)
    : [];
  const allBanned = [...builtInBanList, ...userBanList];

  // Perspective
  const perspectiveGuide =
    perspective === "duet"
      ? "PERSPECTIVE: Duet — two distinct voices. Mark lines [Voice A] and [Voice B]. They may harmonize on the chorus."
      : perspective === "second-person"
      ? "PERSPECTIVE: Second person (you/your). Address the listener or a specific person directly."
      : perspective === "third-person"
      ? "PERSPECTIVE: Third person — tell the story of someone else (he/she/they)."
      : "PERSPECTIVE: First person (I/my/me). Personal, confessional, intimate.";

  // Voice
  const voiceGuide = voice && voice !== "auto"
    ? `VOICE TYPE: ${voice}. Reflect this in vocal style, phrasing, and Suno style prompt.`
    : "";

  // Reference vibe
  const refVibeGuide = referenceVibe
    ? `REFERENCE VIBE: "${referenceVibe}" — Capture the feel and mood of this reference but write 100% ORIGINAL lyrics, no direct quotes or close imitations.`
    : "";

  // Specific details
  const detailsGuide = specificDetails
    ? `SPECIFIC DETAILS TO USE: ${specificDetails}\nWeave these naturally — names, places, objects — into the imagery. They make the song feel real and personal.`
    : "";

  // Target audience
  const audienceGuide =
    targetAudience === "kids"
      ? "AUDIENCE: Kids — simple words, safe content, playful, no adult themes."
      : targetAudience === "wedding"
      ? "AUDIENCE: Wedding/event — celebratory, emotional, inclusive, personal."
      : targetAudience === "devotional"
      ? "AUDIENCE: Devotional — sacred, uplifting, reverent."
      : targetAudience === "reels"
      ? "AUDIENCE: Social media reels — punchy opening line, hook in first 5 seconds."
      : "";

  return `You are a veteran songwriter and lyricist fluent in the requested language and its culture. Write lyrics that feel lived-in, human, and singable.

═══════════════════════════════════════════════
CORE RULES — READ BEFORE WRITING
═══════════════════════════════════════════════

1. SCENE GROUNDING (MOST IMPORTANT):
   - Draw ALL imagery, metaphors, objects, and settings EXCLUSIVELY from the user's scene description.
   - Do NOT import default unrelated elements (tea stalls, rain, trains, beaches) UNLESS mentioned by the user.
   - Every song must feel 100% unique to THIS user's exact words.

2. HUMAN LYRICS QUALITY:
   - Build every verse from CONCRETE images: objects, places, smells, sounds, small actions.
   - SHOW the feeling through action — never name the emotion directly.
   - Use natural, spoken-register language of ${targetLanguage !== "auto" ? targetLanguage : "the target language"}, the way real people talk.
   - Do NOT rhyme every line perfectly. Mix perfect rhyme, slant rhyme, and plain unrhymed lines.
   - Keep matching lines within 1-2 syllables of each other so a melody fits naturally.

3. SONG STRUCTURE:
   - Song type: **${songTypeInfo.label}** — ${songTypeInfo.instruction}
   - Structure: ${structureGuide}
   - Length guide: ${lengthGuide}
   - ${perspectiveGuide}
   - ${voiceGuide}
   - Tempo: ${tempo !== "auto" ? tempo : "match the emotional weight of the scene"}

4. HOOK:
   - Create one strong hook line (5-8 words) that repeats in the chorus.
   - The hook should work as the song title and be memorable in isolation.

5. ENDING STYLE: ${endingInstruction}

6. EMOTIONAL SOUL: ${emotionalInstruction}

7. POETIC TONE: ${vibeInstruction}

8. LANGUAGE & SCRIPT:
   ${languageGuidance}

9. BANNED CLICHÉS (never use any of these):
   ${allBanned.map((b) => `"${b}"`).join(", ")}

10. SAFETY: Safe content only. No hate, no glorification of self-harm, no sexual content involving minors.

${refVibeGuide}
${detailsGuide}
${audienceGuide}
${
  targetAudience === "kids" || songType === "kids-nursery"
    ? "KIDS RULES: Simple words only (≤2 syllables preferred), repetition, playful sounds, AABB rhyme scheme."
    : ""
}

═══════════════════════════════════════════════
OUTPUT FORMAT — STRICT JSON
═══════════════════════════════════════════════

Return a JSON object with:
- titles: array of 3 creative title options for this song
- lyrics: full lyrics with Suno-style section tags like [Verse 1], [Chorus], [Bridge] etc. For duets, mark [Male] and [Female] lines.
- phoneticHelper: ONLY for non-English/non-Latin-script languages — a romanized/phonetic version of words Suno may mispronounce. If English or romanized output: leave empty string.
- music.genre, music.tempo, music.instrumentation, music.vocalStyle, music.sunoPrompt (≤120 chars English, includes language + genre + voice + instruments + tempo + mood), music.negativeStyleTags
- visual.colorPalette (3-4 colors with name/hex/role), visual.imagery, visual.imagePrompt
- youtubeMeta.title, youtubeMeta.description (2-3 sentences), youtubeMeta.hashtags (array of 10 strings without #)
- detectedLanguage, targetLanguage, songType, poeticVibe, emotionalDepth, songEnding

Always return strict, valid JSON matching the schema.`;
}

// ─────────────────────────────────────────────
// BUILD POLISH / SELF-CRITIQUE PROMPT
// ─────────────────────────────────────────────
export function buildPolishPrompt(
  originalLyrics: string,
  targetLanguage: string,
  songType: string
): string {
  return `You are a professional song editor and lyricist. Your job is to improve the following ${targetLanguage} ${songType} lyrics — but ONLY fix genuinely weak lines. Do NOT rewrite the entire song.

ORIGINAL LYRICS TO REVIEW:
"""
${originalLyrics}
"""

EDITORIAL CHECKLIST — check each:
1. CLICHÉS: Flag and rewrite any clichéd phrases or abstract filler words.
2. RHYME FORCING: Identify any lines where a rhyme distorts the natural meaning. Fix them with slant rhyme or no rhyme.
3. SYLLABLE MISMATCH: Check that paired lines (verse line 1 & 3, line 2 & 4) are within 2 syllables of each other.
4. HOOK STRENGTH: Is the hook (chorus key line) memorable and 5-8 words? If not, sharpen it.
5. ENDING: Does the outro/last line land with a definite emotional note? If not, improve it.
6. SPECIFICITY: Any lines that are vague or generic? Replace with specific imagery from the original prompt context.

RULES FOR YOUR EDIT:
- Fix ONLY the lines that fail the checks above.
- Keep ALL strong lines exactly as they are — do not "improve" what already works.
- Preserve the section structure ([Verse 1], [Chorus], etc.).
- Output the FINAL IMPROVED lyrics only — no editor notes, no explanations, just the lyrics.
- The output must be in ${targetLanguage}.`;
}
