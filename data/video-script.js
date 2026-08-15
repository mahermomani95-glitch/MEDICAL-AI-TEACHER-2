const SCENE_ORDER = [
  "QUESTION",
  "ANSWER_PROPOSAL",
  "CLINICAL_REASONING",
  "DISTRACTORS",
  "EXAM_TRAP",
  "TAKE_HOME"
];

const DEFAULT_DURATION = {
  QUESTION: 18,
  ANSWER_PROPOSAL: 12,
  CLINICAL_REASONING: 28,
  DISTRACTORS: 32,
  EXAM_TRAP: 18,
  TAKE_HOME: 16
};

const SHOT_STYLE = {
  QUESTION: "question-card",
  ANSWER_PROPOSAL: "teacher-dialogue",
  CLINICAL_REASONING: "clinical-explainer",
  DISTRACTORS: "option-comparison",
  EXAM_TRAP: "warning-card",
  TAKE_HOME: "memory-card"
};

const VISUAL_ROLE = {
  QUESTION: "Show the full MCQ and highlight the key clinical clue without revealing the answer.",
  ANSWER_PROPOSAL: "Show the teacher proposing the source-indicated answer; keep the answer letter visually prominent.",
  CLINICAL_REASONING: "Animate the reasoning as a simple clinical flow from clue to diagnosis/answer.",
  DISTRACTORS: "Present every alternative option and mark the elimination logic one option at a time.",
  EXAM_TRAP: "Freeze the key trigger and show a clear exam-trap warning; avoid introducing unsupported facts.",
  TAKE_HOME: "End with the trigger, memory anchor, and source-indicated answer as the final recall card."
};

function textOf(part) {
  return part && typeof part.text === "string" ? part.text : "";
}

function dialogueText(scene) {
  return scene.dialogue.map((line) => ({
    speaker: line.name,
    parts: line.parts.map((part) => ({
      language: part.type === "ar" ? "ar" : "en",
      text: textOf(part)
    }))
  }));
}

/**
 * Converts the six teaching scenes into a renderer-agnostic video plan.
 * This is intentionally not a video renderer: it creates the production
 * contract that can later be rendered by HyperFrames, HeyGen, or another
 * video pipeline without changing the medical teaching logic.
 */
export function buildVideoPlan(question, scenes) {
  if (!question || !Array.isArray(scenes)) {
    throw new Error("Question and scenes are required to build a video plan.");
  }

  const byId = new Map(scenes.map((scene) => [scene.id, scene]));
  const missing = SCENE_ORDER.filter((id) => !byId.has(id));
  if (missing.length) throw new Error(`Missing scenes: ${missing.join(", ")}`);

  return {
    schema_version: "1.0",
    kind: "medical-ai-teacher-video",
    aspect_ratio: "16:9",
    language_tracks: ["en", "ar"],
    source: {
      file: question.source || null,
      page: question.source_page || null,
      question_id: question.id || null
    },
    answer_status: question.source_indicated_answer ? "source-confirmed" : "source-answer-missing",
    scenes: SCENE_ORDER.map((id, index) => {
      const scene = byId.get(id);
      return {
        index: index + 1,
        id,
        duration_seconds: DEFAULT_DURATION[id],
        shot_style: SHOT_STYLE[id],
        visual_direction: VISUAL_ROLE[id],
        on_screen_text: scene.visual,
        dialogue: dialogueText(scene),
        captions: scene.dialogue.flatMap((line) => line.parts.map((part) => ({
          language: part.type === "ar" ? "ar" : "en",
          speaker: line.name,
          text: textOf(part)
        })))
      };
    }),
    total_duration_seconds: SCENE_ORDER.reduce((sum, id) => sum + DEFAULT_DURATION[id], 0)
  };
}
