"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Sparkles,
  Music2,
  Image as ImageIcon,
  Copy,
  Check,
  Languages,
  Loader2,
  AlertCircle,
  CornerDownLeft,
  RotateCcw,
  Palette,
  Disc3,
  Mic2,
  Sliders,
  Feather,
  BookOpen,
  Heart,
  CloudRain,
  Film,
  Music,
  ChevronDown,
  Flame,
  Coffee,
  Compass,
  CheckCircle2,
  Moon,
  Download,
  History,
  Trash2,
  ExternalLink,
  ChevronUp,
  Mic,
  Radio,
  Disc,
  Zap,
  FileText,
  SlidersHorizontal,
  RefreshCw,
  Sun,
  Baby,
  Clapperboard,
  Search,
  X,
  Volume2,
  Clock,
  Layers,
  Users,
  Eye,
  Type,
  CheckCheck,
} from "lucide-react";
import { GenerationResponse } from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// TYPES & DATA STRUCTURES
// ─────────────────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  language?: string;
  result: GenerationResponse;
}

// ─────────────────────────────────────────────────────────────
// MULTILINGUAL SCENE STARTERS (Pool of 12)
// ─────────────────────────────────────────────────────────────
const SCENE_STARTERS = [
  {
    id: "malayalam-1",
    label: "🍵 ചായക്കടയിൽ (Malayalam)",
    text: "നാട്ടിൻപുറത്തെ പഴയ ചായക്കടയിൽ മഴക്കാലത്തെ സായാഹ്നം. പുറത്ത് തോരാത്ത മഴ, റേഡിയോയിൽ യേശുദാസിന്റെ പഴയ പാട്ട്, ഗ്ലാസിലെ ചൂടുള്ള കട്ടൻചായ.",
  },
  {
    id: "malayalam-2",
    label: "🌊 കടൽത്തീരം (Malayalam)",
    text: "വൈകുന്നേരം കടൽത്തീരത്ത് ഒറ്റയ്ക്ക് നടക്കുന്നു. തിരമാലകൾ തൊടുന്ന കാൽ, ദൂരെ കൊളുത്തിയ വിളക്കുമരം, കൈയിൽ ഒരു പഴയ ഫോട്ടോ.",
  },
  {
    id: "malayalam-3",
    label: "🚂 രാത്രി തീവണ്ടി (Malayalam)",
    text: "അർദ്ധരാത്രിയിലെ ജനറൽ കംപാർട്ട്മെന്റിൽ ജനലരികിൽ. ദൂരെ ഇരുണ്ട കടലിലെ നിലാവ്, ചക്രങ്ങളുടെ താളം, മനസ്സിൽ നഷ്ടബോധം.",
  },
  {
    id: "english-1",
    label: "🌃 Midnight Tokyo (English)",
    text: "Standing under a transparent umbrella in Shinjuku at midnight. Neon reflections in asphalt puddles, distant train hum, and the feeling of being the only person awake.",
  },
  {
    id: "english-2",
    label: "☕ Empty Coffee Shop (English)",
    text: "Last customer in a closing coffee shop. The barista sweeps quietly. Rain on the window. An unread text on the phone. The decision not made yet.",
  },
  {
    id: "hindi-1",
    label: "🌾 खेतों की शाम (Hindi)",
    text: "शाम को खेतों में काम के बाद घर लौटना। हाथ में मिट्टी, कंधे पर थकान, पर दिल में सुकून। दूर से आती माँ की आवाज़।",
  },
  {
    id: "hindi-2",
    label: "🏙️ दिल्ली की भीड़ (Hindi)",
    text: "दिल्ली मेट्रो में भीड़ के बीच अकेलापन। हर कोई अपनी दुनिया में। खिड़की से दिखते शहर के उजाले और एक अधूरा ख्वाब।",
  },
  {
    id: "tamil-1",
    label: "🌺 மழை நேரம் (Tamil)",
    text: "பஸ் நிறுத்தத்தில் மழையில் நனைந்து நிற்கிறேன். யாரோ ஒருவர் குடையை பகிர்ந்தார். அந்த ஒரு நிமிடம் — இப்போதும் மறக்கவில்லை.",
  },
  {
    id: "tamil-2",
    label: "🎭 கோயில் திருவிழா (Tamil)",
    text: "ஊர் திருவிழாவில் அம்மாவின் கையை பிடித்து நடந்த நினைவு. தேங்காய் வாசனை, சந்தனம், கோலாகலம் — மனதில் இன்னும் அந்த இரவு.",
  },
  {
    id: "spanish-1",
    label: "🌅 Atardecer (Spanish)",
    text: "Sentado en el muelle al atardecer, viendo los barcos de pesca regresar. El olor a sal y frituras desde el mercado. Una carta que nunca envié.",
  },
  {
    id: "korean-1",
    label: "🏙️ 서울 밤 (Korean)",
    text: "한강 다리 위에서 밤바람을 맞으며. 아래로 흐르는 강물, 멀리 빛나는 도시 불빛, 오래된 노래 하나가 떠오른다.",
  },
  {
    id: "korean-2",
    label: "☔ 빗속의 버스 (Korean)",
    text: "빗속에서 버스를 기다리는데 옆에 앉 contest 할머니가 말을 걸었다. 짧은 대화였지만, 집에 가고 싶어졌다.",
  },
];

