import { Layers } from 'lucide-react';

export default function SectionsLoading() {
  return (
    <main className="min-h-screen bg-gov-light py-8 sm:py-12 md:py-16">
      <div className="section-container">
        {/* Page Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-3 flex justify-center sm:mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 sm:h-16 sm:w-16 sm:rounded-2xl">
              <Layers className="h-6 w-6 text-primary-700 sm:h-8 sm:w-8" />
            </div>
          </div>
          <div className="mx-auto mb-2 h-8 w-64 animate-pulse rounded-lg bg-gov-border sm:mb-3" />
          <div className="mx-auto mb-3 h-5 w-96 animate-pulse rounded bg-gov-border sm:mb-4" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl border border-gov-border bg-gov-surface p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gov-border" />
                <div className="h-4 w-4 animate-pulse rounded bg-gov-border" />
              </div>
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gov-border" />
              <div className="mb-4 h-4 w-full animate-pulse rounded bg-gov-border" />
              <div className="border-t border-gov-border pt-3 sm:pt-4">
                <div className="flex gap-4">
                  <div className="h-4 w-16 animate-pulse rounded bg-gov-border" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gov-border" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
