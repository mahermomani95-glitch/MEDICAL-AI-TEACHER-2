import { getVoiceProfile } from "./voice-profile.js";

const clean = (v) => typeof v === "string" ? v.trim() : "";

export function buildAudioTimeline(videoPlan, options = {}) {
  if (!videoPlan?.scenes?.length) throw new Error("Video plan with scenes is required.");
  const voice = getVoiceProfile();
  const defaultPause = options.pauseSeconds ?? 0.35;
  let cursor = 0;

  const scenes = videoPlan.scenes.map((scene) => {
    const lines = (scene.dialogue || []).flatMap((speaker) =>
      (speaker.parts || []).map((part) => ({
        speaker: speaker.name,
        language: part.type || "ar",
        text: clean(part.text)
      }))
    ).filter((x) => x.text);

    const duration = Number(scene.durationSeconds || 8);
    const item = {
      sceneId: scene.id,
      startSeconds: cursor,
      endSeconds: cursor + duration,
      voice,
      lines,
      pauseSeconds: defaultPause
    };
    cursor += duration;
    return item;
  });

  return {
    voice,
    totalDurationSeconds: cursor,
    scenes
  };
}
