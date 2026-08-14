import assert from "node:assert/strict";
import question from "./sample-question.json" with { type: "json" };
import { buildScenes, validateQuestion } from "./scene-engine.js";

assert.equal(validateQuestion(question), true);

const scenes = buildScenes(question);
assert.equal(scenes.length, 6);
assert.deepEqual(
  scenes.map((scene) => scene.id),
  ["QUESTION", "ANSWER_PROPOSAL", "CLINICAL_REASONING", "DISTRACTORS", "EXAM_TRAP", "TAKE_HOME"]
);

assert.ok(scenes[0].dialogue.length > 0);
assert.ok(scenes[1].dialogue.some((item) => item.parts.some((part) => part.text.includes("Stomach then small bowel then colon"))));
assert.ok(scenes[3].dialogue.some((item) => item.parts.some((part) => part.text.startsWith("A."))));
assert.ok(scenes[5].dialogue.some((item) => item.parts.some((part) => part.text.includes("Stomach → Small bowel → Colon"))));

console.log("Scene engine tests passed.");
