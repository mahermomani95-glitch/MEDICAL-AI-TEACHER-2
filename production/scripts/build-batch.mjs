import fs from 'node:fs/promises';
import path from 'node:path';

const input = process.argv[2] || 'production/batch-001.json';
const outDir = process.argv[3] || 'production/generated';
const data = JSON.parse(await fs.readFile(input, 'utf8'));
await fs.mkdir(outDir, { recursive: true });

const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const answer = q => `${String.fromCharCode(65 + q.correct_index)} — ${q.options[q.correct_index]}`;

const SCENES = [
  ['question', 0, 10],
  ['answer', 10, 8],
  ['reasoning', 18, 12],
  ['distractors', 30, 12],
  ['exam-trap', 42, 10],
  ['take-home', 52, 8]
];

function visualFor(q) {
  const text = `${q.question} ${q.options.join(' ')}`.toLowerCase();
  if (/ecg|ekg|mi|infarct|st elevation|arrhythm/.test(text)) return 'ECG / cardiac diagram';
  if (/fracture|bone|pelvic|femur|spine/.test(text)) return 'Anatomy / skeletal diagram';
  if (/thyroid|cervical|uterus|colon|bladder|sphincter|jaundice|liver/.test(text)) return 'Relevant anatomy / clinical diagram';
  if (/drug|opioid|antibiotic|ocp|contraceptive|factor|vitamin|formula/.test(text)) return 'Mechanism / pathway diagram';
  return 'Clinical concept diagram';
}

