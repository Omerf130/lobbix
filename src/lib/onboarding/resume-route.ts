import type { Href } from 'expo-router';

import { loadLocalProfile } from '@/lib/profile/profile-storage';

/** Next route after app boot or auth when local profile exists. */
export async function getPostBootNavigationHref(): Promise<Href | null> {
  const profile = await loadLocalProfile();
  if (!profile) return null;

  if (!profile.onboarding.profileCompleted) {
    return '/onboarding/profile' as Href;
  }

  if (!profile.onboarding.avatarStepCompleted) {
    return '/onboarding/avatar' as Href;
  }

  if (!profile.onboarding.onboardingCompleted) {
    return '/onboarding/complete' as Href;
  }

  return '/home' as Href;
}

/** @deprecated Use {@link getPostBootNavigationHref}. */
export async function getResumeOnboardingHref(): Promise<Href | null> {
  const profile = await loadLocalProfile();
  if (!profile) return null;

  if (!profile.onboarding.profileCompleted) {
    return '/onboarding/profile' as Href;
  }

  if (!profile.onboarding.avatarStepCompleted) {
    return '/onboarding/avatar' as Href;
  }

  if (!profile.onboarding.onboardingCompleted) {
    return '/onboarding/complete' as Href;
  }

  return null;
}
