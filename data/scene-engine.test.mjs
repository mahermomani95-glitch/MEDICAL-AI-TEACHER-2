import assert from "node:assert/strict";
import questions from "./question-bank.json" with { type: "json" };
import { buildScenes, validateQuestion } from "./scene-engine.js";

assert.ok(questions.length >= 1, "Question bank must not be empty");

for (const question of questions) {
  assert.equal(validateQuestion(question), true);
  const scenes = buildScenes(question);
  assert.equal(scenes.length, 6, `${question.id}: expected 6 scenes`);
  assert.deepEqual(scenes.map((scene) => scene.id), [
    "QUESTION", "ANSWER_PROPOSAL", "CLINICAL_REASONING", "DISTRACTORS", "EXAM_TRAP", "TAKE_HOME"
  ]);
  assert.ok(scenes.every((scene) => scene.dialogue.every((item) => item.name === "TEACHER")));
  assert.ok(scenes[2].dialogue.some((item) => item.name === "TEACHER"));
  assert.ok(scenes[5].visual.includes(question.source_indicated_answer));
}

console.log(`Scene engine tests passed for ${questions.length} question(s).`);
