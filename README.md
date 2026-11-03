# 🎵 Lyricly — Human-Heart Songwriting Engine (Any Language)

> **Describe any scene or moment → Get human-sounding, grounded song lyrics in 30+ languages, Suno AI music tags, pronunciation helpers, and Midjourney cover art prompts.**

Lyricly is a professional songwriting copilot designed to generate lyrics that sound lived-in, emotional, and singable—never generic or AI-written. Output is structured and optimized for direct pasting into Suno AI, Udio, and digital audio workstations.

---

## 🌟 What's New in This Release

### 1. Truly Multilingual Engine (30+ Languages & Code-Switching)
- **Universal Script Support**: Native font rendering for Malayalam, Hindi (Devanagari), Tamil, Telugu, Kannada, Arabic, Japanese (Kanji/Kana), Korean (Hangul), and more.
- **Code-Switching Support**: Native support for **Manglish**, **Hinglish**, and **Tanglish**, plus custom language specifications.
- **Script Selection**: Choose between **Native Script**, **Romanized / Phonetic**, or **Both (Bilingual)**.
- **Language-Aware Starters**: 12 curated scene starters across Malayalam, English, Hindi, Tamil, Korean, and Spanish with interactive rotation.

### 2. Collapsible Advanced Songwriting Controls
- **Singer Perspective**: First person (*I/Me*), Second person (*You/Address*), Storyteller (*He/She/They*), or Dialogue / Duet (*Two voices*).
- **Voice & Persona**: Soulful poet, Raw & heartbroken, Upbeat dreamer, Traditional elder, Rebellious youth, Gentle lullaby, or Duet.
- **Tempo & BPM**: Slow ballad, Mid-tempo groove, Upbeat bounce, Fast & energetic, or Building crescendo.
- **Song Length**: Short radio edit (~2 min), Standard (~3 min), Extended cinematic (~4–5 min), or Acoustic snippet (~1.5 min).
- **Song Structure**: Standard Verse-Chorus, Folk AABA, Progressive, Minimalist, Short-form reel (hook first), or Kids rhyme.
- **Reference Vibe**: Free-text musical inspiration (e.g. *"90s film melody", "soft Coke Studio acoustic"*).
- **Specific Details**: Include names, places, personal objects, and unsaid truths to anchor the song in reality.
- **Words / Themes to Avoid**: Custom ban list merged with built-in cliché protection.
- **Target Audience / Platform**: General, YouTube, Instagram Reels, Kids Channel, Wedding/Event, Devotional.

### 3. Suno AI Optimization & 6-Section Structured Output
- **Title Options**: 3 distinct title candidates with 1-click individual copy buttons.
- **Suno Block**: Pre-formatted `[Style of Music]` and tagged `[Lyrics]` ready for instant copy-pasting into Suno AI.
- **Phonetic Helper**: Pronunciation guidance for non-Latin scripts to ensure Suno sings without mispronunciation.
- **Negative Style Tags**: Ready-to-copy negative style prompts (e.g. `no autotune, no EDM drops`).
- **YouTube Metadata**: Video title, description, and 10 search-optimized hashtags.
- **Midjourney / DALL-E Prompt**: Imagery narrative + high-resolution visual art prompt + hex color palette.

### 4. Self-Critique / Polish Pass
- Optional two-pass generation where a secondary AI critique editor audits syllable balance, hook memorability, and cliché removal, rewriting only weak lines.

### 5. Variations, History & Exports
- **Instant Variations**: *"Regenerate"*, *"💔 More Emotional"*, *"✂️ Simpler"*, and *"🌹 More Poetic"*.
- **Interactive History**: Instant client-side search, readable timestamps, language badges, and quick-load.
- **Multi-Format Export**: Download complete song packages as `.txt` or rich `.md` (Markdown).
- **Keyboard Shortcuts**: `Ctrl + Enter` to generate, `Ctrl + Shift + C` to copy all.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/nakhileship/Lyricly-.git
cd Lyricly
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Primary Model (Google Gemini Flash / Pro)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Fallback (Anthropic Claude 3.7 Sonnet)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> **Where to get keys:**
> - **Google Gemini API Key**: Free at [Google AI Studio](https://aistudio.google.com/app/apikey).
> - **Anthropic Claude API Key**: At [Anthropic Console](https://console.anthropic.com/).

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
Lyricly/
├── app/
│   ├── api/generate/
│   │   ├── prompts.ts          # Central songwriting system prompt, rules & polish critic
│   │   └── route.ts            # API route handling Gemini/Claude generation & polish pass
│   ├── page.tsx                # Responsive client application with collapsible controls
│   ├── layout.tsx              # Google Fonts (Noto Sans Malayalam, Devanagari, Tamil, etc.)
│   └── globals.css             # Dark theme design system & multi-script typography
├── lib/
│   └── types.ts                # TypeScript interfaces for request, response, and Suno blocks
├── .env.example                # Environment variable documentation
└── package.json
```

---

## 🧪 Manual Test Checklist (5 Languages)

| # | Language | Scene Prompt | Expected Output |
|---|----------|--------------|-----------------|
| 1 | **Malayalam** | നാട്ടിൻപുറത്തെ പഴയ ചായക്കടയിൽ മഴക്കാലത്തെ സായാഹ്നം. പുറത്ത് തോരാത്ത മഴ, റേഡിയോയിൽ യേശുദാസിന്റെ പഴയ പാട്ട്. | Malayalam script lyrics with authentic spoken register, [Pallavi]/[Charanam] tags, acoustic Kerala folk Suno prompt, and romanized phonetic helper. |
| 2 | **Hindi** | दिल्ली मेट्रो की भीड़ में खिड़की से शहर को देखते हुए अकेलापन। एक पुराना ख़्वाब जो अधूरा रह गया। | Devanagari script, ghazal/indie-pop structure, emotional depth with concrete urban imagery, and Hindi Suno tags. |
| 3 | **Tamil** | மெரினா கடற்கரையில் அந்தி சாயும் நேரம். சுண்டல் விற்கும் சிறுவன், தூரத்து கப்பல் வெளிச்சம், ஒரு பழைய காதல் நினைவு. | Tamil script lyrics, poignant film-melody rhythm, strong singable chorus hook, and Tamil folk/acoustic music direction. |
| 4 | **Spanish** | Caminando por el malecón al anochecer, el olor a salitre y café tostado. Una promesa hecha frente al mar. | Authentic Spanish phrasing, slant rhymes, bolero/indie-acoustic Suno prompt, and 3 title candidates. |
| 5 | **English (Manglish/Hinglish Code-Switch)** | Driving late night through Bangalore outer ring road, neon lights, soft monsoon drizzle, thinking about home in Kochi. | Code-switched lyrics naturally blending English and regional idioms without clichés, indie-pop Suno prompt. |
