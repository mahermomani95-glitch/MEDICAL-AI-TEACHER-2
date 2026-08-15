import questions from "./data/question-bank.json" with { type: "json" };
import { buildScenes } from "./data/scene-engine.js";

let currentQuestionIndex = 0;
let currentScene = 0;
let q = questions[currentQuestionIndex];
let scenes = buildScenes(q);

const $ = (selector) => document.querySelector(selector);

function renderQuestionList() {
  const select = $("#questionSelect");
  if (!select) return;
  select.innerHTML = "";
  questions.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${index + 1}. ${item.arabic}`;
    select.appendChild(option);
  });
  select.value = String(currentQuestionIndex);
}

function renderQuestion() {
  $("#question").textContent = q.arabic;
  $("#arabic").textContent = "شرح السؤال بالعربي أولاً، ثم ننتقل للمنطق والجواب.";
  const optionsEl = $("#options");
  optionsEl.innerHTML = "";
  q.options.forEach((item, index) => {
    const option = document.createElement("div");
    option.className = `option${item.letter === q.source_indicated_answer ? " correct" : ""}`;
    option.dir = "rtl";
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = `${item.letter}.`;
    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = q.arabic_options[index];
    option.append(text, letter);
    if (item.letter === q.source_indicated_answer) {
      const check = document.createElement("span");
      check.className = "option-check";
      check.textContent = "✓";
      option.appendChild(check);
    }
    optionsEl.appendChild(option);
  });
}

function renderDialogue(dialogue) {
  const container = document.createElement("div");
  container.className = "dialogue-list teacher-only";
  dialogue.forEach((item) => {
    item.parts.forEach((part) => {
      const line = document.createElement("div");
      line.className = "arabic-line";
      line.dir = "rtl";
      line.lang = "ar";
      line.textContent = part.text;
      container.appendChild(line);
    });
  });
  return container;
}

function renderScene() {
  const scene = scenes[currentScene];
  $("#sceneLabel").textContent = scene.label;
  $("#visual").innerHTML = scene.visual;
  const dialogue = $("#dialogue");
  dialogue.innerHTML = "";
  dialogue.appendChild(renderDialogue(scene.dialogue));
  $("#next").textContent = currentScene === scenes.length - 1 ? "إعادة الشرح ↻" : "المشهد التالي ←";
  if ($("#sceneProgress")) $("#sceneProgress").textContent = `المشهد ${currentScene + 1} / ${scenes.length}`;
}

function selectQuestion(index) {
  const nextIndex = Number(index);
  if (!Number.isInteger(nextIndex) || !questions[nextIndex]) return;
  currentQuestionIndex = nextIndex;
  q = questions[currentQuestionIndex];
  scenes = buildScenes(q);
  currentScene = 0;
  renderQuestion();
  renderScene();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("#questionSelect")?.addEventListener("change", (event) => selectQuestion(event.target.value));
$("#next")?.addEventListener("click", () => {
  currentScene = currentScene >= scenes.length - 1 ? 0 : currentScene + 1;
  renderScene();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderQuestionList();
renderQuestion();
renderScene();
