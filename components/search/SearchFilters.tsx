'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { getSections, getChapters, getLocalizedText } from '@/lib/api';
import type { SearchFilters as SearchFiltersType, Section, Chapter, Locale } from '@/types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  locale: string;
  resultCount: number;
}

export function SearchFiltersPanel({
  filters,
  onFiltersChange,
  locale,
  resultCount,
}: SearchFiltersProps) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    getSections(locale as Locale).then(setSections);
  }, [locale]);

  useEffect(() => {
    if (filters.sectionId) {
      getChapters({ sectionId: filters.sectionId }, locale as Locale).then(setChapters);
    } else {
      setChapters([]);
    }
  }, [filters.sectionId, locale]);

  const availableChapters = chapters;

  const activeFilterCount = [
    filters.type !== 'all',
    filters.sectionId,
    filters.chapterId,
    filters.language,
  ].filter(Boolean).length;

  const handleTypeChange = (type: SearchFiltersType['type']) => {
    onFiltersChange({ ...filters, type });
  };

  const handleSectionChange = (id: string) => {
    const sectionId = id ? parseInt(id) : undefined;
    onFiltersChange({ ...filters, sectionId, chapterId: undefined });
  };

  const handleChapterChange = (id: string) => {
    const chapterId = id ? parseInt(id) : undefined;
    onFiltersChange({ ...filters, chapterId });
  };

  const handleLanguageChange = (language: string) => {
    const lang = language as SearchFiltersType['language'] | '';
    onFiltersChange({ ...filters, language: lang || undefined });
  };

  const handleClearFilters = () => {
    onFiltersChange({ type: 'all' });
  };

  return (
    <div className="rounded-lg border border-gov-border bg-gov-surface sm:rounded-xl">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3 text-left sm:p-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary-600 sm:h-5 sm:w-5" />
          <span className="text-sm font-medium text-text-primary sm:text-base">
            {t('article.filters')}
          </span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white sm:h-5 sm:w-5 sm:text-xs">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-xs text-text-muted sm:block sm:text-sm">
            {t('article.resultsCount', { count: resultCount })}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-text-muted transition-transform sm:h-5 sm:w-5',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Filters Content - CSS animation instead of Framer Motion */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-out',
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {isExpanded && (
          <div className="space-y-3 border-t border-gov-border px-3 pb-3 pt-3 sm:space-y-4 sm:px-4 sm:pb-4 sm:pt-4">
            {/* Content Type */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                {t('search.contentType')}
              </label>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { value: 'all', label: t('search.all') },
                  { value: 'article', label: t('search.articleText') },
                  { value: 'comment', label: t('article.comment') },
                ].map(option => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={filters.type === option.value}
                      onChange={() => handleTypeChange(option.value as SearchFiltersType['type'])}
                      className="h-3.5 w-3.5 border-gov-border text-primary-600 focus:ring-primary-500 sm:h-4 sm:w-4"
                    />
                    <span className="text-xs text-text-secondary sm:text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section Filter */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                {t('article.section')}
              </label>
              <select
                value={filters.sectionId || ''}
                onChange={e => handleSectionChange(e.target.value)}
                className={cn(
                  'h-9 w-full rounded-lg px-2.5 sm:h-10 sm:px-3',
                  'border border-gov-border bg-gov-light',
                  'text-xs text-text-primary sm:text-sm',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                )}
              >
                <option value="">{t('article.allSections')}</option>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.number}. {getLocalizedText(s.title, locale)}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Filter */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                {t('article.chapter')}
              </label>
              <select
                value={filters.chapterId || ''}
                onChange={e => handleChapterChange(e.target.value)}
                className={cn(
                  'h-9 w-full rounded-lg px-2.5 sm:h-10 sm:px-3',
                  'border border-gov-border bg-gov-light',
                  'text-xs text-text-primary sm:text-sm',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                )}
              >
                <option value="">{t('article.allChapters')}</option>
                {availableChapters.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.number}-{t('article.chapter').toLowerCase()}.{' '}
                    {getLocalizedText(ch.title, locale)}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                {t('article.translation')}
              </label>
              <select
                value={filters.language || ''}
                onChange={e => handleLanguageChange(e.target.value)}
                className={cn(
                  'h-9 w-full rounded-lg px-2.5 sm:h-10 sm:px-3',
                  'border border-gov-border bg-gov-light',
                  'text-xs text-text-primary sm:text-sm',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                )}
              >
                <option value="">{t('article.allLanguages')}</option>
                <option value="uz">🇺🇿 O&apos;zbekcha</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                leftIcon={<X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                className="w-full text-xs sm:text-sm"
              >
                {t('article.clearFilters')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchFiltersPanel;
