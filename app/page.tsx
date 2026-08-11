import ContactForm from "./contact-form";

const capabilities = [
  { label: "אתרים", value: "Web" },
  { label: "מערכות ניהול", value: "CRM" },
  { label: "תהליכים עסקיים", value: "ERP" },
  { label: "אוטומציות", value: "AUTO" },
];

const services = [
  {
    number: "01",
    title: "אתרים וחנויות אונליין",
    description:
      "אתרי תדמית, דפי נחיתה וחנויות מהירות שמציגים את העסק נכון והופכים ביקורים לפניות ומכירות.",
    tags: ["UX/UI", "E-commerce", "SEO"],
  },
  {
    number: "02",
    title: "מערכות CRM",
    description:
      "ניהול לקוחות, לידים, משימות ותהליכי מכירה במערכת אחת שמתאימה בדיוק לאופן שבו העסק שלך עובד.",
    tags: ["Leads", "Customers", "Workflows"],
  },
  {
    number: "03",
    title: "מערכות ERP וניהול",
    description:
      "מלאי, הזמנות, תפעול, דוחות והרשאות — פתרונות שמרכזים את העסק וחוסכים עבודה ידנית.",
    tags: ["Operations", "Reports", "Roles"],
  },
  {
    number: "04",
    title: "אוטומציות ואינטגרציות",
    description:
      "חיבור בין מערכות, API ותהליכים אוטומטיים שמונעים כפילויות, מקצרים זמני עבודה ומפחיתים טעויות.",
    tags: ["API", "Automation", "Integration"],
  },
  {
    number: "05",
    title: "מערכות Web בהתאמה אישית",
    description:
      "פורטלים, דשבורדים וכלים עסקיים שלא נכנסים לתבנית מוכנה — מאופיינים ונבנים סביב הצורך האמיתי.",
    tags: ["Full-stack", "Dashboards", "SaaS"],
  },
  {
    number: "06",
    title: "AI לעסקים",
    description:
      "שילוב בינה מלאכותית במקום שבו היא באמת מועילה: חיפוש חכם, ניתוח מידע ועוזרים לתהליכים עסקיים.",
    tags: ["AI", "Agents", "Data"],
  },
];

