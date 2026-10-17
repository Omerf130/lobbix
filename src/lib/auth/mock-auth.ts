import {
  AUTH_LOGIN_PASSWORD_MIN_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  isValidEmail,
  normalizeEmail,
} from '@/lib/validation/auth-form';

export type MockAuthFailureCode =
  | 'invalidCredentials'
  | 'emailTaken'
  | 'networkSimulated';

export type MockAuthResult =
  | { ok: true }
  | { ok: false; code: MockAuthFailureCode };

const MOCK_LATENCY_MS = 750;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Replace with real API client in a future checkpoint. */
export async function mockLogin(email: string, password: string): Promise<MockAuthResult> {
  await delay(MOCK_LATENCY_MS);

  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized) || password.length < AUTH_LOGIN_PASSWORD_MIN_LENGTH) {
    return { ok: false, code: 'invalidCredentials' };
  }

  return { ok: true };
}

/** Replace with real registration service in a future checkpoint. */
export async function mockRegister(email: string, password: string): Promise<MockAuthResult> {
  await delay(MOCK_LATENCY_MS);

  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized) || password.length < AUTH_PASSWORD_MIN_LENGTH) {
    return { ok: false, code: 'invalidCredentials' };
  }

  if (normalized === 'taken@lobbix.test') {
    return { ok: false, code: 'emailTaken' };
  }

  return { ok: true };
}
