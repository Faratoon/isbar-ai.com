'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';
import {Menu, X, Bot, Globe} from 'lucide-react';
import {useState} from 'react';

export default function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {href: '/', label: t('home')},
    {href: '/courses', label: t('courses')},
    {href: '/bot', label: t('bot')},
    {href: '/webapp', label: t('webapp')},
  ];

  const switchLocale = pathname.startsWith('/en') ? 'so' : 'en';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Bot className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="text-xl font-bold gradient-text">Isbar AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-purple-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={pathname === '/' ? `/${switchLocale}` : `/${switchLocale}${pathname.replace(/^\/(en|so)/, '')}`}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-full border border-gray-700 hover:border-purple-500"
            >
              <Globe className="w-4 h-4" />
              {switchLocale === 'so' ? 'Soomaali' : 'English'}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-gray-800">
          <div className="px-4 py-3 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-gray-300 hover:text-purple-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${switchLocale}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 py-2 text-sm text-gray-400 hover:text-purple-300"
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
