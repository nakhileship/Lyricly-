"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { GenerationResponse } from "@/lib/types";

interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  result: GenerationResponse;
}

const SAMPLE_PROMPTS = [
  {
    label: "🍵 മഴക്കാലത്തെ ചായക്കട (Malayalam)",
    text: "നാട്ടിൻപുറത്തെ പഴയ ചായക്കടയിലെ മഴക്കാലത്തെ സായാഹ്നം. പുറത്ത് തോരാത്ത മഴ, റേഡിയോയിൽ യേശുദാസിന്റെ പഴയ പാട്ട്, ഗ്ലാസിലെ ചൂടുള്ള കട്ടൻചായ, കൂട്ടുകാരുടെ തമാശകൾ.",
  },
  {
    label: "🚂 രാത്രി തീവണ്ടിയും കടലും (Malayalam)",
    text: "അർദ്ധരാത്രിയിലെ ജനറൽ കംപാർട്ട്മെന്റിലെ ജനലരികിൽ ഇരിക്കുന്നു. ദൂരെ ഇരുണ്ട കടലിലെ നിലാവിന്റെ വെളിച്ചവും, ചക്രങ്ങളുടെ താളവും, മനസ്സിൽ നിറയുന്ന നഷ്ടബോധവും.",
  },
  {
    label: "🌧️ Midnight Rain in Tokyo (English)",
    text: "Standing under a transparent umbrella in Shinjuku at midnight. Neon reflections glowing in asphalt puddles, distant train hum, and solitary footsteps.",
  },
  {
    label: "🌾 ഗ്രാമത്തിലെ കൊയ്ത്തുകാലം (Malayalam)",
    text: "പാടത്ത് സ്വർണ്ണനിറത്തിൽ വിളഞ്ഞുനിൽക്കുന്ന നെല്ല്, വൈകുന്നേരത്തെ ഇളംവെയിൽ, ദൂരെനിന്നൊഴുകിവരുന്ന പുല്ലാങ്കുഴൽ നാദം, കുട്ടിക്കാലത്തെ ഓർമ്മകൾ.",
  },
];

