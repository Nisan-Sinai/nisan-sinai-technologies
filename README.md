# ניסן סיני טכנולוגיות

[![CI](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions/workflows/ci.yml)

[אתר Production](https://nisan-sinai-technologies.vercel.app) · [GitHub Actions](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions)

אתר תדמית בעברית וב־RTL עבור ניסן סיני טכנולוגיות: אתרים, מערכות CRM ו־ERP,
אוטומציות ופיתוח Web בהתאמה אישית לעסקים קטנים ובינוניים.

## טכנולוגיות

- Next.js 16 ו־React 19
- TypeScript
- Supabase לטופס הפניות
- עברית ואנגלית, כל שפה עם root layout משלה
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
npm run scan:secrets    # סריקת מפתחות בקבצים במעקב
npm run test:migrations # מיגרציות וחוזה ה־RLS מול Postgres
npm run smoke           # בדיקת סביבה פרוסה
npm run check:data-api  # אימות שהמפתח של Supabase עדיין מתקבל
```

כיסוי הבדיקות נאכף על 100% בכל ארבעת המדדים — שורות, הצהרות, ענפים
ופונקציות. ירידה מתחת לכך מפילה את הבנייה.

GitHub Actions מריץ את אותם שערי איכות בכל push ל־`main` או `dev` ובכל Pull
Request. דוח Playwright נשמר כ־artifact גם כאשר בדיקת E2E נכשלת.

## שפות

האתר מוגש בשתי שפות. עברית יושבת בשורש (`/`, `/privacy`) ואנגלית תחת `/en`
(`/en`, `/en/privacy`). לכל שפה יש root layout נפרד, כך ש־`lang` ו־`dir`
נכונים כבר במסמך עצמו ולא מתוקנים בדיעבד.

כל מחרוזת באתר נמצאת ב־`lib/content.ts` תחת הטיפוס `SiteContent`. שתי השפות
חייבות לספק את אותו טיפוס, ולכן תרגום חסר נכשל בקומפילציה ולא מגיע לאוויר
כשדה ריק. בדיקת יחידה משווה גם את מבנה שני המילונים בזמן ריצה.

`lib/i18n.ts` מחזיק את הכיווניות, את בניית הנתיבים ואת החץ שמצביע לכיוון
הקריאה של השפה.

## Supabase

הסכמה נמצאת תחת `supabase/migrations`. הטבלה `public.contact_leads` מוגנת ב־RLS:

- לתפקידים הציבוריים יש הרשאת `INSERT` רק לעמודות הטופס.
- אין הרשאות `SELECT`, `UPDATE` או `DELETE` לציבור.
- מדיניות ה־RLS מאפשרת רק פניות במצב `new` וממקור האתר.
- ה־API המקומי בודק גודל payload, סוג תוכן, honeypot, אורכים ופורמטים לפני כתיבה.

## תצוגות הפרויקטים

הכרטיסים מציגים צילומים של האתרים החיים, לא איורים שלהם. שניים מהשלושה
חוסמים הטמעה ב־iframe — `arrival-confirmations` שולח גם `x-frame-options:
DENY` וגם `frame-ancestors 'none'`, וזו ההתנהגות הנכונה לאתר עם התחברות — לכן
דפדפן אמיתי מצלם אותם במקום להטמיע אותם.

`scripts/capture-project-shots.mjs` מבצע את הצילום, וה־workflow
`project-shots.yml` מריץ אותו שבועית ובהרצה ידנית ומעדכן את התמונות. אתר
שנכשל בטעינה שומר על הצילום הקודם שלו.

## פרסום ואינדוקס

האתר מוכן לסריקה: `robots.txt` פותח את כל הנתיבים ומצביע על ה־sitemap,
`sitemap.xml` מונה את שני העמודים בשתי השפות עם `hreflang` הדדי, לכל עמוד יש
`canonical` משלו, ו־`googlebot` מקבל `max-image-preview:large` כדי שתמונת
השיתוף תופיע בתוצאות.

נתונים מובנים (JSON-LD) נבנים ב־`lib/structured-data.ts` מאותו מילון תוכן של
העמוד, כך ש־`ProfessionalService` ו־`WebSite` לא יכולים להתפצל מהטקסט שמוצג.

כרטיסי השיתוף הם `public/og.png` ו־`public/og-en.png` בגודל 1200×630.

### מה שנשאר לעשות ידנית

1. **אימות ב־Google Search Console** — הוסיפו את
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` עם הטוקן שגוגל נותן, ופרסו מחדש.
   בלי המשתנה התגית פשוט לא נוצרת.
2. **הגשת ה־sitemap** ב־Search Console: `/sitemap.xml`.
3. **דומיין** — כל הכתובות הקנוניות נגזרות מ־`NEXT_PUBLIC_SITE_URL`. מעבר
   לדומיין קבוע דורש עדכון של המשתנה בלבד.

## פריסה

- Vercel משתמש ב־`vercel.json` ובפקודה `npm run build:vercel`.
- Vercel Git Integration מפרסם אוטומטית כל מיזוג ל־`main` ל־Production.
- Sites משתמש ב־`npm run build:sites` ובקובץ `.openai/hosting.json` המקומי.
- את משתני Supabase מגדירים ב־Vercel עבור Production, Preview ו־Development, ולא בקוד או ב־Git; לאחר שינוי ערכים יש לבצע פריסה חדשה.
