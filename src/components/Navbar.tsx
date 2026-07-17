'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';
import {Menu, X, Bot, Globe, Calendar, GraduationCap, BookOpen} from 'lucide-react';
import {useState} from 'react';

export default function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {href: '/', label: t('home'), icon: Bot},
    {href: '/courses', label: t('courses'), icon: BookOpen},
    {href: '/schedule', label: t('schedule'), icon: Calendar},
    {href: '/fasalka', label: t('fasalka'), icon: GraduationCap},
    {href: '/bot', label: t('bot'), icon: Bot},
    {href: '/webapp', label: t('webapp'), icon: Bot},
  ];

  const switchLocale = pathname.startsWith('/en') ? 'so' : 'en';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124, 58, 237, 0.1)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Isbar AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-500/10 text-purple-300'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={pathname === '/' ? `/${switchLocale}` : `/${switchLocale}${pathname.replace(/^\/(en|so)/, '')}`}
              className="ml-2 flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-full border border-gray-800 hover:border-purple-500/50"
            >
              <Globe className="w-3.5 h-3.5" />
              {switchLocale === 'so' ? 'So' : 'En'}
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden" style={{background: 'rgba(10, 10, 26, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(124, 58, 237, 0.1)'}}>
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-500/5 transition-all"
                >
                  <Icon className="w-4 h-4 text-purple-400" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={`/${switchLocale}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-purple-300"
            >
              <Globe className="w-4 h-4" />
              {switchLocale === 'so' ? 'Soomaali' : 'English'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
