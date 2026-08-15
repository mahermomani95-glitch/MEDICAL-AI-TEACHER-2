export const VIDEO_FORMAT = {
  aspectRatio: "16:9",
  resolution: "1080p",
  format: "mp4"
};

const DEFAULT_DURATION = {
  QUESTION: 18,
  ANSWER_PROPOSAL: 12,
  CLINICAL_REASONING: 35,
  DISTRACTORS: 30,
  EXAM_TRAP: 20,
  TAKE_HOME: 18
};

const VISUAL_DIRECTION = {
  QUESTION: "Medical classroom opening. Show the clinical question prominently with clean question-card graphics and highlight the key clue.",
  ANSWER_PROPOSAL: "Two-person teaching shot. Student proposes an answer while the teacher pauses before revealing the reasoning.",
  CLINICAL_REASONING: "Use simple clinical diagrams, arrows and highlighted clues while the teacher explains the reasoning step by step.",
  DISTRACTORS: "Show the answer choices one by one. Mark the correct reasoning path and visually cross out distractors only after explaining why they fail.",
  EXAM_TRAP: "Warning-card visual. Zoom into the trigger word and show the common exam trap without adding unsupported medical facts.",
  TAKE_HOME: "Clean recap card with trigger, memory anchor and final answer. End with a concise exam takeaway."
};

const text = (dialogue = []) =>
  dialogue
    .flatMap((block) => block?.parts || [])
    .map((part) => part?.text || "")
    .filter(Boolean)
    .join(" ");

export function buildVideoPlan(scenes, question) {
  if (!Array.isArray(scenes) || scenes.length !== 6) {
    throw new Error("Video plan requires exactly six teaching scenes.");
  }

  return {
    schema_version: "1.0",
    title: question?.id ? `Medical AI Teacher · ${question.id}` : "Medical AI Teacher",
    format: VIDEO_FORMAT,
    source_question_id: question?.id || null,
    scenes: scenes.map((scene) => ({
      id: scene.id,
      label: scene.label,
      duration_seconds: DEFAULT_DURATION[scene.id] || 20,
      visual_direction: VISUAL_DIRECTION[scene.id],
      dialogue: scene.dialogue,
      narration: text(scene.dialogue),
      captions: scene.dialogue.flatMap((block) =>
        (block.parts || []).map((part) => ({
          speaker: block.name,
          language: part.type,
          text: part.text
        }))
      )
    })),
    production_notes: [
      "Preserve the source question and options exactly unless a transformation is explicitly requested.",
      "Do not invent a medical answer when the source does not provide one.",
      "Keep Arabic and English captions synchronized with the spoken dialogue.",
      "Use visuals to explain the supplied reasoning rather than adding unsupported clinical claims.",
      "The final render should be suitable for educational viewing on mobile and desktop."
    ]
  };
}

export function validateVideoPlan(plan) {
  if (!plan || plan.format?.aspectRatio !== "16:9") throw new Error("Video must be 16:9.");
  if (!Array.isArray(plan.scenes) || plan.scenes.length !== 6) throw new Error("Video must contain six scenes.");
  for (const scene of plan.scenes) {
    if (!scene.id || !scene.narration) throw new Error(`Scene ${scene.id || "unknown"} is missing narration.`);
  }
  return true;
}
