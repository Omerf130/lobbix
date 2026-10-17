const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export type UsernameErrorCode = 'required' | 'invalidFormat' | 'tooShort' | 'tooLong';

export function validateUsername(value: string): UsernameErrorCode | null {
  const trimmed = value.trim();
  if (!trimmed) return 'required';
  if (trimmed.length < 3) return 'tooShort';
  if (trimmed.length > 20) return 'tooLong';
  if (!USERNAME_PATTERN.test(trimmed)) return 'invalidFormat';
  return null;
}

export function isUsernameValid(value: string): boolean {
  return validateUsername(value) === null;
}

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function validateDisplayName(value: string): 'tooLong' | null {
  if (value.trim().length > 40) return 'tooLong';
  return null;
}
