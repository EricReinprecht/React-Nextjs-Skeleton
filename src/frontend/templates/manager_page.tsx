"use client";

import { ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { LogoutButton } from "@frontend/components";
import { MANAGER_NAVIGATION } from "../navigation/manager_navigation";
import { matchesAnyPath } from "../navigation/routes";

import "@styles/templates/manager_page.scss";

interface LayoutProps {
    children: ReactNode;
}

const ManagerPage = ({ children }: LayoutProps) => {
    const pathname = usePathname();
    const locale = useLocale();
    const localized = (path: string) => `/${locale}${path}`;
    const activeItem = MANAGER_NAVIGATION.find((item) =>
        matchesAnyPath(pathname, item.routes, item.exact)
    ) ?? MANAGER_NAVIGATION[0];

    return (
        <div className="manager_page-template">
            <aside className="sidebar">
                <div className="content">
                    <Link className="manager-brand" href={localized("/profile")}>
                        <span className="manager-brand-mark">E</span>
                        <span><strong>Event Admin</strong><small>Control Center</small></span>
                    </Link>
                    <nav className="menu-items" aria-label="Benutzerbereich">
                        {MANAGER_NAVIGATION.map((item) => (
                            <Link
                                key={item.path}
                                href={localized(item.path)}
                                className={`item${activeItem.path === item.path ? " active" : ""}`}
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


