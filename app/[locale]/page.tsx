import { Suspense } from 'react';
import { HeroSection, SectionsGrid, StatisticsSection, Features } from '@/components/landing';
import { SectionsSkeleton } from '@/components/skeletons';

// Enable ISR - revalidate page every 5 minutes
// This makes the page static and fast, while still updating periodically
export const revalidate = 300;

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  return (
    <>
      <HeroSection locale={locale} />
      <Suspense
        fallback={
          <section className="bg-gov-light py-10 sm:py-16 md:py-24">
            <div className="section-container">
              <SectionsSkeleton count={6} />
            </div>
          </section>
        }
      >
        <SectionsGrid locale={locale} maxItems={6} />
      </Suspense>
      <StatisticsSection variant="cards" showTrends={true} />
      <Features />
    </>
  );
}
