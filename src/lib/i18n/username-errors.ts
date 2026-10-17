import type { TranslationKeys } from '@/i18n/locales/he';
import type { UsernameErrorCode } from '@/lib/validation/username';

export function usernameErrorMessage(strings: TranslationKeys, code: UsernameErrorCode): string {
  switch (code) {
    case 'required':
      return strings.usernameRequired;
    case 'tooShort':
      return strings.usernameTooShort;
    case 'tooLong':
      return strings.usernameTooLong;
    case 'invalidFormat':
      return strings.usernameInvalidFormat;
    default:
      return strings.fieldRequired;
  }
}
