import question from "./data/sample-question.json" with { type: "json" };

const q = question;
let scene = 0;

document.querySelector("#question").textContent = q.question;
document.querySelector("#arabic").textContent = q.arabic;
const options = document.querySelector("#options");

q.options.forEach((item) => {
  const el = document.createElement("div");
  el.className = "option";
  el.innerHTML = `<span class="letter">${item.letter}.</span>${item.text}`;
  options.appendChild(el);
});

const scenes = [
  {
    label:"SCENE 01 · QUESTION",
    visual:`<div class="flow">Clinical Question<br>↓<br>Read the clues before choosing</div>`,
    dialogue:`<strong>MAHER:</strong> دكتور، خلينا نفهم السؤال أول قبل ما نختار الإجابة.`
  },
  {
    label:"SCENE 02 · ANSWER PROPOSAL",
    visual:`<div class="flow">Stomach → Small bowel → Colon</div>`,
    dialogue:`<strong>DR. ANAS:</strong> أنا أميل إلى <b>Stomach → small bowel → colon</b>.<br><br><strong>TEACHER:</strong> ممتاز. الآن أثبت لي لماذا هذا هو الترتيب الصحيح.`
  },
  {
    label:"SCENE 03 · CLINICAL REASONING",
    visual:`<div class="flow">Stomach<br>↓<br>Small bowel<br>↓<br>Colon<br><small>normal physiological pathway</small></div>`,
    dialogue:`<strong>TEACHER:</strong> حسب المصدر، الخيار C يشرح المسار الفسيولوجي الطبيعي: الطعام ينتقل من المعدة إلى الأمعاء الدقيقة ثم إلى القولون.`
  },
  {
    label:"SCENE 04 · TAKE-HOME",
    visual:`<div class="flow">TRIGGER<br>Normal GI sequence<br><br>ANSWER<br>C</div>`,
    dialogue:`<strong>TEACHER:</strong> خذها كـmemory anchor: <b>Stomach → Small bowel → Colon</b>.`
  }
];

function renderScene(){
  const s = scenes[scene];
  document.querySelector("#sceneLabel").textContent = s.label;
  document.querySelector("#visual").innerHTML = s.visual;
  document.querySelector("#dialogue").innerHTML = s.dialogue;
  document.querySelector("#next").textContent = scene === scenes.length-1 ? "Restart scene →" : "Next teaching scene →";
}
document.querySelector("#next").addEventListener("click",()=>{
  scene = (scene + 1) % scenes.length;
  renderScene();
});
renderScene();
