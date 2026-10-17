import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_AVATAR_CUSTOMIZATION,
  normalizeAvatarCustomization,
  type AvatarCustomization,
} from '@/lib/profile/avatar-customization';
import {
  INITIAL_ONBOARDING_PROGRESS,
  type LocalUserProfile,
  type OnboardingProgress,
} from '@/lib/profile/types';

const STORAGE_KEY = '@lobbix/local-profile/v1';

function normalizeOnboarding(raw: OnboardingProgress): OnboardingProgress {
  return {
    currentStep: raw.currentStep ?? 1,
    profileCompleted: Boolean(raw.profileCompleted),
    avatarStepCompleted: Boolean(raw.avatarStepCompleted),
    gamesStepCompleted: Boolean(raw.gamesStepCompleted),
  };
}

function parseProfile(raw: string): LocalUserProfile | null {
  try {
    const parsed = JSON.parse(raw) as LocalUserProfile;
    if (typeof parsed.username !== 'string' || !parsed.onboarding) {
      return null;
    }
    return {
      ...parsed,
      avatarCustomization: normalizeAvatarCustomization(parsed.avatarCustomization),
      onboarding: normalizeOnboarding(parsed.onboarding),
    };
  } catch {
    return null;
  }
}

/** Load persisted profile + onboarding (no passwords). */
export async function loadLocalProfile(): Promise<LocalUserProfile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return parseProfile(raw);
}

export async function saveLocalProfile(profile: LocalUserProfile): Promise<void> {
  const payload: LocalUserProfile = {
    ...profile,
    avatarCustomization: normalizeAvatarCustomization(
      profile.avatarCustomization ?? DEFAULT_AVATAR_CUSTOMIZATION,
    ),
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/** Marks onboarding in progress after mock registration (no credentials stored). */
export async function markOnboardingStarted(): Promise<void> {
  const existing = await loadLocalProfile();
  if (existing?.onboarding.profileCompleted) return;
  if (existing) return;

  await saveLocalProfile({
    username: '',
    displayName: null,
    avatarCustomization: DEFAULT_AVATAR_CUSTOMIZATION,
    onboarding: { ...INITIAL_ONBOARDING_PROGRESS },
    updatedAt: new Date().toISOString(),
  });
}

export async function completeProfileStep(
  username: string,
  displayName: string | null,
): Promise<LocalUserProfile> {
  const existing = await loadLocalProfile();
  const next: LocalUserProfile = {
    username,
    displayName,
    avatarCustomization: normalizeAvatarCustomization(existing?.avatarCustomization),
    onboarding: {
      currentStep: 2,
      profileCompleted: true,
      avatarStepCompleted: false,
      gamesStepCompleted: false,
    },
    updatedAt: new Date().toISOString(),
  };
  await saveLocalProfile(next);
  return next;
}

export async function saveAvatarCustomizationDraft(
  customization: AvatarCustomization,
): Promise<void> {
  const existing = await loadLocalProfile();
  if (!existing) return;
  await saveLocalProfile({
    ...existing,
    avatarCustomization: customization,
  });
}

export async function completeAvatarStep(
  customization: AvatarCustomization,
): Promise<LocalUserProfile> {
  const existing = await loadLocalProfile();
  if (!existing) {
    throw new Error('Profile missing');
  }
  const next: LocalUserProfile = {
    ...existing,
    avatarCustomization: normalizeAvatarCustomization(customization),
    onboarding: {
      currentStep: 3,
      profileCompleted: true,
      avatarStepCompleted: true,
      gamesStepCompleted: false,
    },
    updatedAt: new Date().toISOString(),
  };
  await saveLocalProfile(next);
  return next;
}

export async function updateOnboardingProgress(progress: OnboardingProgress): Promise<void> {
  const existing = await loadLocalProfile();
  if (!existing) return;
  await saveLocalProfile({ ...existing, onboarding: normalizeOnboarding(progress) });
}
