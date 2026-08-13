import Link from "next/link";
import Brand from "./brand";
import ContactForm from "./contact-form";
import ExternalLink from "./external-link";
import LanguageSwitch from "./language-switch";
import LatinText from "./latin-text";
import MarqueeStrip from "./marquee-strip";
import MobileMenu, { type MenuItem } from "./mobile-menu";
import SiteFooter from "./site-footer";
import StructuredData from "./structured-data";
import { contact, getContent } from "@/lib/content";
import { formatPostDate, getPosts } from "@/lib/blog";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";

/**
 * The previews are photographs of the live sites, refreshed by the
 * project-shots workflow. Hosts are not translated, so they live here rather
 * than in the content dictionary.
 */
const PROJECT_SITES = [
  {
    slug: "ld-event-design",
    host: "ld-event-design.vercel.app",
    href: "https://ld-event-design.vercel.app/",
    shot: { width: 1440, height: 900 },
  },
  {
    slug: "shel-yah",
    host: "shel-yah-web.vercel.app",
    href: "https://shel-yah-web.vercel.app/",
    shot: { width: 1440, height: 900 },
  },
  {
    // Shorter than the others: the 900px fold on this site lands in the middle
    // of a headline, so the shot is cut at the seam above it instead.
    slug: "rsvp",
    host: "arrival-confirmations.vercel.app",
    href: "https://arrival-confirmations.vercel.app/",
    shot: { width: 1440, height: 800 },
  },
] as const;

