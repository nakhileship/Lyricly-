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
}

export interface VisualDirection {
  colorPalette: ColorPaletteItem[];
  imagery: string;
  imagePrompt: string;
}

export interface GenerationResponse {
  detectedLanguage: string;
  targetLanguage?: string;
  songType?: string;
  poeticVibe?: string;
  emotionalDepth?: string;
  songEnding?: string;
  lyrics: string;
  music: MusicDirection;
  visual: VisualDirection;
}

export interface GenerateRequestBody {
  prompt: string;
  targetLanguage?: string;
  songType?: string;
  poeticVibe?: string;
  emotionalDepth?: string;
  songEnding?: string;
}
