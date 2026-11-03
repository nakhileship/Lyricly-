export interface ColorPaletteItem {
  name: string;
  hex: string;
  role?: string;
}

export interface MusicDirection {
  genre: string;
  tempo: string;
  instrumentation: string;
  vocalStyle?: string;
  sunoPrompt: string;
  negativeStyleTags?: string;
}

export interface VisualDirection {
  colorPalette: ColorPaletteItem[];
  imagery: string;
  imagePrompt: string;
}

export interface YoutubeMeta {
  title: string;
  description: string;
  hashtags: string[];
}

export interface GenerationResponse {
  detectedLanguage: string;
  targetLanguage?: string;
  songType?: string;
  poeticVibe?: string;
  emotionalDepth?: string;
  songEnding?: string;
  titles?: string[];
  lyrics: string;
  phoneticHelper?: string;
  sunoBlock?: string;
  music: MusicDirection;
  visual: VisualDirection;
  youtubeMeta?: YoutubeMeta;
  polished?: boolean;
}

export interface GenerateRequestBody {
  prompt: string;
  targetLanguage?: string;
  scriptStyle?: "native" | "romanized" | "both";
  songType?: string;
  poeticVibe?: string;
  emotionalDepth?: string;
  songEnding?: string;
  // Advanced fields
  perspective?: string;
  voice?: string;
  tempo?: string;
  songLength?: string;
  structure?: string;
  referenceVibe?: string;
  specificDetails?: string;
  wordsToAvoid?: string;
  targetAudience?: string;
  polishPass?: boolean;
}
