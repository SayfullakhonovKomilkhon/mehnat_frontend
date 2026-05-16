import { FileText, MessageSquare, Globe, TrendingUp, Award, Shield, Scale } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';

interface StatisticsSectionProps {
  variant?: 'strip' | 'grid' | 'cards';
  showTrends?: boolean;
  showBackground?: boolean;
}

// Color mappings
const colorStyles: Record<string, { icon: string; bg: string; border: string }> = {
  blue: {
    icon: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
  },
  emerald: {
    icon: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  amber: {
    icon: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  purple: {
    icon: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
};

// Server Component - No client-side JS needed
export async function StatisticsSection({
  variant = 'cards',
  showTrends = true,
  showBackground = true,
}: StatisticsSectionProps) {
  const t = await getTranslations('statisticsSection');

  const statisticsData = [
    {
      key: 'totalArticles',
      value: '581',
      icon: FileText,
      trend: { value: 12, label: t('trends.thisMonth') },
      color: 'blue',
      label: t('cards.articlesLabel'),
      description: t('cards.articlesDescription'),
    },
    {
      key: 'totalComments',
      value: '581',
      icon: MessageSquare,
      trend: { value: 8, label: t('trends.thisMonth') },
      color: 'emerald',
      label: t('cards.commentariesLabel'),
      description: t('cards.commentariesDescription'),
    },
    {
      key: 'experts',
      value: '25',
      icon: Award,
      trend: { value: 3, label: t('trends.new') },
      color: 'amber',
      label: t('cards.expertsLabel'),
      description: t('cards.expertsDescription'),
    },
    {
      key: 'translations',
      value: '2',
      suffix: t('cards.languagesSuffix'),
      icon: Globe,
      trend: null as { value: number; label: string } | null,
      color: 'purple',
      label: t('cards.languagesLabel'),
      description: t('cards.languagesDescription'),
    },
  ];

  return (
    <section
      className={cn(
        'relative overflow-hidden py-10 sm:py-16 md:py-24',
        showBackground
          ? 'bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50'
          : 'bg-gov-light'
      )}
    >
      {/* Decorative Background Elements - CSS only */}
      {showBackground && (
        <>
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #1E3A8A 1px, transparent 1px),
                linear-gradient(to bottom, #1E3A8A 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Decorative Scale of Justice */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
            <Scale className="h-[600px] w-[600px] text-primary-900" strokeWidth={0.5} />
          </div>

          {/* Static Gradient Orbs */}
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary-200/30 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-accent-gold/20 blur-[80px]" />
        </>
      )}

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="animate-fadeIn mb-8 text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gov-border bg-white/60 px-3 py-1.5 backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-2">
            <Shield className="h-3.5 w-3.5 text-primary-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-medium text-primary-700 sm:text-sm">{t('badge')}</span>
          </div>
          <h2 className="mb-2 font-heading text-xl font-bold text-text-primary sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-sm text-text-secondary sm:px-0 sm:text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Statistics Grid - Cards variant */}
        {variant === 'cards' && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
            {statisticsData.map((stat, index) => (
              <StatCard key={stat.key} stat={stat} index={index} showTrend={showTrends} />
            ))}
          </div>
        )}

        {/* Strip Variant */}
        {variant === 'strip' && (
          <div className="animate-fadeIn rounded-2xl border border-gov-border bg-white p-6 shadow-lg md:p-8">
            <div className="grid grid-cols-2 gap-6 divide-y divide-gov-border md:grid-cols-4 md:gap-8 md:divide-x md:divide-y-0">
              {statisticsData.map((stat, index) => (
                <StatStrip key={stat.key} stat={stat} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Grid Variant */}
        {variant === 'grid' && (
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:gap-6">
            {statisticsData.map((stat, index) => (
              <StatGridCard key={stat.key} stat={stat} index={index} showTrend={showTrends} />
            ))}
          </div>
        )}

        {/* Bottom Decorative Line */}
        <div className="mt-12 h-1 rounded-full bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
      </div>
    </section>
  );
}

// Card Variant Component - CSS animations only
function StatCard({
  stat,
  index,
  showTrend,
}: {
  stat: (typeof statisticsData)[0];
  index: number;
  showTrend: boolean;
}) {
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <div
      className={cn(
        'relative rounded-xl border bg-white p-4 shadow-card sm:rounded-2xl sm:p-6',
        'card-interactive', // CSS-only hover effect
        colors.border,
        'animate-fadeIn'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Icon */}
      <div
        className={cn(
          'mb-3 flex h-10 w-10 items-center justify-center rounded-lg sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl',
          colors.bg
        )}
      >
        <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', colors.icon)} />
      </div>

      {/* Number */}
      <div className="mb-1.5 flex items-baseline gap-1 sm:mb-2">
        <span className="font-heading text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
          {stat.value}
        </span>
        {stat.suffix && (
          <span className="font-heading text-base font-bold text-text-muted sm:text-xl md:text-2xl">
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="mb-0.5 text-sm font-medium text-text-primary sm:mb-1 sm:text-base">
        {stat.label}
      </p>

      {/* Description */}
      <p className="line-clamp-2 text-xs text-text-muted sm:text-sm">{stat.description}</p>

      {/* Trend Indicator - Hidden on mobile */}
      {showTrend && stat.trend && (
        <div className="absolute right-2 top-2 hidden sm:right-4 sm:top-4 sm:block">
          <div className="flex items-center gap-1 rounded-full bg-success-light px-2 py-1">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-xs font-medium text-success">
              +{stat.trend.value} {stat.trend.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Strip Variant Component
function StatStrip({ stat, index }: { stat: (typeof statisticsData)[0]; index: number }) {
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <div
      className={cn(
        'py-4 text-center first:pt-0 last:pb-0 md:first:pt-4 md:last:pb-4',
        'first:pl-0 last:pr-0 md:px-4',
        'animate-fadeIn'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={cn(
          'mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
          colors.bg
        )}
      >
        <Icon className={cn('h-5 w-5', colors.icon)} />
      </div>
      <div className="mb-1 font-heading text-2xl font-bold text-text-primary md:text-3xl">
        {stat.value}
        {stat.suffix || ''}
      </div>
      <p className="text-sm text-text-secondary">{stat.label}</p>
    </div>
  );
}

// Grid Variant Component
function StatGridCard({
  stat,
  index,
  showTrend,
}: {
  stat: (typeof statisticsData)[0];
  index: number;
  showTrend: boolean;
}) {
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <div
      className={cn(
        'rounded-2xl border-2 bg-white p-8 shadow-lg',
        'card-interactive',
        colors.border,
        'animate-fadeIn text-center'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Icon */}
      <div
        className={cn(
          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl',
          colors.bg
        )}
      >
        <Icon className={cn('h-8 w-8', colors.icon)} />
      </div>

      {/* Number */}
      <div className="mb-2 font-heading text-4xl font-bold text-text-primary md:text-5xl">
        {stat.value}
        {stat.suffix || ''}
      </div>

      {/* Label */}
      <p className="mb-2 text-lg font-medium text-text-primary">{stat.label}</p>

      {/* Description */}
      <p className="text-sm text-text-muted">{stat.description}</p>

      {/* Trend */}
      {showTrend && stat.trend && (
        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1.5">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-success">
            +{stat.trend.value} {stat.trend.label}
          </span>
        </div>
      )}
    </div>
  );
}

export default StatisticsSection;
