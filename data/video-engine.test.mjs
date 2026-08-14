import assert from "node:assert/strict";
import questions from "./question-bank.json" with { type: "json" };
import { buildScenes } from "./scene-engine.js";
import { buildVideoPlan, validateVideoPlan } from "./video-engine.js";

const question = questions[0];
const scenes = buildScenes(question);
const plan = buildVideoPlan(scenes, question);

assert.equal(plan.format.aspectRatio, "16:9");
assert.equal(plan.format.resolution, "1080p");
assert.equal(plan.scenes.length, 6);
assert.equal(plan.source_question_id, question.id);
assert.ok(plan.scenes.every((scene) => scene.narration.length > 0));
assert.equal(validateVideoPlan(plan), true);

console.log("Video engine tests passed.");
