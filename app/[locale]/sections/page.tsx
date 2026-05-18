import { getTranslations } from 'next-intl/server';
import { Layers } from 'lucide-react';
import { GovVerifiedBadge } from '@/components/ui';
import { SectionsList } from '@/components/sections/SectionsList';

interface SectionsPageProps {
  params: { locale: string };
}

export const revalidate = 60;

export default async function SectionsPage({ params: { locale } }: SectionsPageProps) {
  const t = await getTranslations();

  return (
    <main id="main-content" className="min-h-screen bg-gov-light py-8 sm:py-12 md:py-16">
      <div className="section-container">
        {/* Page Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-3 flex justify-center sm:mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 sm:h-16 sm:w-16 sm:rounded-2xl">
              <Layers className="h-6 w-6 text-primary-700 sm:h-8 sm:w-8" />
            </div>
          </div>
          <h1 className="mb-2 px-4 font-heading text-xl font-bold text-text-primary sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl">
            {t('sections.title')}
          </h1>
          <p className="mx-auto mb-3 max-w-2xl px-4 text-sm text-text-secondary sm:mb-4 sm:text-base">
            {locale === 'ru'
              ? 'Доступ ко всем разделам и главам Трудового кодекса'
              : "Mehnat kodeksining barcha bo'limlari va boblariga kirish"}
          </p>
          <GovVerifiedBadge>{t('common.verifiedByGov')}</GovVerifiedBadge>
        </div>

        {/* Sections list — fetched on the client to bypass Vercel serverless timeout */}
        <SectionsList locale={locale} />
      </div>
    </main>
  );
}
