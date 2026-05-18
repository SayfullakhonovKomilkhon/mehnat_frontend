import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  BookOpen,
  FileText,
  Clock,
  Coffee,
  Wallet,
  Shield,
  ChevronRight,
  Layers,
  ArrowRight,
  Scale,
  Users,
  Briefcase,
  Heart,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSections, getLocalizedText } from '@/lib/api';
import type { Section, Locale, LocalizedString } from '@/types';

interface SectionsGridProps {
  locale: string;
  showHeader?: boolean;
  maxItems?: number;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FileText,
  Clock,
  Coffee,
  Wallet,
  Shield,
  Scale,
  Heart,
  Users,
  Briefcase,
  Award,
  AlertTriangle,
};

// Color mapping for accent borders
const colorMap: Record<string, { border: string; bg: string; text: string }> = {
  blue: { border: 'border-l-primary-600', bg: 'bg-primary-50', text: 'text-primary-600' },
  indigo: { border: 'border-l-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  emerald: { border: 'border-l-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { border: 'border-l-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
  green: { border: 'border-l-green-600', bg: 'bg-green-50', text: 'text-green-600' },
  red: { border: 'border-l-red-600', bg: 'bg-red-50', text: 'text-red-600' },
  purple: { border: 'border-l-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
  rose: { border: 'border-l-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
  cyan: { border: 'border-l-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-600' },
};

// Backend may return titles in ALL CAPS; convert to "Sentence case" for readability.
function toSentenceCase(text: string): string {
  if (!text) return text;
  const isAllCaps = text === text.toLocaleUpperCase() && text !== text.toLocaleLowerCase();
  if (!isAllCaps) return text;
  const lower = text.toLocaleLowerCase();
  return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}

// Convert API section to display format
function sectionToDisplayFormat(section: Section, index: number) {
  const colors = ['blue', 'indigo', 'emerald', 'amber', 'green', 'red', 'purple', 'rose', 'cyan'];
  const icons = [
    'BookOpen',
    'FileText',
    'Clock',
    'Coffee',
    'Wallet',
    'Shield',
    'Scale',
    'Heart',
    'Users',
  ];

  return {
    id: section.id,
    number: section.number,
    title: section.title,
    description: section.description,
    chaptersCount: section.chaptersCount,
    articlesCount: section.articlesCount,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
  };
}

// Server component - fetches data from API
// Wrapped in <Suspense> in the parent page, so the skeleton fallback
// is shown via streaming SSR while we wait for the real data.
export async function SectionsGrid({ locale, showHeader = true, maxItems }: SectionsGridProps) {
  const t = await getTranslations();

  let apiSections: Section[] = [];
  try {
    apiSections = await getSections(locale as Locale);
  } catch (error) {
    console.error('Failed to fetch sections from API:', error);
  }

  const sectionsData = apiSections.map((s, i) => sectionToDisplayFormat(s, i));
  const displayedSections = maxItems ? sectionsData.slice(0, maxItems) : sectionsData;

  const getLocalizedTitle = (section: { title?: LocalizedString }) =>
    section.title ? getLocalizedText(section.title, locale) : '';

  const getLocalizedDescription = (section: { description?: LocalizedString }) =>
    section.description ? getLocalizedText(section.description, locale) : '';

  // Get chapter/article label based on locale
  const getCountLabel = (chapters: number, articles: number) => {
    switch (locale) {
      case 'ru':
        return `${chapters} глав, ${articles} статей`;
      case 'en':
        return `${chapters} chapters, ${articles} articles`;
      default:
        return `${chapters} bob, ${articles} modda`;
    }
  };

  return (
    <section className="bg-gov-light py-10 sm:py-16 md:py-24">
      <div className="section-container">
        {/* Section Header */}
        {showHeader && (
          <div className="animate-fadeIn mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 sm:h-12 sm:w-12 sm:rounded-xl">
                  <Layers className="h-5 w-5 text-primary-700 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-text-primary sm:text-2xl md:text-3xl">
                    {t('sections.title')}
                  </h2>
                  <p className="text-xs text-text-secondary sm:text-sm">
                    {locale === 'ru'
                      ? 'Структура Трудового кодекса'
                      : locale === 'en'
                        ? 'Labor Code Structure'
                        : 'Mehnat kodeksi tuzilishi'}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/${locale}/sections`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 sm:text-base"
            >
              {t('common.viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Empty / Error State */}
        {displayedSections.length === 0 && (
          <div className="rounded-xl border border-gov-border bg-white py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gov-border/40">
              <AlertTriangle className="h-6 w-6 text-text-muted" />
            </div>
            <p className="text-sm text-text-secondary">
              {locale === 'ru'
                ? 'Не удалось загрузить разделы. Попробуйте обновить страницу.'
                : locale === 'en'
                  ? 'Failed to load sections. Please refresh the page.'
                  : "Bo'limlarni yuklab bo'lmadi. Sahifani yangilang."}
            </p>
          </div>
        )}

        {/* Sections Grid - CSS animations */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
          {displayedSections.map((section, index) => {
            const Icon = iconMap[section.icon] || BookOpen;
            const colors = colorMap[section.color] || colorMap.blue;

            return (
              <div
                key={section.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link href={`/${locale}/sections/${section.id}`}>
                  <article
                    className={cn(
                      'group relative overflow-hidden rounded-lg bg-gov-surface sm:rounded-xl',
                      'border border-l-4 border-gov-border',
                      colors.border,
                      'h-full cursor-pointer',
                      'card-interactive' // CSS-only hover animation
                    )}
                  >
                    <div className="flex h-full flex-col p-4 sm:p-6">
                      {/* Header Row */}
                      <div className="mb-3 flex items-start justify-between sm:mb-4">
                        {/* Roman Numeral */}
                        <span className="select-none font-heading text-2xl font-bold text-gov-border sm:text-4xl">
                          {section.number}
                        </span>

                        {/* Icon */}
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
                            'transition-transform duration-200 group-hover:scale-110',
                            colors.bg
                          )}
                        >
                          <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', colors.text)} />
                        </div>
                      </div>

                      {(() => {
                        const rawTitle = getLocalizedTitle(section) || '';
                        const rawDesc = getLocalizedDescription(section) || '';
                        const title = toSentenceCase(rawTitle);
                        const description =
                          rawDesc && rawDesc.toLowerCase() !== rawTitle.toLowerCase()
                            ? toSentenceCase(rawDesc)
                            : '';
                        return (
                          <>
                            <h3 className="mb-1.5 line-clamp-2 min-h-[3rem] font-heading text-base font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary-700 sm:mb-2 sm:min-h-[3.5rem] sm:text-lg">
                              {title}
                            </h3>
                            <p className="line-clamp-2 min-h-[2.5rem] flex-grow text-xs leading-relaxed text-text-secondary sm:text-sm">
                              {description || '\u00A0'}
                            </p>
                          </>
                        );
                      })()}

                      {/* Stats & Arrow - Always at bottom */}
                      <div className="mt-3 flex items-center justify-between border-t border-gov-border pt-3 sm:mt-4 sm:pt-4">
                        <span className="text-xs text-text-muted sm:text-sm">
                          {getCountLabel(section.chaptersCount, section.articlesCount)}
                        </span>
                        <div className="text-primary-600 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </article>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Button - Mobile */}
        {showHeader && (
          <div
            className="animate-fadeIn mt-6 text-center sm:hidden"
            style={{ animationDelay: '0.3s' }}
          >
            <Link href={`/${locale}/sections`}>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-5 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 active:bg-primary-100">
                {t('common.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default SectionsGrid;
