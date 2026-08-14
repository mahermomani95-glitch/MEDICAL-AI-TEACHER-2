import fs from "node:fs";
import assert from "node:assert/strict";

const config = JSON.parse(
  fs.readFileSync(new URL("./production-config.json", import.meta.url), "utf8")
);

assert.equal(config.sceneCount, 6);
assert.deepEqual(
  config.scenes.map(scene => scene.name),
  [
    "QUESTION",
    "ANSWER_PROPOSAL",
    "CLINICAL_REASONING",
    "DISTRACTORS",
    "EXAM_TRAP",
    "TAKE_HOME"
  ]
);

assert.deepEqual(
  config.characters.map(character => character.id),
  ["MAHER", "DR_ANAS", "TEACHER"]
);

assert.ok(config.fidelityRules.length >= 4);
assert.equal(config.videoReady.targetAspectRatio, "16:9");

console.log("Production configuration tests passed.");
