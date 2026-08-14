# Production data layer

`production-config.json` defines the contract used to turn each MCQ into a six-scene bilingual teaching video.

The pipeline is intentionally source-first:

1. Preserve the original question and options.
2. Let Dr. Anas propose the source-indicated answer.
3. Teach the clinical reasoning.
4. Contrast the distractors.
5. Expose the exam trap and trigger.
6. Finish with the memory anchor and final answer.

Run the validator with:

```bash
node data/validate-production-config.mjs
```
