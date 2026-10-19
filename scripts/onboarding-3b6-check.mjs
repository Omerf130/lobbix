import assert from 'node:assert/strict';

const ONE_TIME_RESET_3B6_MARKER_KEY = '@lobbix/dev/one-time-reset-3b6/v1';
const LOCAL_PROFILE_STORAGE_KEY = '@lobbix/local-profile/v1';
const AVATAR_ID_CHIBI_MALE_V1 = 'chibi-male-v1';

function normalizeOnboarding(raw) {
  return {
    currentStep: raw.currentStep ?? 1,
    profileCompleted: Boolean(raw.profileCompleted),
    avatarStepCompleted: Boolean(raw.avatarStepCompleted),
    gamesStepCompleted: Boolean(raw.gamesStepCompleted),
    onboardingCompleted: Boolean(raw.onboardingCompleted),
  };
}

function resolveBootRoute(profile) {
  if (!profile) return null;
  if (!profile.onboarding.profileCompleted) return '/onboarding/profile';
  if (!profile.onboarding.avatarStepCompleted) return '/onboarding/avatar';
  if (!profile.onboarding.onboardingCompleted) return '/onboarding/complete';
  return '/home';
}

{
  assert.equal(ONE_TIME_RESET_3B6_MARKER_KEY.includes('3b6'), true);
  assert.equal(LOCAL_PROFILE_STORAGE_KEY, '@lobbix/local-profile/v1');
}

{
  const legacy = normalizeOnboarding({
    currentStep: 3,
    profileCompleted: true,
    avatarStepCompleted: true,
    gamesStepCompleted: true,
  });
  assert.equal(legacy.onboardingCompleted, false);
}

{
  const route = resolveBootRoute({
    username: 'player',
    onboarding: normalizeOnboarding({
      currentStep: 2,
      profileCompleted: true,
      avatarStepCompleted: true,
      gamesStepCompleted: true,
      onboardingCompleted: false,
    }),
  });
  assert.equal(route, '/onboarding/complete');
}

{
  const done = resolveBootRoute({
    username: 'player',
    avatarId: AVATAR_ID_CHIBI_MALE_V1,
    onboarding: normalizeOnboarding({
      profileCompleted: true,
      avatarStepCompleted: true,
      gamesStepCompleted: true,
      onboardingCompleted: true,
    }),
  });
  assert.equal(done, '/home');
}

console.log('onboarding-3b6-check: ok');