const processSteps = [
  {
    number: "01",
    title: "מבינים את העסק",
    text: "שיחה ממוקדת על המטרה, המשתמשים והתהליך העסקי שצריך לשפר.",
  },
  {
    number: "02",
    title: "מתכננים את הפתרון",
    text: "אפיון ברור, מסכים, זרימות משתמש ותכנית עבודה שאפשר לקבל עליה החלטות.",
  },
  {
    number: "03",
    title: "בונים ובודקים",
    text: "פיתוח מדורג, בדיקות אמיתיות והתאמות עד שהכול מרגיש פשוט ועובד חלק.",
  },
  {
    number: "04",
    title: "עולים לאוויר",
    text: "השקה מסודרת, חיבור התשתיות והמשך ליווי כשהמוצר כבר פוגש משתמשים.",
  },
];

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#main-content">
        דילוג לתוכן המרכזי
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="ניסן סיני טכנולוגיות - דף הבית">
          <span className="brand-mark" aria-hidden="true">
            NS<span>.</span>
          </span>
          <span className="brand-copy">
            <strong>ניסן סיני</strong>
            <small>טכנולוגיות</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="ניווט ראשי">
          <a href="#services">שירותים</a>
          <a href="#projects">פרויקטים</a>
          <a href="#process">איך זה עובד</a>
          <a href="#about">אודות</a>
        </nav>

        <a className="header-cta" href="#contact">
          בואו נדבר <span aria-hidden="true">←</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-copy" id="main-content">
          <div className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            פיתוח דיגיטלי מקצה לקצה לעסקים
          </div>

          <h1>
            אני בונה את
            <span>הטכנולוגיה</span>
            שהעסק שלך צריך.
          </h1>

          <p>
            אתרים, מערכות CRM ו־ERP, אוטומציות ופיתוח בהתאמה אישית —
            מרעיון מדויק למוצר מהיר, נגיש ועובד באמת.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              בואו נבנה משהו מעולה
              <span aria-hidden="true">←</span>
            </a>
            <a className="button button-secondary" href="#projects">
              לפרויקטים שלי
              <span aria-hidden="true">←</span>
            </a>
          </div>

          <dl className="hero-proof" aria-label="הדרך שלי לפרויקט מוצלח">
            <div>
              <dt>01</dt>
              <dd>אפיון מדויק</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>פיתוח חכם</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>בדיקות והשקה</dd>
            </div>
          </dl>
        </div>

        <div className="system-visual" aria-label="המחשה של מערכת עסקית מחוברת">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />

          <div className="system-core">
            <span className="core-kicker">CORE</span>
            <strong>העסק שלך</strong>
            <span className="core-status">
              <i aria-hidden="true" /> מערכת פעילה
            </span>
          </div>

          {capabilities.map((capability, index) => (
            <div className={`capability capability-${index + 1}`} key={capability.value}>
              <span>{capability.value}</span>
              <strong>{capability.label}</strong>
            </div>
          ))}

          <div className="signal-card" aria-hidden="true">
            <div className="signal-card-head">
              <span>ביצועים</span>
              <strong>LIVE</strong>
            </div>
            <div className="signal-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>

        <a className="scroll-cue" href="#services" aria-label="המשך לשירותים">
          <span>גלו עוד</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section
        className="services-intro"
        id="services"
        aria-label="השירותים שלי"
        tabIndex={0}
      >
        <span>פתרונות שנבנים סביב העסק שלך</span>
        <strong>WEB</strong>
        <i aria-hidden="true" />
        <strong>CRM</strong>
        <i aria-hidden="true" />
        <strong>ERP</strong>
        <i aria-hidden="true" />
        <strong>AUTOMATION</strong>
      </section>

      <section className="content-section services-section" aria-labelledby="services-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">מה אני בונה</span>
            <h2 id="services-title">טכנולוגיה שמסדרת את העסק.</h2>
          </div>
          <p>
            כל פתרון מתחיל בבעיה עסקית אמיתית — ורק אחר כך בטכנולוגיה.
            המטרה היא מערכת ברורה, מהירה ונוחה שהצוות באמת רוצה לעבוד איתה.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-card-top">
                <span>{service.number}</span>
                <i aria-hidden="true">←</i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul aria-label={`תחומים ב${service.title}`}>
                {service.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section projects-section" id="projects" aria-labelledby="projects-title">
        <div className="section-heading projects-heading">
          <div>
            <span className="section-kicker">פרויקטים נבחרים</span>
            <h2 id="projects-title">מערכות שכבר עובדות בעולם האמיתי.</h2>
          </div>
          <p>
            שלושה מוצרים שונים, עם מכנה משותף אחד: תהליך מורכב שהפך לחוויה
            פשוטה וברורה למשתמש.
          </p>
        </div>

        <div className="projects-list">
          <article className="project-card project-ld">
            <div className="project-copy">
              <div className="project-meta">
                <span>01 / EVENT COMMERCE</span>
                <span>2026</span>
              </div>
              <h3>LD Event Design</h3>
              <p>
                אתר מסחר לעיצוב אירועים עם הרכבת חבילה, סל קניות, הזמנות
                וממשק ניהול מלא לתוכן ולמוצרים.
              </p>
              <ul>
                <li>חוויית רכישה מותאמת למובייל</li>
                <li>ניהול הזמנות ומדיה</li>
                <li>מערכת חבילות דינמית</li>
              </ul>
              <span className="case-study-label">CASE STUDY <i aria-hidden="true">←</i></span>
            </div>
            <div className="project-preview ld-preview" aria-label="הדמיית ממשק LD Event Design">
              <div className="mock-browser">
                <div className="mock-browser-bar"><i /><i /><i /><span>LD EVENT DESIGN</span></div>
                <div className="ld-canvas">
                  <div className="ld-hero-mini">
                    <span>עיצוב אירועים</span>
                    <strong>האירוע שלך.<br />הסטייל שלנו.</strong>
                    <i />
                  </div>
                  <div className="ld-products-mini"><i /><i /><i /></div>
                </div>
              </div>
            </div>
          </article>

          <article className="project-card project-shel">
            <div className="project-copy">
              <div className="project-meta">
                <span>02 / E-COMMERCE</span>
                <span>2026</span>
              </div>
              <h3>Shel‑Yah</h3>
              <p>
                חנות דיגיטלית מודרנית עם קטלוג, חיפוש, עמודי מוצר ותהליך קנייה
                שנבנה כדי להרגיש מהיר, נקי ונוח.
              </p>
              <ul>
                <li>ארכיטקטורת Full‑Stack</li>
                <li>ממשק מסחר רספונסיבי</li>
                <li>ניהול מוצרים ותוכן</li>
              </ul>
              <a className="case-study-label" href="https://shel-yah-web.vercel.app/" target="_blank" rel="noreferrer">
                לאתר הפעיל <i aria-hidden="true">↗</i>
              </a>
            </div>
            <div className="project-preview shel-preview" aria-label="הדמיית ממשק Shel-Yah">
              <div className="mock-browser">
                <div className="mock-browser-bar"><i /><i /><i /><span>SHEL‑YAH</span></div>
                <div className="shel-canvas">
                  <div className="shel-nav-mini"><strong>SHEL‑YAH</strong><span>SHOP · NEW · STORY</span></div>
                  <div className="shel-products-mini"><i /><i /><i /></div>
                </div>
              </div>
            </div>
          </article>

          <article className="project-card project-rsvp">
            <div className="project-copy">
              <div className="project-meta">
                <span>03 / EVENT PLATFORM</span>
                <span>2026</span>
              </div>
              <h3>מערכת אישורי הגעה</h3>
              <p>
                פלטפורמה לניהול אירועים, מוזמנים ואישורי הגעה — כולל קישורים
                אישיים, דשבורד, סינון וסידורי הושבה.
              </p>
              <ul>
                <li>ניהול אירועים ומוזמנים</li>
                <li>קישורי RSVP אישיים</li>
                <li>דשבורד ונתונים בזמן אמת</li>
              </ul>
              <a className="case-study-label" href="https://arrival-confirmations.vercel.app/" target="_blank" rel="noreferrer">
                לאתר הפעיל <i aria-hidden="true">↗</i>
              </a>
            </div>
            <div className="project-preview rsvp-preview" aria-label="הדמיית מערכת אישורי ההגעה">
              <div className="dashboard-mock">
                <div className="dashboard-side"><strong>RSVP</strong><i /><i /><i /><i /></div>
                <div className="dashboard-main">
                  <div className="dashboard-title"><span>ערב טוב, ניסן</span><strong>מרכז ניהול האירוע</strong></div>
                  <div className="dashboard-stats"><i /><i /><i /></div>
                  <div className="dashboard-chart"><span /><span /><span /><span /><span /><span /><span /></div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="content-section process-section" id="process" aria-labelledby="process-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">איך זה עובד</span>
            <h2 id="process-title">מהרעיון למערכת שעובדת.</h2>
          </div>
          <p>
            תהליך שקוף ופרקטי. בכל שלב יודעים מה בונים, למה בונים אותו ומה
            צריך לקרות כדי להתקדם.
          </p>
        </div>

        <ol className="process-grid">
          {processSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <i aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section about-section" id="about" aria-labelledby="about-title">
        <div className="about-visual" aria-hidden="true">
          <div className="code-window">
            <div className="code-window-bar"><i /><i /><i /><span>nisan.ts</span></div>
            <pre><code>{`const solution = {
  understand: "the business",
  design: "the experience",
  build: "the right system",
  verify: "everything"
};

return makeItWork(solution);`}</code></pre>
          </div>
          <span className="about-badge">FULL‑STACK<br />DEVELOPER</span>
        </div>
        <div className="about-copy">
          <span className="section-kicker">מי עומד מאחורי המוצר</span>
          <h2 id="about-title">נעים להכיר,<br />אני ניסן סיני.</h2>
          <p>
            מפתח Full‑Stack שאוהב לקחת רעיון, להבין את הבעיה שמאחוריו ולהפוך
            אותו למוצר דיגיטלי מדויק. אני משלב חשיבה עסקית, חוויית משתמש ופיתוח
            מקצה לקצה — כדי שהתוצאה לא רק תיראה טוב, אלא באמת תעבוד.
          </p>
          <div className="about-values">
            <div><span>01</span><strong>תקשורת ישירה</strong><small>מדברים איתי, לא עם שרשרת של אנשי קשר.</small></div>
            <div><span>02</span><strong>חשיבה מערכתית</strong><small>רואה את כל התהליך, מהמשתמש ועד הנתונים.</small></div>
            <div><span>03</span><strong>אחריות לתוצאה</strong><small>בדיקות, נגישות וביצועים הם חלק מהבנייה.</small></div>
          </div>
        </div>
      </section>

      <section className="tech-strip" aria-label="טכנולוגיות" tabIndex={0}>
        <span>TECH STACK</span>
        <strong>TypeScript</strong><i />
        <strong>React</strong><i />
        <strong>Next.js</strong><i />
        <strong>Node.js</strong><i />
        <strong>Supabase</strong><i />
        <strong>PostgreSQL</strong>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <span className="section-kicker">יש לך רעיון?</span>
          <h2 id="contact-title">בואו נהפוך אותו<br />למשהו שעובד.</h2>
          <p>
            ספרו לי בקצרה מה העסק צריך. אחזור אליכם כדי להבין את המטרה ולבדוק
            מה הדרך הנכונה לבנות אותה.
          </p>
          <div className="contact-channels">
            <a className="contact-direct" href="mailto:nisan.sinai5@gmail.com">
              <span>אימייל ישיר</span>
              <strong>nisan.sinai5@gmail.com</strong>
            </a>
            <a className="contact-direct" href="tel:+972587170978">
              <span>טלפון</span>
              <strong>058-7170978</strong>
            </a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top" aria-label="חזרה לראש העמוד">
          <span className="brand-mark" aria-hidden="true">NS<span>.</span></span>
          <span className="brand-copy"><strong>ניסן סיני</strong><small>טכנולוגיות</small></span>
        </a>
        <p>אתרים · מערכות · אוטומציות · פתרונות דיגיטליים</p>
        <div>
          <a href="mailto:nisan.sinai5@gmail.com">אימייל</a>
          <a href="tel:+972587170978">טלפון</a>
          <a href="https://www.linkedin.com/in/nisansinai" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="/privacy">פרטיות</a>
        </div>
        <small>© 2026 ניסן סיני טכנולוגיות. כל הזכויות שמורות.</small>
      </footer>
    </main>
  );
}
