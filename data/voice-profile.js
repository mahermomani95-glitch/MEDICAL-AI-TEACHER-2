// Approved voice direction for Medical AI Teacher.
// This profile is provider-neutral so the project can use a free/local TTS
// provider or swap providers later without changing the teaching engine.
export const MEDICAL_TEACHER_VOICE = Object.freeze({
  id: "clear",
  label: "Medical Teacher — Clear",
  languages: ["ar", "en"],
  style: "clear",
  pace: "natural",
  pronunciation: "medical-precise",
  delivery: "calm, confident, presentation-friendly",
  pauses: "natural",
  emphasis: ["clinical clue", "answer", "exam trap", "memory anchor"],
  avoid: ["robotic pacing", "overacting", "excessive music", "unexplained claims"]
});

export function getVoiceProfile() {
  return { ...MEDICAL_TEACHER_VOICE, languages: [...MEDICAL_TEACHER_VOICE.languages] };
}
