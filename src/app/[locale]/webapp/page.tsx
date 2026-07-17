'use client';

import {useTranslations} from 'next-intl';
import {Layout, BarChart3, BookOpen, TrendingUp, Bot} from 'lucide-react';

export default function WebAppPage() {
  const t = useTranslations('webapp');

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Layout className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold gradient-text mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-300">{t('subtitle')}</p>
        </div>

        {/* Telegram WebApp Simulator */}
        <div className="glass rounded-3xl p-8 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{t('welcome')}</h2>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className="text-sm">{t('stats')}</span>
              </div>
              <span className="text-purple-400 font-bold">85%</span>
            </div>

            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="text-sm">{t('courses')}</span>
              </div>
              <span className="text-purple-400 font-bold">3/6</span>
            </div>

            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-sm">{t('progress')}</span>
              </div>
              <div className="w-24 h-2 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
