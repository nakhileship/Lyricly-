# 🎵 Lyricly

> **Describe any scene or moment → Get grounded song lyrics (native language), Suno/Udio music prompt, and Midjourney cover art prompt.**

Malayalam is a priority language — lyrics are written directly in the same language/script as your input, using the scene's concrete details.

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd Lyricly
npm install
```

### 2. Add Your API Key

Copy the environment template and fill in your key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Default: Google Gemini (recommended for structured output & multilingual quality)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional alternative: Anthropic Claude (used if GEMINI_API_KEY is not set)
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get a Gemini API key free at: https://aistudio.google.com/app/apikey

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

- 🌐 **Multilingual** — Works in any language. Malayalam (`മലയാളം`) is a priority with full Noto Sans Malayalam font support
- 🎵 **Grounded Lyrics** — Written directly in your input language using your scene's specific details, images, and sensory moments
- 🎚️ **Suno/Udio Prompt** — Ready-to-paste comma-separated music tags with genre, mood, instrumentation, BPM, and vocal style
- 🎨 **Midjourney/DALL-E Prompt** — Visual color palette (with hex codes) + ready-to-paste cover art prompt
- 📋 **One-click Copy** — Copy lyrics, Suno prompt, image prompt, or individual hex colors
- 📱 **Mobile-responsive** — Calm, minimal dark theme that works on all screen sizes

---

## Deployment

### Vercel (Recommended)

1. Push this repo to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add environment variable `GEMINI_API_KEY` (or `ANTHROPIC_API_KEY`) in **Settings → Environment Variables**
4. Deploy

### Firebase Hosting + Cloud Functions

Use Next.js on Firebase with the `@apphosting/adapter-nextjs` adapter. Set env vars in Firebase Console.

---

## Project Structure

```
Lyricly/
├── app/
│   ├── api/generate/route.ts   # Server-side LLM API route (Gemini / Claude)
│   ├── page.tsx                # Single-page UI
│   ├── layout.tsx              # Fonts (Inter + Noto Sans Malayalam) + metadata
│   └── globals.css             # Calm dark theme + Malayalam typography
├── lib/
│   └── types.ts                # TypeScript interfaces for structured response
├── .env.example                # Environment variable template
└── package.json
```

---

## API Key Security

- API keys are **only ever read server-side** in `app/api/generate/route.ts`
- They are **never exposed** to client-side JavaScript
- The `.env.local` file is listed in `.gitignore` and will never be committed

---

## Sample Scene Starters

| Language | Scene |
|----------|-------|
| Malayalam | `നാട്ടിൻപുറത്തെ പഴയ ചായക്കടയിലെ മഴക്കാലത്തെ സായാഹ്നം, റേഡിയോയിൽ പഴയ പാട്ട്` |
| Malayalam | `അർദ്ധരാത്രിയിലെ ജനറൽ കംപാർട്ട്മെന്റിൽ, ദൂരെ ഇരുണ്ട കടലിലെ നിലാവ്` |
| English | `Standing under a dripping fire escape at 2 AM, neon reflections in puddles` |
