'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Bot, MessageSquare, Calendar, BookOpen, Mic, Crown} from 'lucide-react';

export default function BotPage() {
  const t = useTranslations('bot');

  const features = [
    {icon: MessageSquare, label: t('ai_chat')},
    {icon: Bot, label: t('channels')},
    {icon: Calendar, label: t('schedule')},
    {icon: BookOpen, label: t('courses')},
    {icon: Mic, label: t('voice')},
    {icon: Crown, label: t('premium')},
  ];

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold gradient-text mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-300 mb-8">{t('subtitle')}</p>

        <a
          href="https://t.me/baahiyebot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold hover:from-purple-500 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 mb-12"
        >
          <Bot className="w-5 h-5" />
          {t('start')}
        </a>

        <h2 className="text-2xl font-semibold mb-6">{t('features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
              <feat.icon className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-sm text-gray-200">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
