'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, BookOpen, RefreshCw, Layers } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { SectionsSkeleton } from '@/components/skeletons';
import { getSections, getLocalizedText } from '@/lib/api';
import type { Locale, Section } from '@/types';

interface SectionsListProps {
  locale: string;
}

function toSentenceCase(text: string): string {
  if (!text) return text;
  const isAllCaps = text === text.toLocaleUpperCase() && text !== text.toLocaleLowerCase();
  if (!isAllCaps) return text;
  const lower = text.toLocaleLowerCase();
  return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}

export function SectionsList({ locale }: SectionsListProps) {
  const [sections, setSections] = useState<Section[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSections(null);
    setHasError(false);

    getSections(locale as Locale)
      .then(data => {
        if (cancelled) return;
        setSections(data);
      })
      .catch(error => {
        if (cancelled) return;
        console.error('Failed to fetch sections:', error);
        setHasError(true);
        setSections([]);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const isLoading = sections === null;

  if (isLoading) {
    return <SectionsSkeleton count={9} />;
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gov-border">
          {hasError ? (
            <RefreshCw className="h-8 w-8 text-text-muted" />
          ) : (
            <Layers className="h-8 w-8 text-text-muted" />
          )}
        </div>
        <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
          {hasError
            ? locale === 'ru'
              ? 'Ошибка загрузки'
              : 'Yuklashda xatolik'
            : locale === 'ru'
              ? 'Разделы не найдены'
              : "Bo'limlar topilmadi"}
        </h3>
        <p className="mb-6 text-text-secondary">
          {hasError
            ? locale === 'ru'
              ? 'Сервер временно недоступен. Обновите страницу.'
              : 'Server vaqtincha mavjud emas. Sahifani yangilang.'
            : locale === 'ru'
              ? 'Пожалуйста, попробуйте позже'
              : "Iltimos, keyinroq urinib ko'ring"}
        </p>
        {hasError && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <RefreshCw className="h-4 w-4" />
            {locale === 'ru' ? 'Обновить' : 'Yangilash'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {sections.map(section => {
        const rawTitle = getLocalizedText(section.title, locale);
        const rawDescription = section.description
          ? getLocalizedText(section.description, locale)
          : '';
        const title = toSentenceCase(rawTitle);
        const description =
          rawDescription && rawDescription.toLowerCase() !== rawTitle.toLowerCase()
            ? toSentenceCase(rawDescription)
            : '';

        return (
          <Link
            key={section.id}
            href={`/${locale}/sections/${section.id}`}
            className="block h-full"
          >
            <Card hover className="group flex h-full flex-col">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <Badge variant="primary" size="md" className="text-xs sm:text-sm">
                  {section.number}-{locale === 'ru' ? 'раздел' : "bo'lim"}
                </Badge>
                <ChevronRight className="h-4 w-4 text-text-muted transition-colors duration-150 group-hover:text-primary-600 sm:h-5 sm:w-5" />
              </div>

              <h2 className="mb-2 line-clamp-3 min-h-[3.75rem] font-heading text-base font-semibold leading-snug text-text-primary transition-colors duration-150 group-hover:text-primary-700 sm:min-h-[4.5rem] sm:text-lg">
                {title}
              </h2>

              <p className="line-clamp-2 min-h-[2.5rem] flex-grow text-xs leading-relaxed text-text-secondary sm:text-sm">
                {description || '\u00A0'}
              </p>

              <div className="mt-3 flex items-center gap-3 border-t border-gov-border pt-3 sm:mt-4 sm:gap-4 sm:pt-4">
                <div className="flex items-center gap-1 text-xs text-text-muted sm:gap-1.5 sm:text-sm">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    {section.chaptersCount} {locale === 'ru' ? 'глав' : 'bob'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-muted sm:gap-1.5 sm:text-sm">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    {section.articlesCount} {locale === 'ru' ? 'статей' : 'modda'}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default SectionsList;
