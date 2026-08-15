import assert from "node:assert/strict";
import { buildVoiceRenderPlan, MEDICAL_TEACHER_VOICE } from "./voice-render-plan.js";

const plan = buildVoiceRenderPlan({
  scenes: [{
    id: "REASONING",
    durationSeconds: 10,
    dialogue: [{ name: "TEACHER", parts: [
      { type: "ar", text: "ركز على الـclinical clue", emphasis: true, pauseAfterMs: 400 }
    ] }]
  }]
});

assert.equal(plan.voice.style, "clear");
assert.equal(plan.voice.languageMode, "ar-en");
assert.equal(plan.scenes[0].tracks[0].parts[0].emphasis, true);
assert.equal(plan.scenes[0].tracks[0].parts[0].pauseAfterMs, 400);
assert.equal(MEDICAL_TEACHER_VOICE.pronunciation, "medical-precise");
console.log("Voice render plan tests passed.");
