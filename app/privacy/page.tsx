import Link from "next/link";

export const metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של אתר ניסן סיני טכנולוגיות.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">
        חזרה לאתר <span aria-hidden="true">←</span>
      </Link>
      <article>
        <span className="section-kicker">פרטיות</span>
        <h1>מדיניות פרטיות</h1>
        <p className="legal-updated">עודכן לאחרונה: אוגוסט 2026</p>

        <section>
          <h2>איזה מידע נאסף?</h2>
          <p>
            כאשר משאירים פרטים בטופס יצירת הקשר, נשמרים הפרטים שנמסרו מרצון:
            שם, שם עסק, טלפון, אימייל, סוג השירות ותוכן הפנייה.
          </p>
        </section>

        <section>
          <h2>למה המידע משמש?</h2>
          <p>
            המידע משמש רק לצורך חזרה לפונה, בירור הצורך ומתן מידע או הצעה
            הקשורים לשירות שהתבקש. הפרטים אינם נמכרים לצדדים שלישיים.
          </p>
        </section>

        <section>
          <h2>שמירת המידע</h2>
          <p>
            הפניות נשמרות במערכת מאובטחת ונגישות רק לצורך טיפול בפנייה וניהול
            הקשר העסקי. ניתן לבקש לעיין בפרטים, לעדכן אותם או למחוק אותם.
          </p>
        </section>

        <section>
          <h2>יצירת קשר בנושא פרטיות</h2>
          <p>
            לכל שאלה או בקשה בנוגע למידע אפשר לפנות אליי בכתובת
            {" "}
            <a href="mailto:nisan.sinai5@gmail.com">nisan.sinai5@gmail.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
