import fs from "node:fs";

const file = new URL("./production-config.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(file, "utf8"));

const requiredScenes = [
  "QUESTION",
  "ANSWER_PROPOSAL",
  "CLINICAL_REASONING",
  "DISTRACTORS",
  "EXAM_TRAP",
  "TAKE_HOME"
];

if (config.sceneCount !== 6) {
  throw new Error(`Expected 6 scenes, found ${config.sceneCount}`);
}

if (config.scenes.length !== 6) {
  throw new Error(`Expected 6 scene definitions, found ${config.scenes.length}`);
}

const names = config.scenes.map(scene => scene.name);
for (const name of requiredScenes) {
  if (!names.includes(name)) {
    throw new Error(`Missing required scene: ${name}`);
  }
}

for (const character of ["MAHER", "DR_ANAS", "TEACHER"]) {
  if (!config.characters.some(item => item.id === character)) {
    throw new Error(`Missing required character: ${character}`);
  }
}

if (!config.fidelityRules?.length) {
  throw new Error("No source-fidelity rules configured");
}

console.log("Production configuration is valid: 6 scenes, 3 core characters, source-fidelity rules present.");
