import assert from "node:assert/strict";
import { renderVideoHtml } from "./render-html.js";

const html = renderVideoHtml({
  title: "Medical AI Teacher",
  scenes: [{
    id: "QUESTION",
    durationSeconds: 8,
    visual: "Question",
    dialogue: [{ name: "TEACHER", parts: [{ type: "ar", text: "افهم السؤال" }] }]
  }]
});

assert.match(html, /Medical AI Teacher/);
assert.match(html, /QUESTION/);
assert.match(html, /افهم السؤال/);
assert.match(html, /setTimeout/);
console.log("HTML renderer tests passed.");
