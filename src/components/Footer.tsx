'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Bot, Heart} from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Bot className="w-5 h-5 text-purple-400" />
          <span className="text-sm">Isbar AI &copy; 2026 — {t('rights')}</span>
        </div>
        <p className="text-sm text-gray-500">
          {t('made')}
        </p>
      </div>
    </footer>
  );
}
