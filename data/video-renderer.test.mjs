import assert from "node:assert/strict";
import { createVideoRenderManifest, createSceneCaptionTrack } from "./video-renderer.js";

const plan = {
  title: "GI Recovery Sequence",
  scenes: [{
    id: "QUESTION",
    durationSeconds: 8,
    visual: "clinical question",
    captions: [{ start: 0, end: 2, text: "ما هو الترتيب؟", language: "ar" }],
    dialogue: [{ name: "TEACHER", parts: [{ type: "ar", text: "افهم السؤال أولاً." }] }]
  }]
};

const manifest = createVideoRenderManifest(plan);
assert.equal(manifest.format, "mp4");
assert.equal(manifest.width, 1920);
assert.equal(manifest.height, 1080);
assert.equal(manifest.scenes.length, 1);
assert.equal(createSceneCaptionTrack(plan.scenes[0])[0].text, "ما هو الترتيب؟");

console.log("Video renderer tests passed.");
