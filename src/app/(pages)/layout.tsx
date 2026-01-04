// src/app/[locale]/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "../lib/context/authProvider";
import { HeaderMain, FooterMain } from "@components";

import "./globals.css";

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


export default async function RootLayout({ children }) {
    // const {locale} = await params;
    const locale = "de"
    const messages = await getMessages({ locale });

    return (
        <AuthProvider>
            <html lang={locale}>
                <body className={`${geistSans.variable} ${geistMono.variable}`}>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <HeaderMain messages={messages} />
                        <div></div>
                        {children}
                        <FooterMain />
                    </NextIntlClientProvider>
                </body>
            </html>
        </AuthProvider>
    );
}