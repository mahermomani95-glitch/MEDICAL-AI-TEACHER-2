import assert from "node:assert/strict";
import { VOICE_CONFIG, buildVoiceTranscript } from "./voice-config.js";

assert.equal(VOICE_CONFIG.voiceStyle, "clear");
assert.equal(VOICE_CONFIG.languageMode, "ar-en");
assert.equal(VOICE_CONFIG.preserveEnglishMedicalTerms, true);

const text = buildVoiceTranscript([
  { name: "TEACHER", parts: [{ type: "ar", text: "ركز على الـclinical clue." }] }
]);
assert.match(text, /clinical clue/);
console.log("Voice config tests passed.");
