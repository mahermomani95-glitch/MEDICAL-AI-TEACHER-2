// Medical AI Teacher voice profile.
// Baseline selected from the approved project preview voice.
export const VOICE_CONFIG = {
  provider: "ai-voice-generator",
  voiceStyle: "clear",
  languageMode: "ar-en",
  speakingStyle: "medical-educational",
  target: "articulate, calm, natural, presentation-friendly",
  pacing: "moderate",
  pauses: "natural",
  pronunciation: "precise medical terminology",
  emphasis: "clinical clues, answer, exam trap, memory anchor",
  preserveEnglishMedicalTerms: true
};

export function buildVoiceTranscript(dialogue = []) {
  return dialogue.flatMap((speaker) =>
    (speaker.parts || [])
      .map((part) => String(part.text || "").trim())
      .filter(Boolean)
      .map((text) => `${speaker.name}: ${text}`)
  ).join("\n\n");
}
