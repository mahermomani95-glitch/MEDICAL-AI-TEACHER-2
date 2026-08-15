// Voice production layer. Keeps voice generation provider-neutral while
// preserving the chosen Medical AI Teacher voice profile and timing rules.

export const MEDICAL_TEACHER_VOICE = Object.freeze({
  style: "clear",
  languageMode: "ar-en",
  pace: "natural",
  pronunciation: "medical-precise",
  pauses: "natural",
  emphasis: ["clinical clue", "answer", "exam trap", "memory anchor"]
});

export function buildVoiceRenderPlan(videoPlan, voice = MEDICAL_TEACHER_VOICE) {
  if (!videoPlan?.scenes?.length) throw new Error("Video plan has no scenes.");

  return {
    voice,
    scenes: videoPlan.scenes.map((scene) => ({
      sceneId: scene.id,
      durationSeconds: scene.durationSeconds || 8,
      tracks: (scene.dialogue || []).map((speaker) => ({
        speaker: speaker.name,
        parts: (speaker.parts || []).map((part) => ({
          language: part.type || "ar",
          text: part.text,
          emphasis: part.emphasis || false,
          pauseAfterMs: part.pauseAfterMs ?? 250
        }))
      }))
    }))
  };
}
