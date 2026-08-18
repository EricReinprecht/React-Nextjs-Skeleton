"use client";

import { ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { LogoutButton } from "@components";

import "@styles/templates/manager_page.scss";

interface LayoutProps {
    children: ReactNode;
}

const ManagerPage = ({ children }: LayoutProps) => {
    const pathname = usePathname();
    const locale = useLocale();
    const localized = (path: string) => `/${locale}${path}`;
    const currentPath = (pathname ?? "/").replace(/^\/(?:de|en)(?=\/|$)/, "") || "/";

    const menuItems = [
        { label: "Übersicht", shortLabel: "Home", href: localized("/profile"), icon: "⌂", routes: ["/profile"] },
        { label: "Neue Party", shortLabel: "Neu", href: localized("/profile/edit-party"), icon: "+", routes: ["/profile/edit-party"] },
        { label: "Meine Partys", shortLabel: "Partys", href: localized("/profile/my-parties"), icon: "P", routes: ["/profile/my-parties", "/profile/show-parties"] },
        { label: "Meine Tickets", shortLabel: "Tickets", href: localized("/profile/my-tickets"), icon: "T", routes: ["/profile/my-tickets", "/profile/show-tickets"] },
        { label: "Warenkorb", shortLabel: "Korb", href: localized("/profile/shopping-cart"), icon: "W", routes: ["/profile/shopping-cart"] },
        { label: "Einstellungen", shortLabel: "Konto", href: localized("/profile/settings"), icon: "E", routes: ["/profile/settings"] },
    ];

    const activeItem = menuItems.find((item) => item.routes.some((route) =>
        route === "/profile"
            ? currentPath === route
            : currentPath === route || currentPath.startsWith(`${route}/`)
    )) ?? menuItems[0];

    return (
        <div className="manager_page-template">
            {/* <div className="background type-orange_gradient"></div> */}
            {/* <Header /> */}
            <aside className="sidebar">
                <div className="content">
                    <Link className="manager-brand" href={localized("/profile")}>
                        <span className="manager-brand-mark">E</span>
                        <span><strong>Event Admin</strong><small>Control Center</small></span>
                    </Link>
                    <nav className="menu-items" aria-label="Benutzerbereich">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`item${activeItem.href === item.href ? " active" : ""}`}
                            >
                                <span className="manager-nav-icon" aria-hidden="true">{item.icon}</span>
                                <span className="manager-nav-label">{item.label}</span>
                                <span className="manager-nav-short-label">{item.shortLabel}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="footer">
                    <div className="manager-session-copy"><span>Angemeldet</span><strong>Benutzerkonto</strong></div>
                    <div className="item logout"><LogoutButton disable_style /></div>
                </div>
            </aside>
            <main className="manager-page-content">
                <div className="wave"></div>
                <header className="manager-content-header">
                    <div><span>Benutzerbereich</span><h1>{activeItem.label}</h1></div>
                    <Link href={localized("/browse")}>Events entdecken <span aria-hidden="true">↗</span></Link>
                </header>
                <div className="manager-content-body">{children}</div>
            </main>
        </div>
    );
};

export default ManagerPage;
