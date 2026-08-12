import { Fragment } from "react";
import ContactForm from "./contact-form";
import LanguageSwitch from "./language-switch";
import StructuredData from "./structured-data";
import { contact, getContent } from "@/lib/content";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";

export default function SitePage({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const arrow = forwardArrow(locale);
  const home = localePath(locale, "/");
  const privacyHref = localePath(locale, "/privacy");

  const brand = (
    <>
      <span className="brand-mark" aria-hidden="true">
        NS<span>.</span>
      </span>
      <span className="brand-copy">
        <strong>{t.brand.name}</strong>
        <small>{t.brand.suffix}</small>
      </span>
    </>
  );

  return (
    <main>
      <StructuredData locale={locale} />
      <a className="skip-link" href="#main-content">
        {t.skipLink}
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label={t.brand.homeAria}>
          {brand}
        </a>

        <nav className="desktop-nav" aria-label={t.nav.aria}>
          <a href="#services">{t.nav.services}</a>
          <a href="#projects">{t.nav.projects}</a>
          <a href="#process">{t.nav.process}</a>
          <a href="#about">{t.nav.about}</a>
        </nav>

        <div className="header-actions">
          <LanguageSwitch locale={locale} />
          <a className="header-cta" href="#contact">
            {t.nav.cta} <span aria-hidden="true">{arrow}</span>
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-copy" id="main-content">
          <div className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {t.hero.eyebrow}
          </div>

          <h1>
            {t.hero.titleLead}
            <span>{t.hero.titleAccent}</span>
            {t.hero.titleTail}
          </h1>

          <p>{t.hero.lead}</p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              {t.hero.primaryCta}
              <span aria-hidden="true">{arrow}</span>
            </a>
            <a className="button button-secondary" href="#projects">
              {t.hero.secondaryCta}
              <span aria-hidden="true">{arrow}</span>
            </a>
          </div>

          <dl className="hero-proof" aria-label={t.hero.proofAria}>
            {t.hero.proof.map((item, index) => (
              <div key={item}>
                <dt>{`0${index + 1}`}</dt>
                <dd>{item}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="system-visual" aria-label={t.hero.visualAria}>
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />

          <div className="system-core">
            <span className="core-kicker">{t.hero.coreKicker}</span>
            <strong>{t.hero.coreTitle}</strong>
            <span className="core-status">
              <i aria-hidden="true" /> {t.hero.coreStatus}
            </span>
          </div>

          {t.hero.capabilities.map((capability, index) => (
            <div className={`capability capability-${index + 1}`} key={capability.value}>
              <span>{capability.value}</span>
              <strong>{capability.label}</strong>
            </div>
          ))}

          <div className="signal-card" aria-hidden="true">
            <div className="signal-card-head">
              <span>{t.hero.signalLabel}</span>
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

        <a className="scroll-cue" href="#services" aria-label={t.hero.scrollCueAria}>
          <span>{t.hero.scrollCue}</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section className="services-intro" id="services" aria-label={t.strip.aria} tabIndex={0}>
        <span>{t.strip.lead}</span>
        {t.strip.items.map((item, index) => (
          <Fragment key={item}>
            {index > 0 && <i aria-hidden="true" />}
            <strong>{item}</strong>
          </Fragment>
        ))}
      </section>

      <section className="content-section services-section" aria-labelledby="services-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.services.kicker}</span>
            <h2 id="services-title">{t.services.title}</h2>
          </div>
          <p>{t.services.lead}</p>
        </div>

        <div className="services-grid">
          {t.services.items.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-card-top">
                <span>{service.number}</span>
                <i aria-hidden="true">{arrow}</i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul aria-label={t.services.tagsAria(service.title)}>
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
            <span className="section-kicker">{t.projects.kicker}</span>
            <h2 id="projects-title">{t.projects.title}</h2>
          </div>
          <p>{t.projects.lead}</p>
        </div>

        <div className="projects-list">
          {t.projects.items.map((project, index) => {
            const modifier = ["project-ld", "project-shel", "project-rsvp"][index];
            const previewClass = ["ld-preview", "shel-preview", "rsvp-preview"][index];
            return (
              <article className={`project-card ${modifier}`} key={project.title}>
                <div className="project-copy">
                  <div className="project-meta">
                    <span>{project.meta}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul>
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {project.href ? (
                    <a
                      className="case-study-label"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.linkLabel} <i aria-hidden="true">↗</i>
                    </a>
                  ) : (
                    <span className="case-study-label">
                      {project.linkLabel} <i aria-hidden="true">{arrow}</i>
                    </span>
                  )}
                </div>
                <div className={`project-preview ${previewClass}`} aria-label={project.previewLabel}>
                  {index === 0 && (
                    <div className="mock-browser">
                      <div className="mock-browser-bar">
                        <i />
                        <i />
                        <i />
                        <span>LD EVENT DESIGN</span>
                      </div>
                      <div className="ld-canvas">
                        <div className="ld-hero-mini">
                          <span>{t.hero.capabilities[0].label}</span>
                          <strong>{project.title}</strong>
                          <i />
                        </div>
                        <div className="ld-products-mini">
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="mock-browser">
                      <div className="mock-browser-bar">
                        <i />
                        <i />
                        <i />
                        <span>SHEL‑YAH</span>
                      </div>
                      <div className="shel-canvas">
                        <div className="shel-nav-mini">
                          <strong>SHEL‑YAH</strong>
                          <span>SHOP · NEW · STORY</span>
                        </div>
                        <div className="shel-products-mini">
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="dashboard-mock">
                      <div className="dashboard-side">
                        <strong>RSVP</strong>
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="dashboard-main">
                        <div className="dashboard-title">
                          <span>{t.hero.coreStatus}</span>
                          <strong>{project.title}</strong>
                        </div>
                        <div className="dashboard-stats">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="dashboard-chart">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section process-section" id="process" aria-labelledby="process-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.process.kicker}</span>
            <h2 id="process-title">{t.process.title}</h2>
          </div>
          <p>{t.process.lead}</p>
        </div>

        <ol className="process-grid">
          {t.process.steps.map((step) => (
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
            <div className="code-window-bar">
              <i />
              <i />
              <i />
              <span>nisan.ts</span>
            </div>
            <pre>
              <code>{`const solution = {
  understand: "the business",
  design: "the experience",
  build: "the right system",
  verify: "everything"
};

return makeItWork(solution);`}</code>
            </pre>
          </div>
          <span className="about-badge">{t.about.badge}</span>
        </div>
        <div className="about-copy">
          <span className="section-kicker">{t.about.kicker}</span>
          <h2 id="about-title">{t.about.title}</h2>
          <p>{t.about.text}</p>
          <div className="about-values">
            {t.about.values.map((value) => (
              <div key={value.number}>
                <span>{value.number}</span>
                <strong>{value.title}</strong>
                <small>{value.text}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tech-strip" aria-label={t.tech.aria} tabIndex={0}>
        <span>{t.tech.label}</span>
        {t.tech.items.map((item, index) => (
          <Fragment key={item}>
            {index > 0 && <i />}
            <strong>{item}</strong>
          </Fragment>
        ))}
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <span className="section-kicker">{t.contact.kicker}</span>
          <h2 id="contact-title">{t.contact.title}</h2>
          <p>{t.contact.lead}</p>
          <div className="contact-channels">
            <a className="contact-direct" href={`mailto:${contact.email}`}>
              <span>{t.contact.emailLabel}</span>
              <strong>{contact.email}</strong>
            </a>
            <a className="contact-direct" href={`tel:${contact.phoneHref}`}>
              <span>{t.contact.phoneLabel}</span>
              <strong>{contact.phoneDisplay}</strong>
            </a>
          </div>
        </div>
        <ContactForm copy={t.form} arrow={arrow} privacyHref={privacyHref} />
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href={home} aria-label={t.brand.topAria}>
          {brand}
        </a>
        <p>{t.footer.tagline}</p>
        <div>
          <a href={`mailto:${contact.email}`}>{t.footer.email}</a>
          <a href={`tel:${contact.phoneHref}`}>{t.footer.phone}</a>
          <a href="https://www.linkedin.com/in/nisansinai" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={privacyHref}>{t.footer.privacy}</a>
        </div>
        <small>{t.footer.rights}</small>
      </footer>
    </main>
  );
}