// ─────────────────────────────────────────────────────────────
// 30+ TARGET LANGUAGES
// ─────────────────────────────────────────────────────────────
const TARGET_LANGUAGES = [
  { id: "auto", label: "Auto (Same as input)" },
  { id: "mixed-codeswitch", label: "Mixed / Code-switch (Manglish, Hinglish, Tanglish)" },
  // South Asian
  { id: "Malayalam", label: "Malayalam (മലയാളം)" },
  { id: "Hindi", label: "Hindi (हिन्दी)" },
  { id: "Tamil", label: "Tamil (தமிழ்)" },
  { id: "Telugu", label: "Telugu (తెలుగు)" },
  { id: "Kannada", label: "Kannada (ಕನ್ನಡ)" },
  { id: "Bengali", label: "Bengali (বাংলা)" },
  { id: "Marathi", label: "Marathi (मराठी)" },
  { id: "Punjabi", label: "Punjabi (ਪੰਜਾਬੀ)" },
  { id: "Gujarati", label: "Gujarati (ગુજરાતી)" },
  { id: "Urdu", label: "Urdu (اردو)" },
  // European
  { id: "English", label: "English" },
  { id: "Spanish", label: "Spanish (Español)" },
  { id: "French", label: "French (Français)" },
  { id: "German", label: "German (Deutsch)" },
  { id: "Italian", label: "Italian (Italiano)" },
  { id: "Portuguese", label: "Portuguese (Português)" },
  { id: "Russian", label: "Russian (Русский)" },
  { id: "Ukrainian", label: "Ukrainian (Українська)" },
  // Middle Eastern
  { id: "Arabic", label: "Arabic (العربية)" },
  { id: "Turkish", label: "Turkish (Türkçe)" },
  { id: "Persian", label: "Persian (فارسی)" },
  // East & Southeast Asian
  { id: "Japanese", label: "Japanese (日本語)" },
  { id: "Korean", label: "Korean (한국어)" },
  { id: "Chinese (Simplified)", label: "Chinese Simplified (简体中文)" },
  { id: "Chinese (Traditional)", label: "Chinese Traditional (繁體中文)" },
  { id: "Indonesian", label: "Indonesian (Bahasa Indonesia)" },
  { id: "Vietnamese", label: "Vietnamese (Tiếng Việt)" },
  { id: "Thai", label: "Thai (ไทย)" },
  // African
  { id: "Swahili", label: "Swahili (Kiswahili)" },
  // Custom
  { id: "custom", label: "Custom (Type your own)" },
];

const NON_LATIN_LANGUAGES = new Set([
  "Malayalam",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
  "Marathi",
  "Punjabi",
  "Gujarati",
  "Urdu",
  "Arabic",
  "Persian",
  "Japanese",
  "Korean",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Russian",
  "Ukrainian",
  "Thai",
]);

// ─────────────────────────────────────────────────────────────
// SONG TYPES & GENRES (Expanded with 4 new genres)
// ─────────────────────────────────────────────────────────────
const SONG_TYPES = [
  {
    id: "auto",
    name: "Auto (AI Best Fit)",
    sub: "Matches scene rhythm",
    icon: Sparkles,
  },
  {
    id: "indie-acoustic",
    name: "Indie / Acoustic",
    sub: "Warm guitars, organic intimacy",
    icon: Music2,
  },
  {
    id: "melody-ghazal",
    name: "Melody / Ghazal",
    sub: "ഭാവഗീതം / Soaring classical melody",
    icon: Radio,
  },
  {
    id: "film-melody",
    name: "Film / Cinematic",
    sub: "സിനിമാറ്റിക് ഗാനം / Big emotional arc",
    icon: Clapperboard,
  },
  {
    id: "devotional",
    name: "Devotional / Bhajan",
    sub: "ഭക്തിസാന്ദ്രം / Sacred spiritual chant",
    icon: Sun,
  },
  {
    id: "rap-hiphop",
    name: "Rap / Hip-Hop",
    sub: "Rhythmic flow & 16-bar verses",
    icon: Mic,
  },
  {
    id: "pop-synth",
    name: "Pop / Synth-Pop",
    sub: "Catchy anthemic hooks",
    icon: Disc,
  },
  {
    id: "kpop-style",
    name: "K-Pop Style",
    sub: "High-energy hooks & syncopation",
    icon: Sparkles,
  },
  {
    id: "kids-nursery",
    name: "Kids / Nursery Rhyme",
    sub: "Playful, bright & bouncy rhythm",
    icon: Baby,
  },
  {
    id: "rock-alternative",
    name: "Rock / Alternative",
    sub: "Gritty guitars & live energy",
    icon: Zap,
  },
  {
    id: "rnb-soul",
    name: "R&B / Soul",
    sub: "Lush chords, groove & melisma",
    icon: Heart,
  },
  {
    id: "lofi-chill",
    name: "Lo-Fi / Chillhop",
    sub: "Dusty vinyl, laid-back loops",
    icon: Coffee,
  },
  {
    id: "electronic-edm",
    name: "EDM / Electronic",
    sub: "High energy, synth builds",
    icon: Sliders,
  },
  {
    id: "reggae-dub",
    name: "Reggae / Dub",
    sub: "Offbeat skank & deep basslines",
    icon: Music,
  },
];

// ─────────────────────────────────────────────────────────────
// POETIC VIBES
// ─────────────────────────────────────────────────────────────
const POETIC_VIBES = [
  {
    id: "deep-poetic",
    name: "Deep Poetry & Metaphors",
    sub: "ആഴമേറിയ കവിത (Rich imagery & depth)",
    icon: BookOpen,
  },
  {
    id: "nostalgic-solitary",
    name: "Nostalgic & Melancholic",
    sub: "ഓർമ്മകൾ / ഏകാന്തത (Rain, wistful solitude)",
    icon: CloudRain,
  },
  {
    id: "romantic-melodic",
    name: "Romantic & Soulful",
    sub: "പ്രണയാർദ്രം (Sweet tender melody)",
    icon: Heart,
  },
  {
    id: "cinematic-storytelling",
    name: "Cinematic & Epic",
    sub: "സിനിമാറ്റിക് (Grand dramatic arc)",
    icon: Film,
  },
  {
    id: "folk-pop",
    name: "Folk & Catchy Rhythm",
    sub: "നാടൻ പോപ്പ് (Earthy rhythm & hooks)",
    icon: Music,
  },
];

// ─────────────────────────────────────────────────────────────
// EMOTIONAL DEPTHS
// ─────────────────────────────────────────────────────────────
const EMOTIONAL_DEPTHS = [
  {
    id: "heartfelt-raw",
    name: "Raw & Heart-Touching",
    desc: "ഉള്ള് തൊടുന്ന ഭാവം — Genuine vulnerability, tears in the throat, unpretentious truth",
    icon: Flame,
    color: "text-amber-400",
  },
  {
    id: "bittersweet-longing",
    name: "Bittersweet Longing",
    desc: "നൊമ്പരം / വിരഹം — The ache of passing time, unsaid goodbyes, missing a person",
    icon: Moon,
    color: "text-rose-400",
  },
  {
    id: "contemplative-soulful",
    name: "Soulful & Philosophical",
    desc: "ആത്മഗതം — Quiet introspection, observing life's transient beauty",
    icon: Compass,
    color: "text-sky-400",
  },
  {
    id: "warm-comfort",
    name: "Warm & Comforting",
    desc: "ആർദ്രമായ സാന്ത്വനം — Tender embrace, hope, comforting companionship",
    icon: Coffee,
    color: "text-emerald-400",
  },
];

