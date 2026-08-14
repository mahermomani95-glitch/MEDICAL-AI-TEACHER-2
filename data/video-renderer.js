// Provider-neutral video renderer contract for Medical AI Teacher.
// The renderer prepares a deterministic render manifest that can be sent to
// a free/local renderer (Remotion/FFmpeg) or an optional cloud provider.

const clean = (value) => typeof value === "string" ? value.trim() : "";

export const RENDER_VERSION = "1.0";

export function createVideoRenderManifest(videoPlan, options = {}) {
  if (!videoPlan || !Array.isArray(videoPlan.scenes) || videoPlan.scenes.length === 0) {
    throw new Error("A video plan with scenes is required.");
  }

  const width = options.width || 1920;
  const height = options.height || 1080;
  const fps = options.fps || 30;

  return {
    renderVersion: RENDER_VERSION,
    format: "mp4",
    width,
    height,
    fps,
    language: options.language || "ar-en",
    title: clean(videoPlan.title) || "Medical AI Teacher",
    scenes: videoPlan.scenes.map((scene, index) => ({
      id: scene.id,
      order: index + 1,
      durationSeconds: scene.durationSeconds || 8,
      visual: clean(scene.visual),
      captions: Array.isArray(scene.captions) ? scene.captions : [],
      dialogue: Array.isArray(scene.dialogue) ? scene.dialogue : [],
      assets: Array.isArray(scene.assets) ? scene.assets : [],
      transitionIn: scene.transitionIn || "fade",
      transitionOut: scene.transitionOut || "fade"
    }))
  };
}

export function createSceneCaptionTrack(scene) {
  return (scene.captions || []).map((caption, index) => ({
    id: `${scene.id || "scene"}-caption-${index + 1}`,
    start: caption.start ?? 0,
    end: caption.end ?? Math.max((caption.start ?? 0) + 2, 2),
    text: clean(caption.text),
    language: caption.language || "ar"
  }));
}
