const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrorCode = 'required' | 'invalidEmail' | 'passwordTooShort' | 'passwordMismatch';

export const AUTH_PASSWORD_MIN_LENGTH = 8;
export const AUTH_LOGIN_PASSWORD_MIN_LENGTH = 6;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const normalized = normalizeEmail(value);
  return normalized.length > 0 && EMAIL_PATTERN.test(normalized);
}

export function validateEmailField(value: string): FieldErrorCode | null {
  if (!value.trim()) {
    return 'required';
  }
  if (!isValidEmail(value)) {
    return 'invalidEmail';
  }
  return null;
}

export function validatePasswordField(value: string, minLength: number): FieldErrorCode | null {
  if (!value) {
    return 'required';
  }
  if (value.length < minLength) {
    return 'passwordTooShort';
  }
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): FieldErrorCode | null {
  if (!confirm) {
    return 'required';
  }
  if (password !== confirm) {
    return 'passwordMismatch';
  }
  return null;
}