for (const q of data.questions) {
  const dir = path.join(outDir, q.id);
  await fs.mkdir(dir, { recursive: true });
  const correct = answer(q);
  const visual = visualFor(q);
  const optionsHtml = q.options.map((o,i) => `<div class="opt ${i===q.correct_index?'ok':''}">${String.fromCharCode(65+i)} — ${esc(o)}</div>`).join('');

  const html = `<!doctype html>
<html lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Medical AI Teacher — ${esc(q.id)}</title>
<style>
:root{--bg:#07111F;--panel:#0E2A36;--accent:#19C3B1;--accent2:#8BE9E0;--text:#F7FAFC;--muted:#B8C7D3}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--bg);color:var(--text);font-family:Arial,sans-serif}
[data-composition-id="medical-ai-teacher-${esc(q.id)}"]{width:1920px;height:1080px;position:relative;overflow:hidden;background:radial-gradient(circle at 75% 20%,#123441 0,transparent 38%),var(--bg)}
.scene{position:absolute;inset:0;padding:90px 150px 150px;display:flex;flex-direction:column;justify-content:center;gap:28px;opacity:0;visibility:hidden}
.k{color:var(--accent);font-size:26px;font-weight:800;letter-spacing:.08em}.t{font-size:58px;font-weight:800;line-height:1.2;max-width:1550px}.card{background:rgba(14,42,54,.92);border:2px solid rgba(139,233,224,.18);border-radius:28px;padding:38px;font-size:34px}.opt{padding:14px;margin:8px 0}.ok{border:2px solid var(--accent);border-radius:14px}.ar{direction:rtl;text-align:right}.visual{font-size:30px;color:var(--accent2)}
.caption{position:absolute;left:160px;right:160px;bottom:55px;z-index:20;display:flex;justify-content:center;opacity:0;visibility:hidden}.caption span{max-width:1500px;background:rgba(0,0,0,.72);padding:15px 24px;border-radius:14px;font-size:27px;text-align:center}
.footer{position:absolute;bottom:20px;left:150px;right:150px;display:flex;justify-content:space-between;color:rgba(247,250,252,.58);font-size:18px}
</style>
</head>
<body>
<div id="medical-ai-teacher-${esc(q.id)}" data-composition-id="medical-ai-teacher-${esc(q.id)}" data-start="0" data-duration="60" data-fps="30" data-width="1920" data-height="1080">
<section id="scene-01" class="scene" data-start="0" data-duration="10"><div class="k">MEDICAL AI TEACHER · ${esc(q.specialty)} ${esc(q.year)}</div><div class="t ar">${esc(q.question)}</div><div class="card">${optionsHtml}</div><div class="visual">Suggested visual: ${esc(visual)}</div></section>
<section id="scene-02" class="scene" data-start="10" data-duration="8"><div class="k">ANSWER · 02</div><div class="t">${esc(correct)}</div><div class="card ar">الإجابة الصحيحة: ${esc(q.options[q.correct_index])}</div></section>
<section id="scene-03" class="scene" data-start="18" data-duration="12"><div class="k">CLINICAL REASONING · 03</div><div class="t ar">شرح الفكرة الأساسية</div><div class="card ar">يشرح المعلم الفكرة الأساسية للسؤال، مع رسم أو مخطط طبي مرتبط بالمعلومة بدل استخدام صورة عشوائية.</div></section>
<section id="scene-04" class="scene" data-start="30" data-duration="12"><div class="k">DISTRACTORS · 04</div><div class="t ar">تحليل الخيارات</div><div class="card ar">يشرح المعلم لماذا الإجابة المختارة صحيحة، ولماذا الخيارات الأخرى لا تنطبق وفق محتوى السؤال والمصدر.</div></section>
<section id="scene-05" class="scene" data-start="42" data-duration="10"><div class="k">EXAM TRAP · 05</div><div class="t ar">نقطة الامتحان</div><div class="card ar">نستخرج Trigger Word أو قاعدة عالية العائد من السؤال.</div></section>
<section id="scene-06" class="scene" data-start="52" data-duration="8"><div class="k">TAKE HOME · 06</div><div class="t ar">الخلاصة</div><div class="card ar">${esc(correct)} — احفظ القاعدة الأساسية واربطها بالمخطط الطبي الظاهر.</div></section>
<div class="caption" data-start="0" data-duration="10"><span>${esc(q.question)}</span></div>
<div class="caption" data-start="10" data-duration="8"><span>الإجابة الصحيحة: ${esc(q.options[q.correct_index])}</span></div>
<div class="caption" data-start="18" data-duration="12"><span>الفكرة الأساسية للسؤال والقاعدة الطبية المرتبطة بها.</span></div>
<div class="caption" data-start="30" data-duration="12"><span>تحليل الخيارات: لماذا الصحيح صحيح ولماذا المشتتات لا تنطبق.</span></div>
<div class="caption" data-start="42" data-duration="10"><span>Exam Trap: انتبه إلى Trigger Word أو القاعدة عالية العائد.</span></div>
<div class="caption" data-start="52" data-duration="8"><span>الخلاصة: ${esc(correct)}</span></div>
<div class="footer"><span>Medical AI Teacher</span><span>${esc(q.id)}</span></div>
</div>
<script>
(function(){
  const root=document.querySelector('[data-composition-id]');
  const scenes=[...root.querySelectorAll('.scene')];
  const captions=[...root.querySelectorAll('.caption')];
  function setVisible(el,on){el.style.opacity=on?'1':'0';el.style.visibility=on?'visible':'hidden'}
  function seek(time){
    const t=Math.max(0,Number(time)||0);
    scenes.forEach(el=>{const s=+el.dataset.start,d=+el.dataset.duration;setVisible(el,t>=s&&t<s+d)});
    captions.forEach(el=>{const s=+el.dataset.start,d=+el.dataset.duration;setVisible(el,t>=s&&t<s+d)});
  }
  window.__timelines=window.__timelines||{};
  window.__timelines[root.dataset.compositionId]={seek,progress:seek,totalDuration:60,duration:60};
  seek(0);
})();
</script>
</body>
</html>`;

  await fs.writeFile(path.join(dir, 'index.html'), html);
  await fs.writeFile(path.join(dir, 'metadata.json'), JSON.stringify({id:q.id, specialty:q.specialty, year:q.year, correct_index:q.correct_index, correct_letter:q.correct_letter, visual, scenes: SCENES}, null, 2));
}

console.log(`Prepared ${data.questions.length} question compositions in ${outDir}`);
