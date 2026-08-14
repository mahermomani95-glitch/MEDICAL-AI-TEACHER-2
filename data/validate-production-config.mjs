import fs from "node:fs";

const config = JSON.parse(fs.readFileSync(new URL("./production-config.json", import.meta.url), "utf8"));
const required = ["QUESTION","ANSWER_PROPOSAL","CLINICAL_REASONING","DISTRACTORS","EXAM_TRAP","TAKE_HOME"];

if (config.sceneCount !== 6 || config.scenes.length !== 6) throw new Error("Production contract must contain exactly 6 scenes.");
if (!required.every(name => config.scenes.some(scene => scene.name === name))) throw new Error("Production contract is missing a required scene.");
if (!["MAHER","DR_ANAS","TEACHER"].every(id => config.characters.some(character => character.id === id))) throw new Error("Production contract is missing a core character.");
if (!config.fidelityRules?.length) throw new Error("Source-fidelity rules are required.");
if (config.videoReady?.targetAspectRatio !== "16:9") throw new Error("Video output must target 16:9.");

console.log("Production contract valid: 6 scenes, 3 core characters, source-fidelity rules, 16:9 output.");
