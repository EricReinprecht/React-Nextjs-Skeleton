import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { AuthProvider } from "@context/authProvider";
import Header from "../lib/components/default/header";
import Footer from "../lib/components/default/footer";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

interface RootLayoutProps {
    children: ReactNode;
}

export default async function RootLayout({
    children,
}: RootLayoutProps) {
    const requestHeaders = await headers();
    const requestedLocale = requestHeaders.get("x-app-locale");
    const locale = requestedLocale === "en" ? "en" : "de";
    const messages = await getMessages({ locale });

    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <NextIntlClientProvider
                    locale={locale}
                    messages={messages}
                >
                    <AuthProvider>
                        <Header messages={messages} locale={locale} />
                        <main className="app-content">{children}</main>
                        <Footer />
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
