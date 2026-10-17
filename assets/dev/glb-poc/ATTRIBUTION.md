# GLB PoC test asset (Checkpoint 3B.4)

This folder contains a **temporary** rigged character used only for technical validation in `/dev/glb-test`. It is **not** the LOBBIX production avatar.

## Model

- **File:** `quaternius-ual-test.glb` (~3 MB)
- **Origin:** Quaternius — *Universal Animation Library* (free standard portion), mirrored with CC0 license text in `QUATERNIUS-ANIMATION-LIBRARY-LICENSE.txt`.
- **Source mirror:** https://github.com/J-Ponzo/gltf-universal-animation-library  
- **Author:** [Quaternius](https://quaternius.com) — https://quaternius.itch.io/universal-animation-library  
- **License:** **CC0 1.0 Universal** (public domain). See `QUATERNIUS-ANIMATION-LIBRARY-LICENSE.txt`.

The `.glb` was produced locally by embedding the mirror’s `AnimationLibrary_Godot_Standard.gltf` + `.bin` into a single GLB (no Draco/KTX2/meshopt).

## Attribution (recommended, not legally required for CC0)

> Character mesh and animations from Quaternius Universal Animation Library (CC0).

## PoC clips used in app

- `Idle_Loop`
- `Walk_Loop`

See `src/lib/dev/quaternius-glb-poc.ts` for the full list of animation names detected in this file.
