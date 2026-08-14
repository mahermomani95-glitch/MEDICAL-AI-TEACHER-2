import assert from "node:assert/strict";
import questions from "./question-bank.json" with { type: "json" };
import { buildScenes, validateQuestion } from "./scene-engine.js";

assert.ok(questions.length >= 1, "Question bank must not be empty");
questions.forEach(validateQuestion);

for (const question of questions) {
  const scenes = buildScenes(question);
  assert.equal(scenes.length, 6, `${question.id}: expected 6 scenes`);
  assert.deepEqual(scenes.map((scene) => scene.id), [
    "QUESTION",
    "ANSWER_PROPOSAL",
    "CLINICAL_REASONING",
    "DISTRACTORS",
    "EXAM_TRAP",
    "TAKE_HOME"
  ]);
  assert.ok(scenes[1].dialogue.some((line) => line.name === "DR. ANAS"));
  assert.ok(scenes[2].dialogue.some((line) => line.name === "TEACHER"));
  assert.ok(scenes[5].visual.includes(question.source_indicated_answer));
}

console.log(`Scene engine tests passed for ${questions.length} question(s).`);
