import { ACTIVE_FONT_PRESET, FONT_PRESETS, FONT_SOURCE } from "@/config/fonts";
import { fontVariables } from "@/lib/fonts.google";

const preset = FONT_PRESETS[ACTIVE_FONT_PRESET];
void preset;

if (FONT_SOURCE === "local") {
  console.warn(
    "[fonts] FONT_SOURCE=local requested, but no local .woff2 files exist yet. Using Google fonts.",
  );
}

export { fontVariables };
export const activeFontSource = "google" as const;
