# Multi-view identity to Ultraman action sample

## Result

- Asset: `web/assets/real-tests/multi-view-identity-to-ultraman-action-sample-v1.png`
- Identity source: `web/assets/real-tests/identity-reference-input-board-sample-v1.png`
- Generation mode: built-in image generation with one multi-view fictional-child board and three official character references
- Scope: methodology demonstration only. The child is fictional and does not represent the user's child.

## What this validates

Compared with a single oblique photograph, a consistent front/45-degree/profile/full-body identity board gives the generator more complete facial geometry and body-proportion evidence. The action output retains the fictional child's short hair, face shape, age, blue shirt, gray trousers, and white shoes while changing the pose to a forward run.

## Final prompt

```text
Use case: identity-preserve
Asset type: 9:16 portrait dynamic keyframe demonstrating a multi-view identity-reference workflow
Input images:
- Image 1 is a four-view identity board for one entirely fictional child. Treat all four panels as the same identity. Preserve exactly his face geometry, short black haircut and hairline, eyes, nose, cheeks, mouth, jaw, ears, young age, body proportions, plain blue T-shirt, gray trousers and white sneakers.
- Image 2 is the official BLUE Ultraman Blu Aqua appearance reference. Preserve the exact blue-black-silver helmet, chest armor, color timer and body pattern.
- Image 3 is the official RED Ultraman Rosso Flame appearance reference. Preserve the exact flame helmet, red-black-silver chest armor, color timer and body pattern.
- Image 4 is the official orange-and-silver Ultrawoman Grigio appearance reference. Preserve the exact helmet, face, shoulder, chest and body pattern.
Primary request: create an energetic family-companionship moment using the same fictional child from Image 1. The child runs joyfully toward the camera at the center, holding Rosso's hand on one side and Blu's hand on the other. Grigio runs half a step behind, leaning forward protectively and playfully to join the family race. The three heroes interact with the child rather than posing for the viewer.
Scene/backdrop: broad riverside park path at golden hour, sunlit trees, warm distant city, a few leaves in the air, safe open environment, no crowd
Style/medium: cinematic live-action tokusatsu family-adventure still, photoreal fictional child, authentic practical television suits guided by Images 2–4, believable material texture and contact shadows
Composition/framing: low child-eye-level tracking camera moving backward; portrait 9:16; child centered and emotionally dominant; full running body and face visible; heroes arranged with clean distinct silhouettes; visible forward momentum; slight motion blur only in background and feet; face remains sharp
Lighting/mood: bright golden rim light with soft frontal fill, active, free, reassuring, affectionate, adventurous everyday companionship rather than combat
Critical child invariants: use the exact same fictional child identity from every panel of Image 1; do not redesign, beautify, age up or change ethnicity; preserve haircut, blue shirt, gray trousers and white sneakers; natural small smile, not an exaggerated open-mouth expression
Critical hero invariants: preserve the supplied official suit designs, colors, helmets and chest patterns; exactly Rosso, Blu and Grigio; no hybrid designs
Constraints: one fictional child only; exactly three heroes; safe natural hand contact; no text; no watermark
Avoid: a child resembling the real photo supplied earlier in the conversation, identity drift, generic child, rounder face, enlarged eyes, different haircut or outfit, static pose, seated scene, everyone staring at camera, extra limbs, fused hands, extra people, duplicate heroes, monsters, weapons, explosions, destroyed city, giant scale, toys, mascot costumes, papercraft, anime
```

## Next production gate

For the real child, recreate the same four-view board from actual photographs. Do not ask the image model to invent the missing views. Approve one identity-locked action frame before sending it to a cinematic image-to-video model.
