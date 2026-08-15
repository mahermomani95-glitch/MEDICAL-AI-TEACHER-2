import fs from 'node:fs/promises';
import path from 'node:path';

const input = process.argv[2] || 'production/batch-001.json';
const outDir = process.argv[3] || 'production/generated';
const data = JSON.parse(await fs.readFile(input, 'utf8'));
await fs.mkdir(outDir, { recursive: true });

const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const answer = q => `${String.fromCharCode(65 + q.correct_index)} — ${q.options[q.correct_index]}`;

function visualFor(q) {
  const text = `${q.question} ${q.options.join(' ')}`.toLowerCase();
  if (/ecg|ekg|mi|infarct|st elevation|arrhythm/.test(text)) return 'ECG / cardiac diagram';
  if (/fracture|bone|pelvic|femur|spine/.test(text)) return 'Anatomy / skeletal diagram';
  if (/thyroid|cervical|uterus|colon|bladder|sphincter|jaundice|liver/.test(text)) return 'Relevant anatomy / clinical diagram';
  if (/drug|opioid|antibiotic|oCP|contraceptive|factor|vitamin|formula/.test(text)) return 'Mechanism / pathway diagram';
  return 'Clinical concept diagram';
}

for (const q of data.questions) {
  const dir = path.join(outDir, q.id);
  await fs.mkdir(dir, { recursive: true });
  const correct = answer(q);
  const visual = visualFor(q);
  const html = `<!doctype html><html lang="ar"><head><meta charset="utf-8"><title>Medical AI Teacher — ${esc(q.id)}</title><style>body{margin:0;background:#07111F;color:#F7FAFC;font-family:Arial,sans-serif}.scene{width:1920px;height:1080px;box-sizing:border-box;padding:90px 150px;display:flex;flex-direction:column;justify-content:center;gap:28px}.k{color:#19C3B1;font-size:26px;font-weight:800}.t{font-size:58px;font-weight:800;line-height:1.2}.card{background:#0E2A36;border-radius:28px;padding:38px;font-size:34px}.opt{padding:14px;margin:8px 0}.ok{border:2px solid #19C3B1;border-radius:14px}.ar{direction:rtl;text-align:right}.visual{font-size:30px;color:#8BE9E0}.caption{position:fixed;bottom:55px;left:160px;right:160px;text-align:center;background:#000c;padding:15px;border-radius:14px;font-size:27px}</style></head><body>
<section class="scene"><div class="k">MEDICAL AI TEACHER · ${esc(q.specialty)} ${esc(q.year)}</div><div class="t ar">${esc(q.question)}</div><div class="card">${q.options.map((o,i)=>`<div class="opt ${i===q.correct_index?'ok':''}">${String.fromCharCode(65+i)} — ${esc(o)}</div>`).join('')}</div><div class="visual">Suggested visual: ${esc(visual)}</div></section>
<section class="scene"><div class="k">ANSWER</div><div class="t">${esc(correct)}</div><div class="card ar">الإجابة الصحيحة: ${esc(q.options[q.correct_index])}</div></section>
<section class="scene"><div class="k">CLINICAL REASONING</div><div class="t ar">شرح المعلم</div><div class="card ar">يشرح المعلم الفكرة الأساسية للسؤال، مع رسم أو مخطط طبي مرتبط بالمعلومة بدل استخدام صورة عشوائية.</div></section>
<section class="scene"><div class="k">DISTRACTORS</div><div class="t ar">تحليل الخيارات</div><div class="card ar">يشرح المعلم لماذا الإجابة المختارة صحيحة، ولماذا الخيارات الأخرى لا تنطبق وفق محتوى السؤال والمصدر.</div></section>
<section class="scene"><div class="k">EXAM TRAP</div><div class="t ar">نقطة الامتحان</div><div class="card ar">نستخرج Trigger Word أو قاعدة عالية العائد من السؤال.</div></section>
<section class="scene"><div class="k">TAKE HOME</div><div class="t ar">الخلاصة</div><div class="card ar">${esc(correct)} — احفظ القاعدة الأساسية واربطها بالمخطط الطبي الظاهر.</div></section>
<div class="caption">Medical AI Teacher · ${esc(q.id)}</div></body></html>`;
  await fs.writeFile(path.join(dir, 'index.html'), html);
  await fs.writeFile(path.join(dir, 'metadata.json'), JSON.stringify({id:q.id, specialty:q.specialty, year:q.year, correct_index:q.correct_index, correct_letter:q.correct_letter, visual}, null, 2));
}
console.log(`Prepared ${data.questions.length} question compositions in ${outDir}`);