const TARGET_LANGUAGES = [
  { id: "auto", label: "Auto (Same as input)" },
  { id: "Malayalam", label: "Malayalam (മലയാളം)" },
  { id: "English", label: "English" },
  { id: "Tamil", label: "Tamil (தமிழ்)" },
  { id: "Hindi", label: "Hindi (हिन्दी)" },
  { id: "Telugu", label: "Telugu (తెలుగు)" },
  { id: "Kannada", label: "Kannada (ಕನ್ನಡ)" },
  { id: "Spanish", label: "Spanish (Español)" },
  { id: "French", label: "French (Français)" },
  { id: "Arabic", label: "Arabic (العربية)" },
  { id: "Japanese", label: "Japanese (日本語)" },
  { id: "German", label: "German (Deutsch)" },
];

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

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("auto");
  const [customLanguage, setCustomLanguage] = useState("");
  const [poeticVibe, setPoeticVibe] = useState("deep-poetic");
  const [emotionalDepth, setEmotionalDepth] = useState("heartfelt-raw");
  const [songEnding, setSongEnding] = useState("emotional-punchline");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history on mount
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

  const saveToHistory = (promptText: string, resData: GenerationResponse) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: promptText,
        result: resData,
      };
      const updated = [newItem, ...history.filter((h) => h.prompt !== promptText)].slice(0, 10);
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
    setShowHistory(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const effectiveTargetLanguage =
    targetLanguage === "custom"
      ? customLanguage.trim() || "auto"
      : targetLanguage;

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
    const content = `================================================
LYRICLY — SONG CREATION EXPORT
================================================
Scene: ${lastGeneratedPrompt}
Language: ${result.targetLanguage || result.detectedLanguage}
Poetic Vibe: ${result.poeticVibe || "Deep Poetry"}
Emotional Depth: ${result.emotionalDepth || "Heartfelt"}
Ending Style: ${result.songEnding || "Closure"}

================================================
LYRICS
================================================
${result.lyrics}

================================================
MUSIC DIRECTION (SUNO.AI / UDIO)
================================================
Genre: ${result.music.genre}
Tempo: ${result.music.tempo}
Instrumentation: ${result.music.instrumentation}
Vocal Style: ${result.music.vocalStyle || "Soulful"}

Ready Suno/Udio Prompt:
${result.music.sunoPrompt}

================================================
VISUAL DIRECTION (MIDJOURNEY / DALL-E)
================================================
Color Palette:
${result.visual.colorPalette.map((c) => `- ${c.name} (${c.hex}) [${c.role || "Accent"}]`).join("\n")}

Visual Concept:
${result.visual.imagery}

Ready Cover Art Prompt:
${result.visual.imagePrompt}
`;

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLastGeneratedPrompt(trimmed);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmed,
          targetLanguage: effectiveTargetLanguage,
          poeticVibe,
          emotionalDepth,
          songEnding,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to generate lyrics. Please try again."
        );
      }

      setResult(data);
      saveToHistory(trimmed, data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
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

  const activeVibe = POETIC_VIBES.find((v) => v.id === poeticVibe) || POETIC_VIBES[0];
  const activeDepth = EMOTIONAL_DEPTHS.find((d) => d.id === emotionalDepth) || EMOTIONAL_DEPTHS[0];

  return (
    <main className="min-h-screen px-4 py-8 md:py-16 max-w-4xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <header className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-Heart Songwriting Engine • Malayalam Priority</span>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171e2c] border border-[#27344c] hover:border-amber-500/40 text-slate-300 text-xs font-medium transition"
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
          Craft touching, organic song lyrics with human depth, subtext, and definitive endings.
          Write in any language, output in any language, with Suno music tags and Midjourney cover art.
        </p>
      </header>

      {/* Saved Songs Drawer */}
      {showHistory && history.length > 0 && (
        <section className="mb-8 p-4 rounded-2xl bg-[#131822] border border-[#253046] shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#222b3e]">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-400" /> Recent Songs ({history.length})
            </span>
            <button
              onClick={clearHistory}
              className="text-[11px] text-red-400/80 hover:text-red-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" /> Clear History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => restoreFromHistory(item)}
                className="p-3 rounded-xl bg-[#0e1219] hover:bg-[#18202d] border border-[#1f283a] hover:border-amber-500/40 text-left transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-amber-400/90 font-medium">
                    {item.result.targetLanguage || item.result.detectedLanguage}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium truncate malayalam-text">
                  {item.prompt}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Main Input Form */}
      <section className="bg-[#131720]/85 backdrop-blur-md border border-[#232a3b] rounded-2xl p-4 md:p-6 shadow-2xl mb-10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-medium flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Describe Your Scene or Moment (Any Language)
              </span>
              <span>{prompt.length} chars</span>
            </div>

            <textarea
              ref={textareaRef}
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. രാത്രി മഴയത്ത് തട്ടുകടയിൽ ചായ കുടിക്കുന്ന നിമിഷം, അല്ലെങ്കിൽ ഏതൊരു ഓർമ്മയും..."
              className="w-full bg-[#0a0d13] border border-[#222938] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 outline-none resize-y transition malayalam-text text-base md:text-lg"
              disabled={loading}
            />
          </div>

          {/* Preset Scene Starters */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Try a scene starter:
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleClick(sample.text)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#18202d] hover:bg-[#232d3f] border border-[#2a354b] text-slate-300 hover:text-slate-100 transition flex items-center gap-1.5"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Target Language & Poetic Vibe */}
          <div className="pt-2 border-t border-[#1f2737] grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Output Language Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-sky-400" /> Output Lyrics Language
              </label>

              <div className="relative">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#263145] text-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm appearance-none outline-none focus:border-sky-500/50 transition cursor-pointer"
                >
                  {TARGET_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-[#0d1117] text-slate-200">
                      {lang.label}
                    </option>
                  ))}
                  <option value="custom" className="bg-[#0d1117] text-slate-200">
                    Custom (Specify other language...)
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {targetLanguage === "custom" && (
                <input
                  type="text"
                  placeholder="Type target language (e.g. Italian, Bengali...)"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#263145] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-sky-500/50"
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

          {/* Emotional Soul & Depth (Human Touch) */}
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
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
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
              <span>Poetry Vibe & Rhythm:</span>
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
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
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

          {/* Submit Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-[#1b2230] border border-[#2c374e] rounded text-[10px] text-slate-300 font-mono">
                Ctrl + Enter
              </kbd>
              <span className="hidden sm:inline">to generate</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {prompt && !loading && (
                <button
                  type="button"
                  onClick={() => setPrompt("")}
                  className="px-3 py-2.5 rounded-xl border border-[#263045] hover:bg-[#1a2130] text-slate-400 hover:text-slate-200 text-xs font-medium transition"
                  title="Clear input"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Composing touching lyrics...</span>
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

      {/* Error Notice */}
      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-red-300">Generation Notice</p>
            <p className="text-red-200/90 text-xs leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6 mb-12 animate-pulse">
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

      {/* Results Output */}
      {result && !loading && (
        <div ref={resultRef} className="space-y-6 mb-12">
          {/* Prompt confirmation bar */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#141924] border border-[#232d40] text-xs text-slate-300">
            <div className="flex items-center gap-2 overflow-hidden">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400 shrink-0">Composed specifically for:</span>
              <span className="font-medium text-amber-200 italic truncate malayalam-text">
                "{lastGeneratedPrompt}"
              </span>
            </div>

            <button
              onClick={handleDownloadTxt}
              className="px-2.5 py-1 rounded-lg bg-[#1c2434] hover:bg-[#253046] border border-[#29364e] text-slate-300 text-xs font-medium transition shrink-0 flex items-center gap-1.5"
              title="Download lyrics & direction as .txt file"
            >
              <Download className="w-3 h-3 text-amber-400" />
              <span>Download .txt</span>
            </button>
          </div>

          {/* Section 1: Lyrics */}
          <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232a3a] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Mic2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Song Lyrics</h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="px-2 py-0.5 rounded bg-[#1e2638] text-amber-300 font-medium">
                      {result.targetLanguage || result.detectedLanguage}
                    </span>
                    {result.detectedLanguage && result.targetLanguage && result.detectedLanguage !== result.targetLanguage && (
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

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTxt}
                  className="px-3 py-1.5 rounded-lg bg-[#18202d] hover:bg-[#222c3e] border border-[#27334a] text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
                  title="Download .txt export"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <button
                  onClick={() => handleCopy(result.lyrics, "lyrics")}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1d2536] hover:bg-[#273249] border border-[#2d3a54] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5"
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

            <div className="malayalam-text text-base md:text-lg leading-relaxed text-slate-200 whitespace-pre-line font-normal space-y-4">
              {result.lyrics}
            </div>
          </div>

          {/* Section 2: Music Direction */}
          <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232a3a] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Music2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Music Direction</h2>
                  <p className="text-xs text-slate-400">
                    Acoustic profile & Suno / Udio prompt
                  </p>
                </div>
              </div>

              <a
                href="https://suno.com/create"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#142033] hover:bg-[#1c2c47] border border-[#233555] text-xs font-medium text-sky-300 hover:text-sky-200 transition flex items-center gap-1.5"
              >
                <span>Open Suno.ai</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Music Metadata Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
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
                  className="px-3 py-1 rounded-lg bg-[#1d2536] hover:bg-[#273249] border border-[#2d3a54] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5"
                >
                  {copiedKey === "suno" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Suno Prompt!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Suno Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#222a3a] text-xs md:text-sm text-sky-200/90 font-mono leading-relaxed select-all">
                {result.music.sunoPrompt}
              </div>
            </div>
          </div>

          {/* Section 3: Visual Direction */}
          <div className="bg-[#121620] border border-[#232a3a] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232a3a] pb-4 mb-6">
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
            <div className="space-y-3 mb-6">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" /> Color Palette
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {result.visual.colorPalette.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopy(color.hex, `hex-${idx}`)}
                    className="p-3 rounded-xl bg-[#171d29] border border-[#242e42] flex flex-col gap-2 text-left hover:border-[#384666] transition group"
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
            <div className="mb-6 p-4 rounded-xl bg-[#171d29] border border-[#242e42] space-y-1">
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
                  className="px-3 py-1 rounded-lg bg-[#1d2536] hover:bg-[#273249] border border-[#2d3a54] text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5"
                >
                  {copiedKey === "imagePrompt" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Image Prompt!</span>
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
        </div>
      )}

      {/* Calm Footer */}
      <footer className="text-center pt-8 border-t border-[#1d2433] text-xs text-slate-500 space-y-2">
        <p>Lyricly — Heartfelt, human-crafted lyrics in your chosen language with AI music & cover art direction.</p>
        <p className="text-[11px] text-slate-600">
          Tip: On Suno.ai, switch to Custom Mode, paste lyrics into the Lyrics box, and tags into Style of Music.
        </p>
      </footer>
    </main>
  );
}
