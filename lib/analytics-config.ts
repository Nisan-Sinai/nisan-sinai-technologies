import { getSlugs } from './blog';
import { locales, localePath } from './i18n';
import type { AnalyticsConfig } from './analytics-runtime';

export const analyticsConfig: AnalyticsConfig = {
  id: 'G-M68XG21W0R',
  origin: 'https://nisan-sinai-technologies.vercel.app',
  name: 'Nisan Sinai Technologies',
  paths: locales.flatMap((locale) => ['/', '/blog', '/privacy', '/accessibility',
    ...getSlugs(locale).map((slug) => `/blog/${slug}`),
  ].map((path) => localePath(locale, path))),
};