// ─────────────────────────────────────────────────────────────
// SONG ENDINGS
// ─────────────────────────────────────────────────────────────
const SONG_ENDINGS = [
  {
    id: "emotional-punchline",
    label: "Emotional Climax (വൈകാരികമായ പൂർണ്ണത)",
    desc: "Ends with a powerful, touching realization that gives the song complete closure",
  },
  {
    id: "lingering-fade",
    label: "Lingering Fadeout (മാഞ്ഞുപോകുന്ന പര്യവസാനം)",
    desc: "Ends on a haunting unanswered whisper or detail that echoes in the listener's heart",
  },
  {
    id: "quiet-acceptance",
    label: "Quiet Acceptance (ശാന്തമായ യാത്രാമൊഴി)",
    desc: "Ends with peaceful resolution, letting go of the moment and moving forward",
  },
];

// ─────────────────────────────────────────────────────────────
// LOADING MESSAGES CYCLING
// ─────────────────────────────────────────────────────────────
const LOADING_TEXTS = [
  "✍️ Writing your song draft...",
  "🎵 Shaping the melody structure...",
  "💫 Polishing the lines...",
  "🎨 Crafting music & visual direction...",
  "✅ Finalizing your Suno package...",
];

// Helper to format history timestamps
function formatHistoryDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Home() {
  // Primary generation parameters
  const [prompt, setPrompt] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("auto");
  const [customLanguage, setCustomLanguage] = useState("");
  const [songType, setSongType] = useState("auto");
  const [poeticVibe, setPoeticVibe] = useState("deep-poetic");
  const [emotionalDepth, setEmotionalDepth] = useState("heartfelt-raw");
  const [songEnding, setSongEnding] = useState("emotional-punchline");

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [perspective, setPerspective] = useState("first-person");
  const [voice, setVoice] = useState("auto");
  const [tempo, setTempo] = useState("auto");
  const [songLength, setSongLength] = useState("2:30");
  const [structure, setStructure] = useState("standard");
  const [referenceVibe, setReferenceVibe] = useState("");
  const [specificDetails, setSpecificDetails] = useState("");
  const [wordsToAvoid, setWordsToAvoid] = useState("");
  const [targetAudience, setTargetAudience] = useState("general");
  const [scriptStyle, setScriptStyle] = useState<"native" | "romanized" | "both">("native");
  const [polishPass, setPolishPass] = useState(true);

  // UI & Response states
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [starterPage, setStarterPage] = useState(0);

  // Collapsible section toggles
  const [showPhonetic, setShowPhonetic] = useState(true);
  const [showYoutubeMeta, setShowYoutubeMeta] = useState(false);

  // Refs
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lyricly_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Keyboard shortcut: Ctrl + Shift + C to copy all
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        const text =
          result?.sunoBlock ||
          (result
            ? `[Style of Music]\n${result.music.sunoPrompt}\n\n[Lyrics]\n${result.lyrics}`
            : "");
        if (text) {
          navigator.clipboard.writeText(text);
          setCopiedKey("copyAll");
          setTimeout(() => setCopiedKey(null), 2200);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [result]);

  // Clean up loading timer on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
      }
    };
  }, []);

  const effectiveTargetLanguage =
    targetLanguage === "custom"
      ? customLanguage.trim() || "auto"
      : targetLanguage;

  const showScriptStyleOption =
    effectiveTargetLanguage === "auto" ||
    effectiveTargetLanguage === "mixed-codeswitch" ||
    NON_LATIN_LANGUAGES.has(effectiveTargetLanguage) ||
    targetLanguage === "custom";

  const saveToHistory = (promptText: string, resData: GenerationResponse) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: promptText,
        language: resData.targetLanguage || resData.detectedLanguage,
        result: resData,
      };
      const updated = [newItem, ...history.filter((h) => h.prompt !== promptText)].slice(0, 20);
      setHistory(updated);
      localStorage.setItem("lyricly_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("lyricly_history");
    } catch (e) {
      console.error(e);
    }
  };

  const restoreFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setLastGeneratedPrompt(item.prompt);
    setResult(item.result);
    if (item.result.songType) setSongType(item.result.songType);
    if (item.result.poeticVibe) setPoeticVibe(item.result.poeticVibe);
    if (item.result.emotionalDepth) setEmotionalDepth(item.result.emotionalDepth);
    if (item.result.songEnding) setSongEnding(item.result.songEnding);
    setShowHistory(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const title = result.titles?.[0] || "Untitled";
    const content = `================================================
LYRICLY — SONG CREATION EXPORT
================================================
Title: ${title}
${result.titles && result.titles.length > 1 ? `Alternative Titles:\n${result.titles.map((t) => ` - ${t}`).join("\n")}\n` : ""}
Scene: ${lastGeneratedPrompt}
Language: ${result.targetLanguage || result.detectedLanguage}
Song Type / Genre: ${result.songType || songType}
Poetic Vibe: ${result.poeticVibe || poeticVibe}
Emotional Depth: ${result.emotionalDepth || emotionalDepth}
Ending Style: ${result.songEnding || songEnding}
${result.polished ? "Quality: AI-Polished Pass Applied\n" : ""}
================================================
LYRICS
================================================
${result.lyrics}

${result.phoneticHelper ? `================================================
PHONETIC HELPER (FOR SUNO AI SINGING)
================================================
${result.phoneticHelper}
\n` : ""}================================================
MUSIC DIRECTION (SUNO.AI / UDIO)
================================================
Genre: ${result.music.genre}
Tempo: ${result.music.tempo}
Instrumentation: ${result.music.instrumentation}
${result.music.vocalStyle ? `Vocal Style: ${result.music.vocalStyle}\n` : ""}
Ready Suno/Udio Style Prompt:
${result.music.sunoPrompt}

${result.music.negativeStyleTags ? `Negative Tags to Exclude:\n${result.music.negativeStyleTags}\n` : ""}
================================================
VISUAL DIRECTION (MIDJOURNEY / DALL-E)
================================================
Color Palette:
${result.visual.colorPalette.map((c) => `- ${c.name} (${c.hex}) [${c.role || "Accent"}]`).join("\n")}

Visual Concept:
${result.visual.imagery}

Ready Cover Art Prompt:
${result.visual.imagePrompt}

${result.youtubeMeta ? `================================================
YOUTUBE METADATA
================================================
Title: ${result.youtubeMeta.title}

Description:
${result.youtubeMeta.description}

Hashtags:
${result.youtubeMeta.hashtags.join(" ")}
` : ""}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lyricly-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    if (!result) return;
    const title = result.titles?.[0] || "Untitled";
    const content = `# ${title}\n\n**Scene:** ${lastGeneratedPrompt}\n**Language:** ${result.targetLanguage || result.detectedLanguage}\n\n## Lyrics\n\n${result.lyrics}\n\n## Music Direction\n\n- **Genre:** ${result.music.genre}\n- **Tempo:** ${result.music.tempo}\n- **Instruments:** ${result.music.instrumentation}\n- **Suno Prompt:** \`${result.music.sunoPrompt}\`\n${result.music.negativeStyleTags ? `- **Negative Tags:** ${result.music.negativeStyleTags}` : ""}\n\n## Visual Direction\n\n${result.visual.imagery}\n\n**Cover Art Prompt:** ${result.visual.imagePrompt}\n`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lyricly-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Execution engine: handles generate, regenerate, and variants
  const executeGeneration = async (overridePrompt?: string) => {
    const textToSubmit = (overridePrompt ?? prompt).trim();
    if (!textToSubmit || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLastGeneratedPrompt(textToSubmit);

    // Start cycling loading text every 3 seconds
    let textIdx = 0;
    setLoadingText(LOADING_TEXTS[0]);
    if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    loadingTimerRef.current = setInterval(() => {
      textIdx = (textIdx + 1) % LOADING_TEXTS.length;
      setLoadingText(LOADING_TEXTS[textIdx]);
    }, 3000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: textToSubmit,
          targetLanguage: effectiveTargetLanguage,
          songType,
          poeticVibe,
          emotionalDepth,
          songEnding,
          perspective,
          voice,
          tempo,
          songLength,
          structure,
          referenceVibe,
          specificDetails,
          wordsToAvoid,
          targetAudience,
          scriptStyle,
          polishPass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate lyrics. Please try again.");
      }

      setResult(data);
      saveToHistory(textToSubmit, data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      setLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeGeneration();
  };

  const handleVariant = (mode: string) => {
    const modePrompts: Record<string, string> = {
      emotional:
        "Make this song MORE EMOTIONALLY INTENSE and heart-touching. Deepen the vulnerability and feeling.",
      simpler:
        "Simplify the language — make it more conversational, fewer metaphors, easier to sing.",
      poetic:
        "Make this MORE POETIC with richer imagery and literary metaphors.",
    };
    const instruction = modePrompts[mode] || "";
    const baseScene = lastGeneratedPrompt || prompt;
    const newPrompt = `[${instruction}]\n\nOriginal scene: ${baseScene}`;
    setPrompt(newPrompt);
    setTimeout(() => {
      executeGeneration(newPrompt);
    }, 80);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSampleClick = (text: string) => {
    setPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCycleStarters = () => {
    setStarterPage((prev) => (prev + 1) % 3);
  };

  // 4 starters per page from pool of 12
  const currentStarters = useMemo(() => {
    const start = starterPage * 4;
    return SCENE_STARTERS.slice(start, start + 4);
  }, [starterPage]);

  // Filtered history list
  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return history;
    const q = historySearch.toLowerCase();
    return history.filter(
      (h) =>
        h.prompt.toLowerCase().includes(q) ||
        (h.language && h.language.toLowerCase().includes(q)) ||
        (h.result.songType && h.result.songType.toLowerCase().includes(q))
    );
  }, [history, historySearch]);

  const activeSongType = SONG_TYPES.find((s) => s.id === songType) || SONG_TYPES[0];
  const activeVibe = POETIC_VIBES.find((v) => v.id === poeticVibe) || POETIC_VIBES[0];
  const activeDepth = EMOTIONAL_DEPTHS.find((d) => d.id === emotionalDepth) || EMOTIONAL_DEPTHS[0];

  return (
    <main className="min-h-screen px-4 py-8 md:py-14 max-w-4xl mx-auto flex flex-col justify-between">
      {/* ─────────────────────────────────────────────────────────────
          HEADER
         ───────────────────────────────────────────────────────────── */}
      <header className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-Heart Songwriting Engine · Any Language</span>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171e2c] border border-[#27344c] hover:border-amber-500/40 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved ({history.length})</span>
              {showHistory ? (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
            </button>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 flex items-center justify-center gap-3">
          <Feather className="w-8 h-8 text-amber-400 inline-block" />
          Lyricly
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Describe any moment, memory, or feeling in your native tongue. Receive organic,
          deeply human lyrics, complete Suno AI music production tags, and cover art direction.
        </p>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          SAVED SONGS DRAWER (History)
         ───────────────────────────────────────────────────────────── */}
      {showHistory && (
        <section className="mb-8 p-4 md:p-5 rounded-2xl bg-[#131822] border border-[#253046] shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222b3e]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Saved Song Drafts ({history.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* History Search / Filter */}
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by scene or language..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-[#232d3f] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-500/50"
                />
                {historySearch && (
                  <button
                    onClick={() => setHistorySearch("")}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                onClick={clearHistory}
                className="text-[11px] text-red-400/80 hover:text-red-300 flex items-center gap-1 transition px-2 py-1.5 rounded-lg hover:bg-red-950/30 border border-transparent hover:border-red-900/40"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No saved songs match your search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => restoreFromHistory(item)}
                  className="p-3 rounded-xl bg-[#0e1219] hover:bg-[#18202d] border border-[#1f283a] hover:border-amber-500/40 text-left transition space-y-1.5 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatHistoryDate(item.timestamp)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-medium border border-amber-500/20">
                      {item.language || item.result.targetLanguage || item.result.detectedLanguage || "Song"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium truncate multilingual-text">
                    {item.prompt}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>{item.result.music?.genre || item.result.songType || "Custom"}</span>
                    <span>•</span>
                    <span className="text-slate-400 truncate">
                      {item.result.titles?.[0] || "Draft"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN INPUT FORM
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#131720]/85 backdrop-blur-md border border-[#232a3b] rounded-2xl p-4 md:p-6 shadow-2xl mb-10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Textarea & Quality Hint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Describe Your Scene or Moment (Any Language)
              </span>
              <span className="font-mono text-slate-500">{prompt.length} chars</span>
            </div>

            <textarea
              ref={textareaRef}
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. രാത്രി മഴയത്ത് തട്ടുകടയിൽ ചായ കുടിക്കുന്ന നിമിഷം, അല്ലെങ്കിൽ ഏതൊരു ഓർമ്മയും... (Write in any language)"
              className="w-full bg-[#0a0d13] border border-[#222938] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 outline-none resize-y transition multilingual-text text-base md:text-lg leading-relaxed"
              disabled={loading}
            />

            {/* Input Quality Hint */}
            {prompt.trim().length > 0 && prompt.trim().length < 40 && (
              <div className="px-1 text-xs text-amber-400/90 flex items-center gap-1.5 animate-in fade-in duration-200">
                <span>💡</span>
                <span>Add a place, object, or person for more human lyrics.</span>
              </div>
            )}
          </div>

          {/* Multilingual Scene Starters (4 at a time with cycle button) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Try a scene starter:</span>
                <span className="text-slate-500 text-[10px]">({starterPage + 1}/3)</span>
              </div>

              <button
                type="button"
                onClick={handleCycleStarters}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition cursor-pointer"
              >
                <span>More starters →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStarters.map((starter) => (
                <button
                  key={starter.id}
                  type="button"
                  onClick={() => handleSampleClick(starter.text)}
                  className="p-2.5 rounded-xl bg-[#161c28] hover:bg-[#20293a] border border-[#253247] hover:border-amber-500/40 text-left transition flex flex-col gap-1 group cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition">
                    {starter.label}
                  </span>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed multilingual-text">
                    {starter.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Song Type / Musical Genre Selector */}
          <div className="pt-2 border-t border-[#1f2737] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Song Type / Genre (സംഗീത ശൈലി)</span>
              </label>

              <span className="text-[11px] text-slate-400">
                Selected: <strong className="text-sky-300">{activeSongType.name}</strong>
              </span>
            </div>

            {/* Quick Genre Selection Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {SONG_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = songType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSongType(type.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-b from-sky-500/20 to-transparent border-sky-500/60 shadow-lg shadow-sky-500/10"
                        : "bg-[#10151f] border-[#222a3a] hover:border-[#2f3b52] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? "text-sky-400" : "text-slate-500"
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold truncate ${
                          isSelected ? "text-sky-200" : "text-slate-300"
                        }`}
                      >
                        {type.name.split("/")[0].trim()}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {type.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Language & Song Ending Controls */}
          <div className="pt-2 border-t border-[#1f2737] grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Output Language Selector (30+ options) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-amber-400" /> Output Lyrics Language
              </label>

              <div className="relative">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#263145] text-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm appearance-none outline-none focus:border-amber-500/50 transition cursor-pointer"
                >
                  {TARGET_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-[#0d1117] text-slate-200">
                      {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {targetLanguage === "custom" && (
                <input
                  type="text"
                  placeholder="Type target language (e.g. Italian, Bengali, Latin...)"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#263145] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-500/50"
                />
              )}
            </div>

            {/* Song Ending / Resolution Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Song Ending & Resolution (പര്യവസാനം)
              </label>

              <div className="relative">
                <select
                  value={songEnding}
                  onChange={(e) => setSongEnding(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#263145] text-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm appearance-none outline-none focus:border-emerald-500/50 transition cursor-pointer"
                >
                  {SONG_ENDINGS.map((ending) => (
                    <option key={ending.id} value={ending.id} className="bg-[#0d1117] text-slate-200">
                      {ending.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Emotional Soul & Depth */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Emotional Soul & Depth (ഉള്ള് തൊടുന്ന ഭാവം):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EMOTIONAL_DEPTHS.map((depth) => {
                const isSelected = emotionalDepth === depth.id;
                const Icon = depth.icon;
                return (
                  <button
                    key={depth.id}
                    type="button"
                    onClick={() => setEmotionalDepth(depth.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#18202d] border-amber-500/70 shadow-md shadow-amber-500/10"
                        : "bg-[#0f131a] border-[#222938] hover:border-[#2f394e] text-slate-400"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? depth.color : "text-slate-500"}`} />
                    <div className="space-y-0.5">
                      <div className={`text-xs font-semibold ${isSelected ? "text-slate-100" : "text-slate-300"}`}>
                        {depth.name}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight">
                        {depth.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Poetic Vibe Pill Buttons */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Feather className="w-3 h-3 text-amber-400" />
              <span>Poetry Vibe:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {POETIC_VIBES.map((vibe) => {
                const Icon = vibe.icon;
                const isSelected = poeticVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => setPoeticVibe(vibe.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-b from-amber-500/20 to-transparent border-amber-500/60 shadow-lg shadow-amber-500/10"
                        : "bg-[#10151f] border-[#222a3a] hover:border-[#2f3b52] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                      <span className={`text-xs font-semibold truncate ${isSelected ? "text-amber-200" : "text-slate-300"}`}>
                        {vibe.name.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {vibe.sub.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              ADVANCED OPTIONS PANEL (Collapsible)
             ───────────────────────────────────────────────────────────── */}
          <div className="pt-2 border-t border-[#1f2737]">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0f131b] hover:bg-[#151b26] border border-[#222b3c] text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>⚙ Advanced Options</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Perspective, Voice, Tempo, Structure, Script Style & Polish)
                </span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 md:p-5 rounded-2xl bg-[#0e1219] border border-[#222a39] space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Row 1: Perspective & Voice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Singer Perspective */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-sky-400" /> Singer Perspective
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: "first-person", label: "First person (I/my)" },
                        { id: "second-person", label: "Second person (you/your)" },
                        { id: "third-person", label: "Third person (he/she/they)" },
                        { id: "duet", label: "Duet (two voices)" },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                            perspective === item.id
                              ? "bg-sky-500/15 border-sky-500/50 text-sky-200 font-medium"
                              : "bg-[#141823] border-[#242c3d] text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="perspective"
                            value={item.id}
                            checked={perspective === item.id}
                            onChange={(e) => setPerspective(e.target.value)}
                            className="text-sky-500 focus:ring-0"
                          />
                          <span className="truncate">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Voice Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Voice Type
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "auto", label: "Auto" },
                        { id: "male", label: "Male" },
                        { id: "female", label: "Female" },
                        { id: "duet", label: "Duet" },
                        { id: "group", label: "Group / Choir" },
                        { id: "child", label: "Child" },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                            voice === item.id
                              ? "bg-amber-500/15 border-amber-500/50 text-amber-200 font-medium"
                              : "bg-[#141823] border-[#242c3d] text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="voice"
                            value={item.id}
                            checked={voice === item.id}
                            onChange={(e) => setVoice(e.target.value)}
                            className="text-amber-500 focus:ring-0"
                          />
                          <span className="truncate">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 2: Tempo & Song Length */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tempo */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" /> Tempo
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {[
                        { id: "slow", label: "Slow" },
                        { id: "mid", label: "Mid" },
                        { id: "upbeat", label: "Upbeat" },
                        { id: "auto", label: "Auto" },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer transition ${
                            tempo === item.id
                              ? "bg-purple-500/15 border-purple-500/50 text-purple-200 font-medium"
                              : "bg-[#141823] border-[#242c3d] text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="tempo"
                            value={item.id}
                            checked={tempo === item.id}
                            onChange={(e) => setTempo(e.target.value)}
                            className="text-purple-500 focus:ring-0"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Song Length */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" /> Song Length
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "1:30", label: "Short (1:30)" },
                        { id: "2:30", label: "Standard (2:30)" },
                        { id: "3:30", label: "Full (3:30)" },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer transition ${
                            songLength === item.id
                              ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-medium"
                              : "bg-[#141823] border-[#242c3d] text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="songLength"
                            value={item.id}
                            checked={songLength === item.id}
                            onChange={(e) => setSongLength(e.target.value)}
                            className="text-emerald-500 focus:ring-0"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 3: Structure & Target Audience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Structure */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" /> Song Structure
                    </label>
                    <div className="relative">
                      <select
                        value={structure}
                        onChange={(e) => setStructure(e.target.value)}
                        className="w-full bg-[#141823] border border-[#242c3d] text-slate-200 rounded-xl px-3 py-2.5 text-xs appearance-none outline-none focus:border-sky-500/50 transition cursor-pointer"
                      >
                        <option value="standard">Standard (V-C-V-C-B-C)</option>
                        <option value="reel-hook-first">Short-form reel (hook first, 45s)</option>
                        <option value="kids-rhyme">Kids rhyme (repetitive catchy)</option>
                        <option value="custom">Custom (organic flow)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> Target Audience / Format
                    </label>
                    <div className="relative">
                      <select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full bg-[#141823] border border-[#242c3d] text-slate-200 rounded-xl px-3 py-2.5 text-xs appearance-none outline-none focus:border-amber-500/50 transition cursor-pointer"
                      >
                        <option value="general">General Music Streaming</option>
                        <option value="youtube">YouTube Song & Video</option>
                        <option value="reel">Instagram Reel / TikTok</option>
                        <option value="kids">Kids Channel / Education</option>
                        <option value="wedding">Wedding / Event Special</option>
                        <option value="devotional">Devotional / Temple Service</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 4: Reference Vibe & Words to Avoid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Reference Vibe or Song
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 90s film melody, soft Coke Studio acoustic"
                      value={referenceVibe}
                      onChange={(e) => setReferenceVibe(e.target.value)}
                      className="w-full bg-[#141823] border border-[#242c3d] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Words or Clichés to Avoid
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. broken heart, endless love (comma-separated)"
                      value={wordsToAvoid}
                      onChange={(e) => setWordsToAvoid(e.target.value)}
                      className="w-full bg-[#141823] border border-[#242c3d] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                {/* Specific Details textarea */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Specific Details (Names, places, tangible objects)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Names, places, objects, one unsaid thing. The more specific, the more human the song."
                    value={specificDetails}
                    onChange={(e) => setSpecificDetails(e.target.value)}
                    className="w-full bg-[#141823] border border-[#242c3d] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none resize-y focus:border-amber-500/50"
                  />
                </div>

                {/* Row 5: Script Style (Conditional) & Polish Pass Toggle */}
                <div className="pt-2 border-t border-[#1e2536] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Script Style (only show when non-Latin language selected) */}
                  {showScriptStyleOption ? (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-amber-400" /> Script Style
                      </label>
                      <div className="flex items-center gap-2 text-xs">
                        {[
                          { id: "native", label: "Native Script" },
                          { id: "romanized", label: "Romanized (Phonetic)" },
                          { id: "both", label: "Both" },
                        ].map((item) => (
                          <label
                            key={item.id}
                            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition ${
                              scriptStyle === item.id
                                ? "bg-amber-500/15 border-amber-500/50 text-amber-200 font-medium"
                                : "bg-[#141823] border-[#242c3d] text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="scriptStyle"
                              value={item.id}
                              checked={scriptStyle === item.id}
                              onChange={(e) =>
                                setScriptStyle(e.target.value as "native" | "romanized" | "both")
                              }
                              className="text-amber-500 focus:ring-0"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">
                      Script style defaults to standard alphabet for Latin languages.
                    </div>
                  )}

                  {/* Polish Pass Switch */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Polish Pass</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Self-critique & line rewrite (~30s extra)
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={polishPass}
                      onClick={() => setPolishPass(!polishPass)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        polishPass ? "bg-emerald-500" : "bg-[#273245]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          polishPass ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-[#1b2230] border border-[#2c374e] rounded text-[10px] text-slate-300 font-mono">
                Ctrl + Enter
              </kbd>
              <span className="hidden sm:inline">to generate</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 bg-[#1b2230] border border-[#2c374e] rounded text-[10px] text-slate-300 font-mono">
                Ctrl + Shift + C
              </kbd>
              <span className="hidden md:inline">to copy Suno pack</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {prompt && !loading && (
                <button
                  type="button"
                  onClick={() => setPrompt("")}
                  className="px-3 py-2.5 rounded-xl border border-[#263045] hover:bg-[#1a2130] text-slate-400 hover:text-slate-200 text-xs font-medium transition cursor-pointer"
                  title="Clear prompt"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingText || "Composing your song..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Lyrics & Direction</span>
                    <CornerDownLeft className="w-3.5 h-3.5 opacity-60 hidden sm:inline" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ERROR NOTICE (With Retry button)
         ───────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-red-300">Generation Notice</p>
              <p className="text-red-200/90 text-xs leading-relaxed">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => executeGeneration()}
            className="px-3.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/80 border border-red-700/60 text-xs font-semibold text-red-100 shrink-0 flex items-center gap-1.5 transition self-end sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LOADING SKELETON
         ───────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-6 mb-12 animate-pulse">
          <div className="p-4 rounded-xl bg-[#141924] border border-[#232d40] text-center text-xs text-amber-300 font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>{loadingText || "Crafting your musical piece..."}</span>
          </div>

          <div className="bg-[#141923] border border-[#232b3d] rounded-2xl p-6 space-y-4">
            <div className="h-5 bg-[#232b3d] rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[#1e2536] rounded w-3/4"></div>
              <div className="h-4 bg-[#1e2536] rounded w-5/6"></div>
              <div className="h-4 bg-[#1e2536] rounded w-2/3"></div>
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-[#1e2536] rounded w-4/5"></div>
              <div className="h-4 bg-[#1e2536] rounded w-3/5"></div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          RESULTS OUTPUT
         ───────────────────────────────────────────────────────────── */}
      {result && !loading && (
        <div ref={resultRef} className="space-y-6 mb-12">
          {/* Confirmation & Export Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#141924] border border-[#232d40] text-xs text-slate-300">
            <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400 shrink-0">Composed for:</span>
              <span className="font-medium text-amber-200 italic truncate multilingual-text">
                "{lastGeneratedPrompt}"
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={handleDownloadMd}
                className="px-2.5 py-1 rounded-lg bg-[#1c2434] hover:bg-[#253046] border border-[#29364e] text-slate-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                title="Download formatted Markdown (.md)"
              >
                <FileText className="w-3 h-3 text-sky-400" />
                <span>Export .md</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-2.5 py-1 rounded-lg bg-[#1c2434] hover:bg-[#253046] border border-[#29364e] text-slate-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                title="Download lyrics & direction as .txt file"
              >
                <Download className="w-3 h-3 text-amber-400" />
                <span>Export .txt</span>
              </button>
            </div>
          </div>

          {/* 10.a) TITLE OPTIONS (Above lyrics) */}
          {result.titles && result.titles.length > 0 && (
            <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-4 md:p-5 shadow-xl space-y-2.5">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-amber-400" /> Suggested Song Titles
                </span>
                <span className="text-[11px] text-slate-500 font-normal">Click pill to copy</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {result.titles.map((title, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopy(title, `title-${idx}`)}
                    className="px-3.5 py-2 rounded-xl bg-[#171d29] hover:bg-[#1f283a] border border-[#263145] hover:border-amber-500/40 text-xs md:text-sm font-medium text-slate-200 hover:text-white transition flex items-center gap-2 group multilingual-text shadow-sm cursor-pointer"
                  >
                    <span>{title}</span>
                    {copiedKey === `title-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500 group-hover:text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1: LYRICS */}
          <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Lyrics Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232a3a] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Mic2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-slate-100">Song Lyrics</h2>
                    {/* 10.f) Polish pass badge */}
                    {result.polished && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold tracking-wide">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        AI-polished
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-medium border border-sky-500/20">
                      {result.songType || activeSongType.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#1e2638] text-amber-300 font-medium">
                      {result.targetLanguage || result.detectedLanguage}
                    </span>
                    {result.detectedLanguage &&
                      result.targetLanguage &&
                      result.detectedLanguage !== result.targetLanguage && (
                        <span className="text-[11px] text-slate-500">
                          (From: {result.detectedLanguage})
                        </span>
                      )}
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400/90 text-[11px] font-medium border border-amber-500/20">
                      {activeDepth.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] font-medium">
                      {activeVibe.name.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadMd}
                  className="px-3 py-1.5 rounded-lg bg-[#18202d] hover:bg-[#222c3e] border border-[#27334a] text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  title="Download .md export"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">.md</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="px-3 py-1.5 rounded-lg bg-[#18202d] hover:bg-[#222c3e] border border-[#27334a] text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  title="Download .txt export"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">.txt</span>
                </button>

                <button
                  onClick={() => handleCopy(result.lyrics, "lyrics")}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1d2536] hover:bg-[#273249] border border-[#2d3a54] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === "lyrics" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Lyrics</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Lyrics Body */}
            <div className="multilingual-text text-base md:text-lg leading-relaxed text-slate-200 whitespace-pre-line font-normal space-y-4 select-text">
              {result.lyrics}
            </div>

            {/* 11. VARIATION BUTTONS ROW */}
            <div className="pt-4 border-t border-[#1f2738] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Explore Variations:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => executeGeneration(lastGeneratedPrompt)}
                  className="px-3 py-1.5 rounded-xl bg-[#171e2c] hover:bg-[#222b3e] border border-[#27354d] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>🔄 Regenerate</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVariant("emotional")}
                  className="px-3 py-1.5 rounded-xl bg-[#171e2c] hover:bg-[#222b3e] border border-[#27354d] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>💔 More Emotional</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVariant("simpler")}
                  className="px-3 py-1.5 rounded-xl bg-[#171e2c] hover:bg-[#222b3e] border border-[#27354d] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>✂️ Simpler</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVariant("poetic")}
                  className="px-3 py-1.5 rounded-xl bg-[#171e2c] hover:bg-[#222b3e] border border-[#27354d] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🌹 More Poetic</span>
                </button>
              </div>
            </div>
          </div>

          {/* 10.b) PHONETIC HELPER (If non-empty, collapsible) */}
          {result.phoneticHelper && result.phoneticHelper.trim().length > 0 && (
            <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-5 md:p-6 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPhonetic(!showPhonetic)}
                  className="flex items-center gap-2 text-slate-200 hover:text-white transition text-left cursor-pointer"
                >
                  <span className="text-sm md:text-base font-bold flex items-center gap-2">
                    <span>🔤</span> Phonetic Helper (for Suno AI)
                  </span>
                  {showPhonetic ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(result.phoneticHelper || "", "phonetic")}
                  className="px-3 py-1.5 rounded-lg bg-[#1d2536] hover:bg-[#273249] border border-[#2d3a54] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === "phonetic" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Phonetics</span>
                    </>
                  )}
                </button>
              </div>

              {showPhonetic && (
                <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#222a3a] text-xs md:text-sm text-slate-300 font-mono whitespace-pre-line leading-relaxed select-all">
                  {result.phoneticHelper}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: MUSIC DIRECTION */}
          <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232a3a] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Music2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Music Direction</h2>
                  <p className="text-xs text-slate-400">
                    Acoustic profile & Suno / Udio ready prompt
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* 10.d) Prominent Copy for Suno button */}
                <button
                  onClick={() =>
                    handleCopy(
                      result.sunoBlock ||
                        `[Style of Music]\n${result.music.sunoPrompt}\n\n[Lyrics]\n${result.lyrics}`,
                      "sunoBlock"
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === "sunoBlock" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied Suno Block!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy for Suno</span>
                    </>
                  )}
                </button>

                <a
                  href="https://suno.com/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#142033] hover:bg-[#1c2c47] border border-[#233555] text-xs font-medium text-sky-300 hover:text-sky-200 transition flex items-center gap-1.5"
                >
                  <span>Open Suno</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Music Metadata Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#171d29] border border-[#242e42]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Disc3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Genre</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {result.music.genre}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#171d29] border border-[#242e42]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tempo & Feel</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {result.music.tempo}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#171d29] border border-[#242e42] sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Music2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Instrumentation</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {result.music.instrumentation}
                </div>
              </div>
            </div>

            {/* Suno.ai Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Suno.ai / Udio Ready Prompt
                </span>
                <button
                  onClick={() => handleCopy(result.music.sunoPrompt, "suno")}
                  className="px-3 py-1 rounded-lg bg-[#1d2536] hover:bg-[#273249] border border-[#2d3a54] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === "suno" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#222a3a] text-xs md:text-sm text-sky-200/90 font-mono leading-relaxed select-all">
                {result.music.sunoPrompt}
              </div>

              {/* 10.c) Negative Style Tags */}
              {result.music.negativeStyleTags && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 text-rose-300 font-mono text-[11px]">
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      🚫 Negative tags:
                    </span>
                    <span className="bg-rose-950/40 border border-rose-900/40 px-2.5 py-0.5 rounded text-rose-200">
                      {result.music.negativeStyleTags}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(result.music.negativeStyleTags || "", "negativeTags")}
                    className="px-2.5 py-1 rounded-lg bg-[#171d29] hover:bg-[#202939] border border-[#28354c] text-[11px] text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "negativeTags" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: VISUAL DIRECTION */}
          <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232a3a] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Visual Direction</h2>
                  <p className="text-xs text-slate-400">
                    Color palette & Midjourney / DALL-E cover art prompt
                  </p>
                </div>
              </div>
            </div>

            {/* Color Palette Chips */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" /> Color Palette
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {result.visual.colorPalette.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopy(color.hex, `hex-${idx}`)}
                    className="p-3 rounded-xl bg-[#171d29] border border-[#242e42] flex flex-col gap-2 text-left hover:border-[#384666] transition group cursor-pointer"
                    title="Click to copy hex code"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-7 h-7 rounded-lg shadow-inner border border-white/10"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-300 font-mono">
                        {copiedKey === `hex-${idx}` ? "Copied!" : color.hex}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {color.name}
                      </div>
                      {color.role && (
                        <div className="text-[11px] text-slate-400 truncate">
                          {color.role}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Imagery Description */}
            <div className="p-4 rounded-xl bg-[#171d29] border border-[#242e42] space-y-1">
              <div className="text-xs font-semibold text-slate-300">
                Visual Concept
              </div>
              <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed">
                {result.visual.imagery}
              </p>
            </div>

            {/* Midjourney Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Midjourney / DALL-E Prompt
                </span>
                <button
                  onClick={() => handleCopy(result.visual.imagePrompt, "imagePrompt")}
                  className="px-3 py-1 rounded-lg bg-[#1d2536] hover:bg-[#273249] border border-[#2d3a54] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === "imagePrompt" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Image Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#222a3a] text-xs md:text-sm text-purple-200/90 font-mono leading-relaxed select-all">
                {result.visual.imagePrompt}
              </div>
            </div>
          </div>

          {/* 10.e) YOUTUBE META (Collapsible section) */}
          {result.youtubeMeta && (
            <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
              <button
                type="button"
                onClick={() => setShowYoutubeMeta(!showYoutubeMeta)}
                className="w-full flex items-center justify-between text-slate-200 hover:text-white transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <Film className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm md:text-base font-bold text-slate-100">
                      YouTube Publishing Metadata
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      SEO-tuned title, description & tag recommendations
                    </p>
                  </div>
                </div>
                {showYoutubeMeta ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showYoutubeMeta && (
                <div className="pt-3 border-t border-[#1f2738] space-y-4 animate-in fade-in duration-200">
                  {/* YouTube Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Video Title</span>
                      <button
                        onClick={() => handleCopy(result.youtubeMeta?.title || "", "ytTitle")}
                        className="px-2.5 py-1 rounded bg-[#171d29] hover:bg-[#202939] border border-[#28354c] text-[11px] text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "ytTitle" ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy Title</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#222a3a] text-xs md:text-sm text-slate-200 multilingual-text font-medium">
                      {result.youtubeMeta.title}
                    </div>
                  </div>

                  {/* YouTube Description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Video Description</span>
                      <button
                        onClick={() =>
                          handleCopy(result.youtubeMeta?.description || "", "ytDesc")
                        }
                        className="px-2.5 py-1 rounded bg-[#171d29] hover:bg-[#202939] border border-[#28354c] text-[11px] text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "ytDesc" ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy Description</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#222a3a] text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                      {result.youtubeMeta.description}
                    </div>
                  </div>

                  {/* Hashtags */}
                  {result.youtubeMeta.hashtags && result.youtubeMeta.hashtags.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Hashtags</span>
                        <button
                          onClick={() =>
                            handleCopy(result.youtubeMeta?.hashtags.join(" ") || "", "ytTags")
                          }
                          className="px-2.5 py-1 rounded bg-[#171d29] hover:bg-[#202939] border border-[#28354c] text-[11px] text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === "ytTags" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy Tags</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.youtubeMeta.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-[#141b26] border border-[#232f42] text-xs font-mono text-sky-300"
                          >
                            {tag.startsWith("#") ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
         ───────────────────────────────────────────────────────────── */}
      <footer className="text-center pt-8 border-t border-[#1d2433] text-xs text-slate-500 space-y-2">
        <p>Lyricly — Multi-genre lyrics & direction in your chosen language with AI music & cover art.</p>
        <p className="text-[11px] text-slate-600">
          Tip: On Suno.ai, switch to Custom Mode, paste lyrics into the Lyrics box, and tags into Style of Music.
        </p>
      </footer>
    </main>
  );
}
