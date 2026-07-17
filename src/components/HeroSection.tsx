'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Bot, BookOpen, MessageSquare, Mic, Layout, Sparkles, Calendar, GraduationCap} from 'lucide-react';
import {useEffect, useState} from 'react';

const colors = [
  '#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24',
  '#22d3ee', '#fb923c', '#f43f5e', '#818cf8', '#2dd4bf',
];

function AnimatedText({text}: {text: string}) {
  const [chars, setChars] = useState<{char: string; color: string}[]>([]);
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (idx < text.length) {
      const t = setTimeout(() => {
        setChars(prev => [...prev, {char: text[idx], color: colors[idx % colors.length]}]);
        setIdx(idx + 1);
      }, 40);
      return () => clearTimeout(t);
    }
  }, [idx, text, started]);

  if (!started) {
    return <span className="text-purple-300">{text}</span>;
  }

  return (
    <span>
      {chars.map((c, i) => (
        <span key={i} style={{color: c.color}}>{c.char}</span>
      ))}
      {idx < text.length && <span className="text-purple-400 animate-pulse" style={{fontWeight: 100}}>|</span>}
    </span>
  );
}

export default function HeroSection() {
  const t = useTranslations('hero');
  const f = useTranslations('features');
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const features = [
    {icon: MessageSquare, title: f('ai'), desc: f('ai_desc'), gradient: 'from-purple-500 to-pink-500'},
    {icon: BookOpen, title: f('courses'), desc: f('courses_desc'), gradient: 'from-blue-500 to-cyan-500'},
    {icon: Bot, title: f('bot'), desc: f('bot_desc'), gradient: 'from-green-500 to-emerald-500'},
    {icon: Mic, title: f('voice'), desc: f('voice_desc'), gradient: 'from-yellow-500 to-orange-500'},
    {icon: Layout, title: f('webapp'), desc: f('webapp_desc'), gradient: 'from-red-500 to-pink-500'},
    {icon: Sparkles, title: f('filter'), desc: f('filter_desc'), gradient: 'from-indigo-500 to-purple-500'},
    {icon: Calendar, title: f('schedule'), desc: f('schedule_desc'), gradient: 'from-teal-500 to-cyan-500'},
    {icon: GraduationCap, title: f('fasalka'), desc: f('fasalka_desc'), gradient: 'from-orange-500 to-red-500'},
  ];

  if (!mounted) {
    return (
      <main>
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center relative overflow-hidden bg-grid">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)'}}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">AI-Powered Somali Assistant</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight min-h-[1.2em]">
              <span className="text-purple-300">{t('title')}</span>
            </h1>
            <div className="h-1 mt-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" style={{width: '100%'}} />
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto mt-6">{t('subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/courses" className="px-8 py-3 rounded-full font-semibold text-white" style={{background: 'linear-gradient(135deg, #7c3aed, #db2777)'}}>
                {t('cta')}
              </Link>
              <Link href="/bot" className="px-8 py-3 rounded-full font-semibold text-gray-300" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>
                {t('cta2')}
              </Link>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{f('title')}</h2>
            <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <div key={i} className="rounded-2xl p-6" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-200">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center relative overflow-hidden bg-grid">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-pink-500/8 rounded-full blur-[100px] animate-float" style={{animationDelay: '-3s'}} />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-500/8 rounded-full blur-[100px] animate-float" style={{animationDelay: '-1.5s'}} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-pulse-glow" style={{background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)'}}>
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI-Powered Somali Assistant</span>
          </div>

          <div className="relative inline-block mb-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight min-h-[1.2em]">
              <AnimatedText text={t('title')} />
            </h1>
            <div className="h-1 mt-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-shimmer" style={{backgroundSize: '200% auto', width: '100%'}} />
          </div>

          <p className={`text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {t('subtitle')}
          </p>

          <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/courses"
              className="group relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500 transition-all" />
              <span className="relative z-10">{t('cta')}</span>
            </Link>
            <Link
              href="/bot"
              className="px-8 py-3 rounded-full font-semibold text-gray-300 transition-all hover:scale-105 hover:text-white"
              style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
            >
              {t('cta2')}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{f('title')}</h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => (
            <div
              key={i}
              className="card-hover rounded-2xl p-6 group cursor-pointer"
              style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <feat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold mb-2 text-gray-200">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
