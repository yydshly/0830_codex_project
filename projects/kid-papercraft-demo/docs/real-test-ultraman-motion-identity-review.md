# Ultraman R/B motion and identity review

## Review result

- Asset: `web/assets/real-tests/ultraman-rb-running-motion-composition-test-v1.png`
- Generation mode: built-in image generation/editing
- Motion composition: PASS — forward running, hand-holding, protective group movement and tracking-camera framing are usable.
- Child identity: NOT APPROVED — the generated face still drifts from the single supplied oblique photo.
- Video status: DO NOT ANIMATE AS FINAL. Animating an identity-drifted keyframe would amplify the error.

## Why identity drift remains

The supplied image is a single oblique view with the child's head tilted and one hand touching the ear. A new full-body running pose requires the model to infer unseen front-facing facial geometry. Text constraints can reduce drift but cannot reconstruct missing identity views reliably.

## Minimum identity reference set for the next pass

1. Front-facing head-and-shoulders photo in natural light, neutral expression.
2. 45-degree head-and-shoulders photo.
3. Full-body standing photo in the intended outfit.
4. Optional 5–10 second walking or turning clip for motion and body-proportion reference.

All photos should be recent, unfiltered, and free of face-obscuring hands, hats, masks, or strong colored lighting.

## Final action-frame prompt

```text
Use case: identity-preserve
Asset type: 9:16 portrait high-motion first frame for an image-to-video sequence
Input images:
- Image 1 is the real child's identity anchor and the highest-priority reference. Preserve the child's exact recognizable facial geometry: same forehead and hairline, very short black hair, eyebrow shape, narrow eyes, nose, cheek shape, mouth, jawline, ears, skin tone, young age, and East Asian identity. Preserve the white New Generation Ultraman T-shirt and loose blue jeans. Do not beautify, idealize, age up, round the face, enlarge the eyes, or substitute a different child.
- Image 2 is the official BLUE Ultraman Blu Aqua design reference; preserve its exact helmet, blue-black-silver chest armor, body pattern and color timer.
- Image 3 is the official RED Ultraman Rosso Flame design reference; preserve its exact flame helmet, red-black-silver chest armor, body pattern and color timer.
- Image 4 is the official orange-and-silver Ultrawoman Grigio design reference; preserve its exact helmet, face, chest, shoulder and body pattern.
Primary request: transform the setting and body action while keeping the real child's identity recognizable. Create a lively family-companionship action moment: the child runs joyfully toward the camera between Ultraman Rosso Flame and Ultraman Blu Aqua, holding one hand with each hero. Ultrawoman Grigio runs half a step behind at the child's side, leaning forward protectively and playfully as if joining a family race. All three heroes look down toward the child or toward the direction of travel, communicating active companionship rather than posing.
Scene/backdrop: a broad sunlit riverside park path during golden hour, trees and warm city lights receding behind them, a few floating leaves, open safe environment, no crowd
Style/medium: cinematic live-action tokusatsu family adventure still, photoreal child, authentic practical television suits from the references, real fabric and metallic suit textures, believable scale and contact shadows
Composition/framing: low eye-level tracking camera moving backward in front of the group; portrait 9:16; child is centered and closest emotional focal point; child's face unobstructed and sharply readable; running legs and swinging arms visible; exactly three distinct heroes arranged around him; strong forward momentum; slight motion blur only in the distant background and feet, never on the child's face
Lighting/mood: bright golden backlight and soft facial fill, energetic, free, secure, affectionate, adventurous everyday companionship; not a battle
Critical identity rule: regenerate the minimum necessary. Keep the face from Image 1 as faithfully as possible; no new child face design. Preserve age, proportions, hair, ethnicity, T-shirt and jeans. If pose adaptation is necessary, adapt only body posture and expression subtly, not identity.
Critical hero rule: faithfully reuse the supplied official designs without hybridizing or redesigning helmets and chest armor.
Constraints: one child only; exactly three heroes; child safely holding hands; no text; no watermark; no commercial advertising layout
Avoid: seated or static group portrait, everyone staring at camera, generic Ultraman substitutes, wrong suit colors, duplicate heroes, fused hands, extra fingers, blocked child face, adult-looking child, doll-like skin, oversized eyes, different haircut, different shirt, battle poses, weapons, monsters, explosions, destroyed city, giant scale, papercraft, anime, toys, mascot costumes, extra people
```

## Target video motion prompt

Use only after child identity is approved in the first frame.

```text
Five-second portrait 9:16 cinematic tracking shot. Preserve the exact child identity, clothing, age, and all three canonical Ultraman R/B suit designs from the input frame. The camera moves backward smoothly at the child's eye level while the child runs forward holding Rosso's and Blu's hands. Rosso glances down protectively, Blu turns toward the child and gives a gentle encouraging pull, and Grigio accelerates from half a step behind to join the family line. Natural synchronized footfalls, small fabric and suit movement, subtle bouncing sunlight through trees, a few leaves crossing frame. Keep the child's face sharp, stable and unchanged in every frame. No face morphing, no character swapping, no extra limbs, no sudden speed changes, no fighting, no explosions, no dialogue, no text. End with the group still moving forward, not freezing into a pose.
```

## Current video-tool assessment

The connected HeyGen image animation path is optimized for a single talking person and lip sync. It is not suitable for this multi-character running shot. Use a first-frame-constrained cinematic image-to-video model such as Runway, Kling, Veo, or Seedance after identity approval.
