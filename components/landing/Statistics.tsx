'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Users, Award } from 'lucide-react';

const stats = [
  { key: 'totalArticles', value: '581', icon: FileText },
  { key: 'totalComments', value: '581', icon: MessageSquare },
  { key: 'users', value: '20,000', icon: Users },
  { key: 'experts', value: '25+', icon: Award },
];

export function Statistics() {
  const t = useTranslations('stats');

  return (
    <section className="relative overflow-hidden bg-primary-800 py-16 md:py-20">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Gold Accent Lines */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-accent-gold to-transparent" />
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-accent-gold to-transparent" />

      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10"
              >
                <stat.icon className="h-7 w-7 text-accent-gold" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 100 }}
                className="mb-2 font-heading text-3xl font-bold text-white md:text-4xl"
              >
                {stat.value}
              </motion.div>
              <div className="font-medium text-white">{t(stat.key)}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Statistics;
