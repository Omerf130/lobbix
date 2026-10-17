import type { AvatarCustomization } from '@/lib/profile/avatar-customization';

export type OnboardingProgress = {
  /** 1 = profile, 2 = avatar, 3 = games placeholder */
  currentStep: 1 | 2 | 3;
  profileCompleted: boolean;
  avatarStepCompleted: boolean;
  gamesStepCompleted: boolean;
};

export type LocalUserProfile = {
  username: string;
  displayName: string | null;
  avatarCustomization?: AvatarCustomization;
  onboarding: OnboardingProgress;
  updatedAt: string;
};

export const INITIAL_ONBOARDING_PROGRESS: OnboardingProgress = {
  currentStep: 1,
  profileCompleted: false,
  avatarStepCompleted: false,
  gamesStepCompleted: false,
};
