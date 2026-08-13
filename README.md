# ניסן סיני טכנולוגיות

[![CI](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions/workflows/ci.yml)

[אתר Production](https://nisan-sinai-technologies.vercel.app) · [GitHub Actions](https://github.com/Nisan-Sinai/nisan-sinai-technologies/actions)

אתר תדמית דו־לשוני (עברית ב־RTL, אנגלית ב־LTR) עבור ניסן סיני טכנולוגיות:
אתרים, מערכות CRM ו־ERP, אוטומציות ופיתוח Web בהתאמה אישית לעסקים קטנים
ובינוניים.

## טכנולוגיות

| רכיב | בחירה |
| --- | --- |
| Framework | Next.js 16 (App Router) ו־React 19 |
| שפה | TypeScript |
| עיצוב | Tailwind CSS 4 ו־`app/globals.css` |
| נתונים | Supabase (PostgREST) לטופס הפניות |
| בדיקות | Vitest ליחידה, Playwright ל־E2E ולנגישות |
| פריסה | Vercel (ראשי) ו־vinext / Sites (משני) |

## הרצה מקומית

דרישות: Node.js בגרסה `22.13.0` ומעלה.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

### משתני סביבה

| משתנה | חובה | תפקיד |
| --- | --- | --- |
| `SUPABASE_URL` | כן | כתובת הפרויקט ב־Supabase. חייבת להיות HTTPS. |
| `SUPABASE_PUBLISHABLE_KEY` | כן | מפתח ה־publishable בלבד. |
| `NEXT_PUBLIC_SITE_URL` | כן | הבסיס לכתובות הקנוניות, ל־sitemap ול־robots. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | לא | טוקן האימות של Search Console. בלעדיו התגית פשוט לא נוצרת. |

אין להגדיר `service_role` או מפתח secret כלשהו. טופס הפניות לא צריך אותם,
ו־`npm run scan:secrets` נכשל אם מפתח כזה נכנס לקבצים במעקב.

## מבנה הפרויקט

```
app/(he)/          עברית בשורש: /, /privacy, /accessibility — root layout משלה
app/(en)/en/       אנגלית תחת /en — root layout משלה
app/legal-content  מרנדר את שני עמודי המדיניות מאותו טיפוס
app/site-page.tsx  עמוד הבית המשותף, מוזרק תוכן לפי שפה
app/api/leads/     ה־API של טופס הפניות
lib/content.ts     כל מחרוזות האתר, שתי השפות
lib/i18n.ts        כיווניות, נתיבים וחצים לפי שפה
supabase/          מיגרציות ומדיניות RLS
scripts/           בנייה, סריקות ובדיקות סביבה
tests/unit/        Vitest
tests/e2e/         Playwright
```

## שפות ותוכן

עברית יושבת בשורש (`/`, `/privacy`) ואנגלית תחת `/en` (`/en`, `/en/privacy`).
לכל שפה root layout נפרד, כך ש־`lang` ו־`dir` נכונים כבר במסמך עצמו ולא
מתוקנים בדיעבד.

כל מחרוזת נמצאת ב־`lib/content.ts` תחת הטיפוס `SiteContent`. שתי השפות חייבות
לספק את אותו טיפוס, ולכן תרגום חסר נכשל בקומפילציה ולא מגיע לאוויר כשדה ריק.
בדיקת יחידה משווה גם את מבנה שני המילונים בזמן ריצה.

## מחירים והמלצות

המחירים יושבים ב־`content.pricing` ומוצגים כ״החל מ־״, כלומר רצפת מחיר ולא
מחירון סגור. בדיקת יחידה מוודאת שכל שכבה נושאת מספר אמיתי ושהספרות זהות בשתי
השפות — רק המילים סביבן מתורגמות.

ההמלצות יושבות ב־`content.testimonials.items`. הרשימה ריקה בכוונה: הסקשן כולו
לא נכנס ל־DOM כל עוד אין בו ציטוט, כדי שהעמוד לא יציג שבחים שלא ניתנו. להוספת
המלצה יש להוסיף אובייקט זהה בשתי השפות:

```ts
items: [
  { quote: "...", name: "שם הלקוח", role: "התפקיד או שם העסק" },
],
```

בדיקות היחידה יכשלו אם ציטוט ריק או קצר מדי, ואם רשימת השמות אינה זהה בין
עברית לאנגלית.

## טופס הפניות ו־Supabase

הסכמה נמצאת תחת `supabase/migrations`. הטבלה `public.contact_leads` מוגנת ב־RLS:

- לתפקידים הציבוריים יש הרשאת `INSERT` רק לעמודות הטופס.
- אין הרשאות `SELECT`, `UPDATE` או `DELETE` לציבור.
- מדיניות ה־RLS מאפשרת רק פניות במצב `new` וממקור האתר.

`app/api/leads/route.ts` בודק גודל payload, סוג תוכן, honeypot, אורכים
ופורמטים לפני כתיבה, ומחזיר שגיאה גנרית ללקוח בזמן שהסיבה האמיתית נרשמת ללוג.
`npm run test:migrations` מריץ את המיגרציות מול Postgres אמיתי ומוודא שהחוזה
הזה עדיין מתקיים.

## תצוגות הפרויקטים

הכרטיסים מציגים צילומים של האתרים החיים, לא איורים שלהם. שניים מהשלושה חוסמים
הטמעה ב־iframe — `arrival-confirmations` שולח גם `x-frame-options: DENY` וגם
`frame-ancestors 'none'`, וזו ההתנהגות הנכונה לאתר עם התחברות — לכן דפדפן
אמיתי מצלם אותם במקום להטמיע אותם.

`scripts/capture-project-shots.mjs` מבצע את הצילום, וה־workflow
`project-shots.yml` מריץ אותו כל יום שני ובהרצה ידנית ומעדכן את `public/projects/`.
אתר שנכשל בטעינה שומר על הצילום הקודם שלו.

## נגישות ופרטיות

שני עמודי מדיניות מוגשים בשתי השפות ומקושרים מהכותרת התחתונה של **כל** עמוד:
`/accessibility` (הצהרת נגישות) ו־`/privacy` (מדיניות פרטיות). שניהם נבנים
מאותו טיפוס `LegalDocument` ב־`lib/content.ts`, כך שסעיף שקיים בשפה אחת ולא
בשנייה נכשל בקומפילציה.

- **נגישות** — האתר נבנה לת״י 5568 ברמה AA (מבוסס WCAG 2.0). `npm run test:e2e`
  מריץ axe-core על כל שישה העמודים בשלושה גדלי מסך, ובנוסף נבדקים ניווט
  במקלדת, סימון פוקוס, זרימה ב־320px, שינוי מרווחי טקסט וסימון שפה של מילים
  לועזיות בתוך טקסט עברי (WCAG 3.1.2).
- **פרטיות** — נוסח המדיניות נבדק ביחידה מול רשימת הגילויים שחוק הגנת הפרטיות
  ותיקון 13 דורשים: זהות בעל המאגר, התנדבות המסירה, ספקי העיבוד, העברה לחו״ל,
  וזכויות העיון, התיקון והמחיקה. מחיקת סעיף כזה בעריכה מפילה את הבדיקה.

## SEO ואינדוקס

- `robots.txt` פותח את כל הנתיבים ומצביע על ה־sitemap.
- `sitemap.xml` מונה את שני העמודים בשתי השפות עם `hreflang` הדדי.
- לכל עמוד `canonical` משלו, ו־`googlebot` מקבל `max-image-preview:large`.
- נתונים מובנים (JSON-LD) נבנים ב־`lib/structured-data.ts` מאותו מילון תוכן של
  העמוד, כך ש־`ProfessionalService` ו־`WebSite` לא יכולים להתפצל מהטקסט המוצג.
- כרטיסי השיתוף הם `public/og.png` ו־`public/og-en.png` בגודל 1200×630,
  ונבנים מחדש עם `npm run build:og`.

## בדיקות ו־CI

| פקודה | מה היא עושה |
| --- | --- |
| `npm run qa` | כל שערי האיכות ברצף — זו הפקודה להריץ לפני push |
| `npm run scan:secrets` | סריקת מפתחות בקבצים במעקב |
| `npm run audit:prod` | חולשות בתלויות production |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript ללא emit |
| `npm run test:coverage` | בדיקות יחידה וכיסוי |
| `npm run build:vercel` | build של Next.js עבור Vercel |
| `npm run build:sites` | build מאומת עבור Sites |
| `npm run test:rendered` | בדיקת ארטיפקט Sites |
| `npm run test:e2e` | Playwright בדסקטופ, בשני מובייל, ו־axe-core בכל עמוד |
| `npm run test:migrations` | מיגרציות וחוזה ה־RLS מול Postgres |
| `npm run smoke` | סביבה פרוסה: תוכן עמודי המדיניות, הדומיין הקנוני ו־noindex על `/admin` |
| `npm run check:data-api` | אימות שהמפתח של Supabase עדיין מתקבל |

כיסוי הבדיקות נאכף על 100% בכל ארבעת המדדים — שורות, הצהרות, ענפים ופונקציות.
ירידה מתחת לכך מפילה את הבנייה.

### מה רץ ב־GitHub Actions

| Workflow | מתי | מה |
| --- | --- | --- |
| `ci.yml` | כל push ל־`main` או `dev`, וכל Pull Request | ארבע משרות: איכות ובנייה כפולה, Playwright, סריקת מפתחות, מיגרציות ו־RLS |
| `smoke.yml` | כל 6 שעות, ובהרצה ידנית | האתר הפרוס עונה ומפתח ה־Data API עדיין מתקבל |
| `project-shots.yml` | כל יום שני, ובהרצה ידנית | מצלם מחדש את שלושת האתרים ומעדכן את התמונות |
| `dependabot-automerge.yml` | על כל PR של Dependabot | ממתין לכל השערים וממזג לבד patch ו־minor |

## אזור הניהול

`/admin` הוא עמוד `noindex` שקורא פניות מ־Supabase בדפדפן. הרשאת הקריאה נשענת
כולה על טבלת `public.admin_users` ועל הפונקציה `is_admin()`, ולכן
`npm run test:migrations` מוודא גם שמשתמש מחובר אינו יכול לקרוא את רשימת
המנהלים או להוסיף את עצמו אליה, ושמנהל שכובה (`is_active = false`) מפסיק לראות
פניות.

העמוד מוסר את מפתח ה־publishable לדפדפן — זה תפקידו — אבל המשתנה אינו נושא
תחית `NEXT_PUBLIC_`, ולכן `lib/supabase-key.ts` בודק שהערך באמת מפתח publishable
לפני שהוא נשלח. מפתח secret שהודבק בטעות לא יגיע לדפדפן; העמוד פשוט ידווח
שהשירות אינו מוגדר.

## עדכוני תלויות

Dependabot פותח PR-ים בימי שלישי לפי שעון ישראל — חבילות ב־06:00 ופעולות
GitHub ב־06:30, כדי ששני ה־ecosystems לא יעמיסו יחד על CI ועל Vercel.

| מה | מקובץ ל־PR אחד | מיזוג אוטומטי |
| --- | --- | --- |
| production, minor ו־patch | כן | כן |
| development, minor ו־patch | כן | כן |
| GitHub Actions, minor ו־patch | כן | כן |
| כל major | לא, PR נפרד | **לא** — קריאה אנושית |

`dependabot-automerge.yml` ממזג רק כאשר כל ארבע משרות ה־CI וגם סטטוס הפריסה
`Vercel` ירוקים, ורק ב־squash עם אימות ה־SHA, כך שמה שמתמזג הוא בדיוק מה
שנבדק. אם ה־SHA השתנה בין הבדיקה למיזוג — GitHub דוחה את המיזוג.

ה־workflow רץ על `pull_request_target` כדי לקבל טוקן שיכול למזג, ולכן הוא
**לעולם לא מבצע checkout ולא מריץ קוד מתוך ה־PR** — הוא קורא metadata, קורא
תוצאות בדיקות, וקורא ל־API. הקוד עצמו נבדק ב־`ci.yml` תחת טוקן קריאה בלבד.

דוח Playwright נשמר כ־artifact גם כאשר בדיקת E2E נכשלת.

## פריסה

- Vercel משתמש ב־`vercel.json` ובפקודה `npm run build:vercel`.
- Vercel Git Integration מפרסם אוטומטית כל מיזוג ל־`main` ל־Production.
- Sites משתמש ב־`npm run build:sites` ובקובץ `.openai/hosting.json` המקומי.
- את משתני הסביבה מגדירים ב־Vercel עבור Production, Preview ו־Development,
  ולא בקוד או ב־Git. לאחר שינוי ערכים יש לבצע פריסה חדשה כדי שייכנסו לתוקף.

## משימות ידניות

1. **אימות ב־Google Search Console** — להוסיף את
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` ב־Vercel עם הטוקן שגוגל נותן, ולפרוס
   מחדש.
2. **הגשת ה־sitemap** ב־Search Console: `/sitemap.xml`.
3. **דומיין** — כל הכתובות הקנוניות נגזרות מ־`NEXT_PUBLIC_SITE_URL`. מעבר
   לדומיין קבוע דורש עדכון של המשתנה בלבד.
4. **סודות ל־smoke** — `SUPABASE_URL` ו־`SUPABASE_PUBLISHABLE_KEY` כ־secrets
   ב־GitHub, כדי ש־`check:data-api` ירוץ גם בתזמון ולא רק מקומית.
5. **המלצות לקוחות** — לאסוף ציטוט ואישור פרסום מלקוח, ולמלא ב־
   `content.testimonials.items` בשתי השפות. עד אז הסקשן לא מוצג.
6. **ח.פ / ע.מ** — כשיהיה, להוסיף למסמכי הפרטיות והנגישות ולתחתית העמוד.
