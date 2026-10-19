import type { AvatarCustomization } from '@/lib/profile/avatar-customization';
import type { AvatarId } from '@/lib/profile/avatar-catalog';

export type OnboardingProgress = {
  /** 1 = profile, 2 = avatar (games step deferred — see gamesStepCompleted legacy flag) */
  currentStep: 1 | 2 | 3;
  profileCompleted: boolean;
  avatarStepCompleted: boolean;
  /** Legacy games placeholder; set true when avatar confirmed (flow bypass). */
  gamesStepCompleted: boolean;
  /** User reached post-avatar completion screen (ready for future lobby). */
  onboardingCompleted: boolean;
};

export type LocalUserProfile = {
  username: string;
  displayName: string | null;
  avatarId?: AvatarId;
  avatarCustomization?: AvatarCustomization;
  onboarding: OnboardingProgress;
  updatedAt: string;
};

export const INITIAL_ONBOARDING_PROGRESS: OnboardingProgress = {
  currentStep: 1,
  profileCompleted: false,
  avatarStepCompleted: false,
  gamesStepCompleted: false,
  onboardingCompleted: false,
};
