'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { SearchAutocomplete } from './SearchAutocomplete';
import { saveRecentSearch, type SearchSuggestion } from '@/lib/search-utils';

interface HeroSearchProps {
  locale: string;
  className?: string;
}

export function HeroSearch({ locale, className }: HeroSearchProps) {
  const t = useTranslations();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.url) {
      router.push(suggestion.url);
    } else {
      setQuery(suggestion.text);
      saveRecentSearch(suggestion.text);
      router.push(`/${locale}/search?q=${encodeURIComponent(suggestion.text)}`);
    }
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className={cn('mx-auto w-full max-w-2xl', className)}>
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            'relative flex items-center',
            'rounded-xl bg-white sm:rounded-2xl',
            'shadow-xl shadow-primary-900/10',
            'transition-shadow duration-200',
            isFocused && 'ring-2 ring-primary-500/40'
          )}
        >
          {/* Search Icon */}
          <div className="pl-3 sm:pl-5">
            <Search className="h-5 w-5 text-primary-600 sm:h-6 sm:w-6" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={t('header.searchPlaceholder')}
            className={cn(
              'h-12 flex-1 px-3 sm:h-14 sm:px-4 md:h-16',
              'border-0 bg-transparent',
              'text-base text-text-primary placeholder:text-text-muted sm:text-lg',
              'focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
          />

          {/* Submit Button */}
          <div className="pr-1.5 sm:pr-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!query.trim()}
              className="h-9 rounded-lg px-3 sm:h-11 sm:rounded-xl sm:px-6"
            >
              <span className="mr-2 hidden sm:inline">{t('common.search')}</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        <SearchAutocomplete
          query={query}
          locale={locale}
          isOpen={isFocused}
          onClose={() => setIsFocused(false)}
          onSelect={handleSuggestionSelect}
          className="mt-3"
        />
      </form>
    </div>
  );
}

export default HeroSearch;
