import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export const metadata: Metadata = {
  title: 'Isbar AI — Somali AI Assistant',
  description: 'Learn, Create, and Automate with AI in Somali Language',
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
