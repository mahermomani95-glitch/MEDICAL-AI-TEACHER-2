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
  for (const scene of scenes) {
    assert.ok(scene.dialogue.length > 0, `${question.id}: scene must have narration`);
    assert.ok(scene.dialogue.every((item) => item.name === "TEACHER"), `${question.id}: teacher-only narration required`);
    assert.ok(scene.dialogue.every((item) => item.parts.every((part) => part.type === "ar")), `${question.id}: Arabic-only narration required`);
  }
  assert.ok(scenes.every((scene) => scene.visual && scene.visual.length > 0), `${question.id}: every scene needs a visual`);
  assert.ok(scenes[5].visual.includes("قاعدة واحدة تحفظها"));
}

console.log(`Teacher-only Arabic scene tests passed for ${questions.length} question(s).`);
