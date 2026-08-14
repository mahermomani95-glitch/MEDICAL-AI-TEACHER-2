# Production data layer

The production contract turns every MCQ into six bilingual teaching scenes:

1. Question
2. Answer proposal
3. Clinical reasoning
4. Distractors
5. Exam trap
6. Take-home message

The source question and options remain authoritative. Teaching commentary must not invent or silently alter source facts.

Validation:

```bash
node data/validate-production-config.mjs
node data/production-config.test.mjs
```
