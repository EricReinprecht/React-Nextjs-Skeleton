import { getAuthUser } from '@backend/auth/session';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';

import Header from '@frontend/components/default/header';

import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

interface RootLayoutProps {
    children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const requestHeaders = await headers();
    const requestedLocale = requestHeaders.get('x-app-locale');
    const locale = requestedLocale === 'en' ? 'en' : 'de';
    const messages = await getMessages({ locale });
    const user = await getAuthUser();

    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Header messages={messages} locale={locale} user={user} />
                    <main className="app-content">{children}</main>
                    {/* <Footer /> */}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