export default function SitePage({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const arrow = forwardArrow(locale);
  const privacyHref = localePath(locale, "/privacy");
  const posts = getPosts(locale);
  // Each project is photographed in both languages, so an English reader sees
  // the English version of the work rather than a Hebrew screenshot of it.
  const shotSuffix = locale === "en" ? "-en" : "";

  // One list, rendered twice: the wide nav and the menu behind the button must
  // not be able to drift apart. The testimonials entry appears only once there
  // is a testimonials section for it to point at.
  const navItems: MenuItem[] = [
    { href: "#services", label: t.nav.services },
    { href: "#projects", label: t.nav.projects },
    ...(t.testimonials.items.length > 0
      ? [{ href: "#testimonials", label: t.nav.testimonials }]
      : []),
    { href: "#process", label: t.nav.process },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq },
    ...(posts.length > 0 ? [{ href: "#blog", label: t.nav.blog }] : []),
    { href: "#about", label: t.nav.about },
  ];

  return (
    <main>
      <StructuredData locale={locale} />
      <a className="skip-link" href="#main-content">
        {t.skipLink}
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label={t.brand.homeAria}>
          <Brand locale={locale} />
        </a>

        <nav className="desktop-nav" aria-label={t.nav.aria}>
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitch locale={locale} />
          <a className="header-cta" href="#contact">
            {t.nav.cta} <span aria-hidden="true">{arrow}</span>
          </a>
          <MobileMenu
            ariaLabel={t.nav.menuAria}
            items={navItems}
            label={t.nav.menu}
            navAria={t.nav.aria}
          />
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
            <span className="core-kicker">
              <LatinText text={t.hero.coreKicker} />
            </span>
            <strong>{t.hero.coreTitle}</strong>
            <span className="core-status">
              <i aria-hidden="true" /> {t.hero.coreStatus}
            </span>
          </div>

          {t.hero.capabilities.map((capability, index) => (
            <div className={`capability capability-${index + 1}`} key={capability.value}>
              <span>
                <LatinText text={capability.value} />
              </span>
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

      <MarqueeStrip
        className="services-intro"
        id="services"
        ariaLabel={t.strip.aria}
        lead={t.strip.lead}
        items={t.strip.items}
      />

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
                  <li key={tag}>
                    <LatinText text={tag} />
                  </li>
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
            // Every project links to its live site; the dictionary is the only
            // place a URL or a line of copy is written down.
            const href = project.href ?? PROJECT_SITES[index].href;

            return (
              <article className={`project-card ${modifier}`} key={project.title}>
                <div className="project-copy">
                  <div className="project-meta">
                    <span>
                      <LatinText text={project.meta} />
                    </span>
                    <span>{project.year}</span>
                  </div>
                  <h3>
                    <LatinText text={project.title} />
                  </h3>
                  <p>{project.description}</p>
                  <ul>
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ExternalLink
                    className="case-study-label"
                    href={href}
                    hint={t.newTabHint}
                  >
                    <LatinText text={project.linkLabel} />{" "}
                    <i aria-hidden="true">↗</i>
                  </ExternalLink>
                </div>
                <div className={`project-preview ${previewClass}`}>
                  <div className="mock-browser">
                    <div className="mock-browser-bar" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <span>{PROJECT_SITES[index].host}</span>
                    </div>
                    <img
                      className="mock-shot"
                      src={`/projects/${PROJECT_SITES[index].slug}${shotSuffix}.jpg`}
                      alt={project.previewLabel}
                      width={PROJECT_SITES[index].shot.width}
                      height={PROJECT_SITES[index].shot.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {t.testimonials.items.length > 0 && (
        <section
          className="content-section testimonials-section"
          id="testimonials"
          aria-labelledby="testimonials-title"
        >
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t.testimonials.kicker}</span>
              <h2 id="testimonials-title">{t.testimonials.title}</h2>
            </div>
            <p>{t.testimonials.lead}</p>
          </div>

          <div className="testimonials-grid">
            {t.testimonials.items.map((item) => (
              <figure className="testimonial-card" key={item.name}>
                <blockquote>
                  <p>{item.quote}</p>
                </blockquote>
                <figcaption>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

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

      <section
        className="content-section pricing-section"
        id="pricing"
        aria-labelledby="pricing-title"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.pricing.kicker}</span>
            <h2 id="pricing-title">{t.pricing.title}</h2>
          </div>
          <p>{t.pricing.lead}</p>
        </div>

        <div className="pricing-grid">
          {t.pricing.tiers.map((tier) => (
            <article className="pricing-card" key={tier.name}>
              <h3>{tier.name}</h3>
              <p className="pricing-figure">
                <span>{t.pricing.fromLabel}</span>
                <strong>{tier.from}</strong>
              </p>
              <p className="pricing-note">{tier.note}</p>
            </article>
          ))}
        </div>

        <p className="pricing-footnote">
          {t.pricing.hourly} {t.pricing.note}
        </p>
      </section>

      <section
        className="content-section faq-section"
        id="faq"
        aria-labelledby="faq-title"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.faq.kicker}</span>
            <h2 id="faq-title">{t.faq.title}</h2>
          </div>
          <p>{t.faq.lead}</p>
        </div>

        {/* Native disclosures: keyboard and screen-reader behaviour comes from
            the browser rather than from anything written here. */}
        <div className="faq-list">
          {t.faq.items.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <i aria-hidden="true" />
              </summary>
              <p>
                <LatinText text={item.answer} />
              </p>
            </details>
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section
          className="content-section blog-section"
          id="blog"
          aria-labelledby="blog-title"
        >
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t.blog.kicker}</span>
              <h2 id="blog-title">{t.blog.title}</h2>
            </div>
            <p>{t.blog.lead}</p>
          </div>

          <ul className="post-grid">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="post-card">
                  <p className="post-meta">
                    <time dateTime={post.date}>{formatPostDate(locale, post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </p>
                  <h3>
                    <Link href={localePath(locale, `/blog/${post.slug}`)}>
                      <LatinText text={post.title} />
                    </Link>
                  </h3>
                  <p className="post-excerpt">
                    <LatinText text={post.excerpt} />
                  </p>
                  <span className="post-more" aria-hidden="true">
                    {t.blog.readMore} {arrow}
                  </span>
                </article>
              </li>
            ))}
          </ul>

          <p className="blog-all">
            <Link href={localePath(locale, "/blog")}>
              {t.blog.all} <span aria-hidden="true">{arrow}</span>
            </Link>
          </p>
        </section>
      )}

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

      <MarqueeStrip
        className="tech-strip"
        ariaLabel={t.tech.aria}
        lead={t.tech.label}
        items={t.tech.items}
        leadIsLatin
      />

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <span className="section-kicker">{t.contact.kicker}</span>
          <h2 id="contact-title">{t.contact.title}</h2>
          <p>{t.contact.lead}</p>
          <div className="contact-channels">
            <a className="contact-direct" href={`mailto:${contact.email}`}>
              <span>{t.contact.emailLabel}</span>
              <strong lang="en">{contact.email}</strong>
            </a>
            <a className="contact-direct" href={`tel:${contact.phoneHref}`}>
              <span>{t.contact.phoneLabel}</span>
              <strong>{contact.phoneDisplay}</strong>
            </a>
            <ExternalLink
              className="contact-direct contact-whatsapp"
              href={contact.whatsappHref}
              hint={t.newTabHint}
            >
              <span>{t.contact.whatsappLabel}</span>
              <strong>{t.contact.whatsappValue}</strong>
            </ExternalLink>
          </div>
        </div>
        <ContactForm copy={t.form} arrow={arrow} privacyHref={privacyHref} />
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
