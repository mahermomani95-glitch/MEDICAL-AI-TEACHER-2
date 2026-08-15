import assert from "node:assert/strict";
import { buildAudioTimeline } from "./audio-timeline.js";

const result = buildAudioTimeline({
  scenes: [
    { id: "QUESTION", durationSeconds: 8, dialogue: [{ name: "TEACHER", parts: [{ type: "ar", text: "افهم السؤال أولاً." }] }] },
    { id: "ANSWER", durationSeconds: 6, dialogue: [{ name: "ANAS", parts: [{ type: "en", text: "The answer is C." }] }] }
  ]
});

assert.equal(result.voice.id, "clear");
assert.equal(result.scenes.length, 2);
assert.equal(result.scenes[1].startSeconds, 8);
assert.equal(result.totalDurationSeconds, 14);
assert.equal(result.scenes[0].lines[0].language, "ar");
console.log("Audio timeline tests passed.");
