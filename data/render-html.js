// Zero-dependency renderer source for the browser/Node pipeline.
// It creates a self-contained HTML timeline that can be captured as MP4
// by a local renderer such as FFmpeg/Playwright/Remotion later.

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function renderVideoHtml(manifest) {
  if (!manifest?.scenes?.length) throw new Error("Manifest has no scenes.");

  const scenes = manifest.scenes.map((scene, i) => {
    const lines = (scene.dialogue || []).flatMap((speaker) =>
      (speaker.parts || []).map((part) =>
        `<div class="line"><b>${esc(speaker.name)}</b><span class="${esc(part.type || "ar")}">${esc(part.text)}</span></div>`
      )
    ).join("");

    return `<section class="scene" data-scene="${esc(scene.id)}" data-duration="${scene.durationSeconds}" style="--i:${i}">
      <div class="visual">${esc(scene.visual)}</div>
      <div class="dialogue">${lines}</div>
    </section>`;
  }).join("\n");

  return `<!doctype html>
<html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(manifest.title)}</title>
<style>
*{box-sizing:border-box}html,body{margin:0;background:#07111f;color:#fff;font-family:Arial,sans-serif}
.timeline{width:100vw;height:100vh;overflow:hidden}.scene{position:absolute;inset:0;padding:7vw 8vw;display:none;flex-direction:column;justify-content:center;gap:4vh;background:linear-gradient(135deg,#07111f,#10243d)}
.scene.active{display:flex}.visual{font-size:clamp(24px,3vw,58px);font-weight:700;text-align:center;white-space:pre-wrap}.dialogue{display:flex;flex-direction:column;gap:12px;max-width:1200px;margin:auto;width:100%}.line{display:flex;gap:16px;align-items:flex-start;font-size:clamp(18px,1.8vw,34px);line-height:1.35}.line b{min-width:150px}.ar{direction:rtl}.en{direction:ltr}
</style></head><body><main class="timeline">${scenes}</main>
<script>const scenes=[...document.querySelectorAll('.scene')];let i=0;function show(){scenes.forEach((s,n)=>s.classList.toggle('active',n===i));const d=(Number(scenes[i].dataset.duration)||8)*1000;setTimeout(()=>{if(i<scenes.length-1){i++;show()}},d)}show();</script>
</body></html>`;
}
