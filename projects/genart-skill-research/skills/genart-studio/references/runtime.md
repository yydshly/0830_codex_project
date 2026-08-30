# Runtime and verification

## Dependencies

Install Playwright in the project or workspace that invokes the skill scripts:

```powershell
npm i -D playwright
npx playwright install chromium
```

The project-local scripts resolve Playwright from the current workspace and work with Windows and POSIX path separators.

## Recommended order

1. `scan.mjs` finds likely nondeterministic, remote-asset, font, locale, or unstable-iteration code. It is a lead generator, not a proof.
2. `check.mjs` runs repeatability, distinctness, A-B-A state contamination, and feature stability tests.
3. `render.mjs --hash` produces one PNG for direct visual inspection.
4. `render.mjs --grid` reveals edition-level repetition and failed seeds.
5. Render the same hash at several sizes when resolution independence matters.
6. `render.mjs --census` measures observed feature values. Compare the output with the intended table; the script does not infer that table.
7. `render.mjs --batch` exports individual high-resolution files.

## Scope of evidence

- Exact pixel hashes support same Chromium, same launch flags, same device scale, and same machine/GPU mode.
- A different browser should be tested for crashes and feature stability, not compared byte-for-byte with Chromium.
- WebGL requires `preserveDrawingBuffer: true` for pixel extraction.
- A static scan cannot see dynamically generated code or prove that a flagged call affects the artwork.
- A sample census estimates a distribution; it does not prove every threshold or rare value is reachable.

## Starter

`scaffold.mjs` copies a small Canvas starter that already implements the local verification contract. It refuses to write into a non-empty directory. The starter is a beginning for original work, not a visual style template.
