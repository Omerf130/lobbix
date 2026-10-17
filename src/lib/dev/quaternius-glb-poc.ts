import quaterniusGlb from '@/assets/dev/glb-poc/quaternius-ual-test.glb';

/** Metro asset module for the Quaternius UAL PoC GLB (CC0). */
export const QUATERNIUS_GLB_POC: number = quaterniusGlb;

/** Clips verified present in `quaternius-ual-test.glb` (Godot Standard export). */
export const QUATERNIUS_GLB_POC_CLIP_NAMES = [
  'A_TPose',
  'Crouch_Fwd_Loop',
  'Crouch_Idle_Loop',
  'Dance_Loop',
  'Death01',
  'Driving_Loop',
  'Fixing_Kneeling',
  'Hit_Chest',
  'Hit_Head',
  'Idle_Loop',
  'Idle_Talking_Loop',
  'Idle_Torch_Loop',
  'Interact',
  'Jog_Fwd_Loop',
  'Jump_Land',
  'Jump_Loop',
  'Jump_Start',
  'PickUp_Table',
  'Pistol_Aim_Down',
  'Pistol_Aim_Neutral',
  'Pistol_Aim_Up',
  'Pistol_Idle_Loop',
  'Pistol_Reload',
  'Pistol_Shoot',
  'Punch_Cross',
  'Punch_Enter',
  'Punch_Jab',
  'Push_Loop',
  'Roll',
  'Roll_RM',
  'Sitting_Enter',
  'Sitting_Exit',
  'Sitting_Idle_Loop',
  'Sitting_Talking_Loop',
  'Spell_Simple_Enter',
  'Spell_Simple_Exit',
  'Spell_Simple_Idle_Loop',
  'Spell_Simple_Shoot',
  'Sprint_Loop',
  'Swim_Fwd_Loop',
  'Swim_Idle_Loop',
  'Sword_Attack',
  'Sword_Attack_RM',
  'Sword_Idle',
  'Walk_Formal_Loop',
  'Walk_Loop',
] as const;

export const GLB_POC_IDLE_CLIP = 'Idle_Loop' as const;
export const GLB_POC_WALK_CLIP = 'Walk_Loop' as const;

/** Skeleton summary from the source glTF (single skinned mesh). */
export const GLB_POC_SKELETON_SUMMARY = {
  skinnedMeshNodeName: 'Mannequin',
  jointCount: 53,
  animationClipCount: 46,
} as const;

export type GlbPocAnimMode = 'idle' | 'walk';

export function glbPocClipForMode(mode: GlbPocAnimMode): string {
  return mode === 'walk' ? GLB_POC_WALK_CLIP : GLB_POC_IDLE_CLIP;
}
