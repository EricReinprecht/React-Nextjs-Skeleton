"use client"

import Link from "next/link";
import { useLocale } from "next-intl";

import { ManagerPage } from "@frontend/templates";
import withAuth from "@frontend/hoc/withAuth";

import "@styles/pages/profile.scss"


const Profile: React.FC = () => {
    const locale = useLocale();
    const localized = (path: string) => `/${locale}${path}`;
    const dashboardItems = [
        { label: "Neue Party", description: "Erstelle ein Event und konfiguriere Ticketklassen.", href: "/profile/edit-party", icon: "+", accent: "orange" },
        { label: "Meine Partys", description: "Verwalte deine Events, Inhalte und Veröffentlichungen.", href: "/profile/my-parties", icon: "P", accent: "red" },
        { label: "Meine Tickets", description: "Öffne und drucke deine gekauften Eintrittskarten.", href: "/profile/my-tickets", icon: "T", accent: "blue" },
        { label: "Warenkorb", description: "Prüfe Reservierungen und schließe den Kauf ab.", href: "/profile/shopping-cart", icon: "W", accent: "green" },
        { label: "Einstellungen", description: "Aktualisiere deine persönlichen Daten und Adresse.", href: "/profile/settings", icon: "E", accent: "purple" },
    ];

    return (
        <ManagerPage>
                <div className="profile-dashboard">
                    <header className="profile-dashboard-intro">
                        <span>Willkommen zurück</span>
                        <h2>Was möchtest du heute erledigen?</h2>
                        <p>Alle wichtigen Bereiche für deine Events und Tickets auf einen Blick.</p>
                    </header>
                    <div className="profile-dashboard-grid">
                        {dashboardItems.map((item) => (
                            <Link key={item.href} className={`profile-dashboard-card accent-${item.accent}`} href={localized(item.href)}>
                                <span className="profile-dashboard-icon" aria-hidden="true">{item.icon}</span>
                                <div><h3>{item.label}</h3><p>{item.description}</p></div>
                                <span className="profile-dashboard-arrow" aria-hidden="true">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
        </ManagerPage>
    );
};

export default withAuth(Profile);
