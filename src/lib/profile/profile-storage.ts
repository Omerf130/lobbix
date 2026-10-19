import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_AVATAR_ID, type AvatarId } from '@/lib/profile/avatar-catalog';
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

export const LOCAL_PROFILE_STORAGE_KEY = '@lobbix/local-profile/v1';

function normalizeOnboarding(raw: OnboardingProgress): OnboardingProgress {
  return {
    currentStep: raw.currentStep ?? 1,
    profileCompleted: Boolean(raw.profileCompleted),
    avatarStepCompleted: Boolean(raw.avatarStepCompleted),
    gamesStepCompleted: Boolean(raw.gamesStepCompleted),
    onboardingCompleted: Boolean(raw.onboardingCompleted),
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
  const raw = await AsyncStorage.getItem(LOCAL_PROFILE_STORAGE_KEY);
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
  await AsyncStorage.setItem(LOCAL_PROFILE_STORAGE_KEY, JSON.stringify(payload));
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
      onboardingCompleted: false,
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

/** Confirms real GLB avatar selection (single male Chibi for 3B.6). */
export async function completeAvatarSelection(avatarId: AvatarId): Promise<LocalUserProfile> {
  const existing = await loadLocalProfile();
  if (!existing) {
    throw new Error('Profile missing');
  }
  const next: LocalUserProfile = {
    ...existing,
    avatarId,
    onboarding: {
      currentStep: 2,
      profileCompleted: true,
      avatarStepCompleted: true,
      gamesStepCompleted: true,
      onboardingCompleted: false,
    },
    updatedAt: new Date().toISOString(),
  };
  await saveLocalProfile(next);
  return next;
}

/** @deprecated Procedural customization — kept for dev/tests referencing old flow. */
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
    avatarId: DEFAULT_AVATAR_ID,
    onboarding: {
      currentStep: 2,
      profileCompleted: true,
      avatarStepCompleted: true,
      gamesStepCompleted: true,
      onboardingCompleted: false,
    },
    updatedAt: new Date().toISOString(),
  };
  await saveLocalProfile(next);
  return next;
}

export async function completeOnboardingFlow(): Promise<LocalUserProfile> {
  const existing = await loadLocalProfile();
  if (!existing) {
    throw new Error('Profile missing');
  }
  const next: LocalUserProfile = {
    ...existing,
    onboarding: {
      ...normalizeOnboarding(existing.onboarding),
      onboardingCompleted: true,
      gamesStepCompleted: true,
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
