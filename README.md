# ניסן סיני טכנולוגיות

[![CI](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions/workflows/ci.yml)

[אתר Production](https://nisan-sinai-technologies.vercel.app) · [GitHub Actions](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions)

אתר תדמית בעברית וב־RTL עבור ניסן סיני טכנולוגיות: אתרים, מערכות CRM ו־ERP,
אוטומציות ופיתוח Web בהתאמה אישית לעסקים קטנים ובינוניים.

## טכנולוגיות

- Next.js 16 ו־React 19
- TypeScript
- Supabase לטופס הפניות
- Vinext / Sites לפריסת ChatGPT Sites
- Vercel לפריסת ה־Next.js הראשית
- Vitest ו־Playwright לבדיקות

## הרצה מקומית

דרישות: Node.js בגרסה `22.13.0` ומעלה.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

משתני הסביבה הנדרשים:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

יש להשתמש רק במפתח publishable. אין צורך ואין להגדיר `service_role` או מפתח
secret עבור טופס הפניות.

## פקודות איכות

```bash
npm run audit:prod      # בדיקת חולשות production
npm run lint            # ESLint
npm run type-check      # TypeScript ללא emit
npm run test:coverage   # בדיקות יחידה וכיסוי
npm run build:vercel    # build של Next.js עבור Vercel
npm run build:sites     # build מאומת עבור Sites
npm run test:rendered   # בדיקת ארטיפקט Sites
npm run test:e2e        # Playwright בדסקטופ, מובייל ונגישות
npm run qa              # כל הבדיקות ברצף
```

GitHub Actions מריץ את אותם שערי איכות בכל push ל־`main` או `dev` ובכל Pull
Request. דוח Playwright נשמר כ־artifact גם כאשר בדיקת E2E נכשלת.

## Supabase

הסכמה נמצאת תחת `supabase/migrations`. הטבלה `public.contact_leads` מוגנת ב־RLS:

- לתפקידים הציבוריים יש הרשאת `INSERT` רק לעמודות הטופס.
- אין הרשאות `SELECT`, `UPDATE` או `DELETE` לציבור.
- מדיניות ה־RLS מאפשרת רק פניות במצב `new` וממקור האתר.
- ה־API המקומי בודק גודל payload, סוג תוכן, honeypot, אורכים ופורמטים לפני כתיבה.

## פריסה

- Vercel משתמש ב־`vercel.json` ובפקודה `npm run build:vercel`.
- Vercel Git Integration מפרסם אוטומטית כל מיזוג ל־`main` ל־Production.
- Sites משתמש ב־`npm run build:sites` ובקובץ `.openai/hosting.json` המקומי.
- את משתני Supabase מגדירים בממשק הסביבה של כל פלטפורמה ולא בקוד או ב־Git.
