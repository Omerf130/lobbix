# LOBBIX

אפליקציית מובייל חברתית לגיימרים (עברית ו-RTL) — React Native, Expo ו-TypeScript.

## דרישות

- Node.js 20+ (נבדק עם Node 22)
- npm
- [Expo Go](https://expo.dev/go) על מכשיר Android או iPhone

## התקנה

```bash
npm install
```

## הרצה

מתוך תיקיית הפרויקט:

```bash
npx expo start
```

- סריקת QR עם **Expo Go** (Android: מתוך האפליקציה; iOS: מצלמת המערכת).
- המחשב והטלפון צריכים להיות על **אותה רשת Wi‑Fi**.
- אם החיבור נכשל, נסו `npx expo start --tunnel` (איטי יותר).

## בדיקות

```bash
npx tsc --noEmit
npx expo lint
```

## מבנה (תמצית)

- `src/app/` — מסכים (Expo Router)
- `src/constants/theme.ts` — טוקני עיצוב
- `src/i18n/` — מחרוזות עברית
- `src/lib/rtl.ts` — הגדרת RTL

## Checkpoint 1

מסך ברוכים הבאים בלבד — ללא auth, backend או 3D.
