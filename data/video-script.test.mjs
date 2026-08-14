import assert from "node:assert/strict";
import question from "./sample-question.json" with { type: "json" };
import { buildScenes } from "./scene-engine.js";
import { buildVideoPlan } from "./video-script.js";

const scenes = buildScenes(question);
const plan = buildVideoPlan(question, scenes);

assert.equal(plan.kind, "medical-ai-teacher-video");
assert.equal(plan.aspect_ratio, "16:9");
assert.deepEqual(plan.language_tracks, ["en", "ar"]);
assert.equal(plan.scenes.length, 6);
assert.deepEqual(plan.scenes.map((scene) => scene.id), [
  "QUESTION",
  "ANSWER_PROPOSAL",
  "CLINICAL_REASONING",
  "DISTRACTORS",
  "EXAM_TRAP",
  "TAKE_HOME"
]);
assert.ok(plan.scenes.every((scene) => scene.duration_seconds > 0));
assert.ok(plan.scenes.every((scene) => scene.dialogue.length > 0));
assert.equal(plan.total_duration_seconds, 124);

console.log("Video script tests passed.");
