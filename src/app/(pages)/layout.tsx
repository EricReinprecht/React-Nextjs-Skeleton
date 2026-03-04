// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/context/authProvider";
import Header from "../lib/components/default/header";
import Footer from "../lib/components/default/footer";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});



// export async function generateMetadata({params}: {params: Params}) {
//     const {locale} = await params;
//     return {
//         title: "ProjectName",
//         description: "ProjectDescription",
//     }
// }


interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const locale = "de";
    const messages = await getMessages({ locale });

    return (
        <AuthProvider>
            <html lang={locale}>
                <body className={`${geistSans.variable} ${geistMono.variable}`}>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <Header messages={messages} />
                        {children}
                        <Footer />
                    </NextIntlClientProvider>
                </body>
            </html>
        </AuthProvider>
    );
}