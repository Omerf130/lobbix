import type { Href } from 'expo-router';

import { loadLocalProfile } from '@/lib/profile/profile-storage';

/** Resume incomplete onboarding after app restart (not authentication). */
export async function getResumeOnboardingHref(): Promise<Href | null> {
  const profile = await loadLocalProfile();
  if (!profile) return null;

  if (!profile.onboarding.profileCompleted) {
    return '/onboarding/profile' as Href;
  }

  if (!profile.onboarding.avatarStepCompleted) {
    return '/onboarding/avatar' as Href;
  }

  if (!profile.onboarding.gamesStepCompleted) {
    return '/onboarding/games-placeholder' as Href;
  }

  return null;
}
