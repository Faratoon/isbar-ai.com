'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Bot, BookOpen, MessageSquare, Mic, Layout, Sparkles} from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const f = useTranslations('features');

  const features = [
    {icon: MessageSquare, title: f('ai'), desc: f('ai_desc')},
    {icon: BookOpen, title: f('courses'), desc: f('courses_desc')},
    {icon: Bot, title: f('bot'), desc: f('bot_desc')},
    {icon: Mic, title: f('voice'), desc: f('voice_desc')},
    {icon: Layout, title: f('webapp'), desc: f('webapp_desc')},
    {icon: Sparkles, title: f('filter'), desc: f('filter_desc')},
  ];

  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '-3s'}} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-purple-300 mb-8 animate-pulse-glow">
            <Sparkles className="w-4 h-4" />
            AI-Powered Somali Assistant
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">{t('title')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold hover:from-purple-500 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25"
            >
              {t('cta')}
            </Link>
            <Link
              href="/bot"
              className="px-8 py-3 rounded-full glass text-white font-semibold hover:bg-white/10 transition-all"
            >
              {t('cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">
          {f('title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <feat.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-400 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
