import fs from 'node:fs/promises';
import path from 'node:path';

const input = process.argv[2] || 'production/batch-001.json';
const outDir = process.argv[3] || 'production/generated';
const data = JSON.parse(await fs.readFile(input, 'utf8'));
const contentPath = path.join(path.dirname(input), 'content', `${path.basename(input, '.json')}-teaching.json`);
let teaching = {};
try { teaching = JSON.parse(await fs.readFile(contentPath, 'utf8')); } catch { console.warn(`No teaching content at ${contentPath}; using safe fallback.`); }
await fs.mkdir(outDir, { recursive: true });

const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const answer = q => `${String.fromCharCode(65 + q.correct_index)} — ${q.options[q.correct_index]}`;
const fallback = q => ({
  answer: q.options[q.correct_index],
  reasoning: 'شرح الفكرة الطبية الأساسية المرتبطة بالسؤال.',
  distractors: 'تحليل سبب صحة الإجابة ومتى لا تنطبق البدائل.',
  trap: 'انتبه إلى Trigger Word في السؤال.',
  take_home: `${answer(q)} — احفظ القاعدة الأساسية.`,
  visual: 'Clinical concept diagram'
});
const SCENES = [
  ['question', 0, 10], ['answer', 10, 8], ['reasoning', 18, 12],
  ['distractors', 30, 12], ['exam-trap', 42, 10], ['take-home', 52, 8]
];
function visualFor(q, c) {
  if (c?.visual) return c.visual;
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
  const c = { ...fallback(q), ...(teaching[q.id] || {}) };
  const correct = answer(q);
  const visual = visualFor(q, c);
  const optionsHtml = q.options.map((o,i) => `<div class="opt ${i===q.correct_index?'ok':''}">${String.fromCharCode(65+i)} — ${esc(o)}</div>`).join('');
  const scenes = [
    {start:0,duration:10,title:'QUESTION · 01',text:q.question,caption:q.question},
    {start:10,duration:8,title:'ANSWER · 02',text:`${correct}\n${c.answer}`,caption:`الإجابة الصحيحة: ${c.answer}`},
    {start:18,duration:12,title:'CLINICAL REASONING · 03',text:c.reasoning,caption:c.reasoning},
    {start:30,duration:12,title:'DISTRACTORS · 04',text:c.distractors,caption:c.distractors},
    {start:42,duration:10,title:'EXAM TRAP · 05',text:c.trap,caption:c.trap},
    {start:52,duration:8,title:'TAKE HOME · 06',text:c.take_home,caption:c.take_home}
  ];
  const sectionHtml = scenes.map((s,i) => `<section id="scene-${String(i+1).padStart(2,'0')}" class="scene clip" data-start="${s.start}" data-duration="${s.duration}"><div class="k">${esc(s.title)}</div><div class="t ar">${esc(s.text)}</div>${i===0?`<div class="card">${optionsHtml}</div>`:''}${i===2?`<div class="visual">${esc(visual)}</div>`:''}</section>`).join('\n');
  const captionHtml = scenes.map(s => `<div class="caption clip" data-start="${s.start}" data-duration="${s.duration}"><span>${esc(s.caption)}</span></div>`).join('\n');
  const html = `<!doctype html><html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Medical AI Teacher — ${esc(q.id)}</title><style>
:root{--bg:#07111F;--panel:#0E2A36;--accent:#19C3B1;--accent2:#8BE9E0;--text:#F7FAFC}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--bg);color:var(--text);font-family:Arial,sans-serif}[data-composition-id]{width:1920px;height:1080px;position:relative;overflow:hidden;background:radial-gradient(circle at 75% 20%,#123441 0,transparent 38%),var(--bg)}.scene{position:absolute;inset:0;padding:90px 150px 150px;display:flex;flex-direction:column;justify-content:center;gap:28px;opacity:0;visibility:hidden}.k{color:var(--accent);font-size:26px;font-weight:800;letter-spacing:.08em}.t{font-size:48px;font-weight:800;line-height:1.25;max-width:1550px;white-space:pre-line}.card{background:rgba(14,42,54,.92);border:2px solid rgba(139,233,224,.18);border-radius:28px;padding:30px;font-size:32px}.opt{padding:12px;margin:6px 0}.ok{border:2px solid var(--accent);border-radius:14px}.ar{direction:rtl;text-align:right}.visual{font-size:30px;color:var(--accent2)}.caption{position:absolute;left:160px;right:160px;bottom:55px;z-index:20;display:flex;justify-content:center;opacity:0;visibility:hidden}.caption span{max-width:1500px;background:rgba(0,0,0,.72);padding:15px 24px;border-radius:14px;font-size:27px;text-align:center;direction:rtl}.footer{position:absolute;bottom:20px;left:150px;right:150px;display:flex;justify-content:space-between;color:rgba(247,250,252,.58);font-size:18px}</style></head><body>
<div id="medical-ai-teacher-${esc(q.id)}" data-composition-id="medical-ai-teacher-${esc(q.id)}" data-start="0" data-duration="60" data-fps="30" data-width="1920" data-height="1080">
${sectionHtml}\n${captionHtml}<div class="footer"><span>Medical AI Teacher · Teacher only</span><span>${esc(q.id)}</span></div></div>
<script>(function(){const root=document.querySelector('[data-composition-id]');const timed=[...root.querySelectorAll('.clip')];function setVisible(el,on){el.style.opacity=on?'1':'0';el.style.visibility=on?'visible':'hidden'}function seek(time){const t=Math.max(0,Number(time)||0);timed.forEach(el=>{const s=+el.dataset.start,d=+el.dataset.duration;setVisible(el,t>=s&&t<s+d)})}window.__timelines=window.__timelines||{};window.__timelines[root.dataset.compositionId]={seek,progress:seek,totalDuration:60,duration:60};seek(0)})();</script></body></html>`;
  await fs.writeFile(path.join(dir, 'index.html'), html);
  await fs.writeFile(path.join(dir, 'metadata.json'), JSON.stringify({id:q.id,specialty:q.specialty,year:q.year,correct_index:q.correct_index,correct_letter:q.correct_letter,visual,scenes},null,2));
}
console.log(`Prepared ${data.questions.length} content-driven question compositions in ${outDir}`);
