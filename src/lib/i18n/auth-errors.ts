import type { TranslationKeys } from '@/i18n/locales/he';
import type { MockAuthFailureCode } from '@/lib/auth/mock-auth';
import type { FieldErrorCode } from '@/lib/validation/auth-form';

export function fieldErrorMessage(
  strings: TranslationKeys,
  code: FieldErrorCode,
  minLength?: number,
): string {
  switch (code) {
    case 'required':
      return strings.fieldRequired;
    case 'invalidEmail':
      return strings.fieldInvalidEmail;
    case 'passwordTooShort':
      return strings.fieldPasswordTooShort.replace('{{min}}', String(minLength ?? 8));
    case 'passwordMismatch':
      return strings.fieldPasswordMismatch;
    default:
      return strings.fieldRequired;
  }
}

export function mockAuthErrorMessage(
  strings: TranslationKeys,
  code: MockAuthFailureCode,
  flow: 'login' | 'register',
): string {
  switch (code) {
    case 'emailTaken':
      return strings.mockEmailTaken;
    case 'invalidCredentials':
      return flow === 'login' ? strings.mockLoginFailed : strings.mockRegisterFailed;
    case 'networkSimulated':
      return strings.mockRegisterFailed;
    default:
      return strings.mockRegisterFailed;
  }
}
