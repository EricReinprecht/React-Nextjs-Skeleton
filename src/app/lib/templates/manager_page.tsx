"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "@styles/templates/manager_page.scss";
import LogoutButton from "../components/default/logout_button";
import Link from "next/link";

interface LayoutProps {
    children: ReactNode;
}

const ManagerPage = ({ children }: LayoutProps) => {
    const pathname = usePathname();

    const menuItems = [
        { label: "Neue Party erstellen", href: "/profile/edit-party" },
        { label: "Partys", href: "/profile/my-parties" },
        { label: "Einstellungen", href: "/profile/settings" },
        { label: "Karten", href: "/profile/my-cards" },
        { label: "Warenkorb", href: "/profile/shopping-cart" },
        { label: "Option 6", href: "#" },
        { label: "Option 7", href: "#" },
    ];

    return (
        <div className="manager_page-template">
            {/* <div className="background type-orange_gradient"></div> */}
            {/* <Header /> */}
            <div className="sidebar">
                <div className="content">
                    <div className="header"></div>
                    <div className="menu-items">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`item${pathname === item.href ? " active" : ""}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="footer">
                    <div className="item settings">Einstellungen</div>
                    <div className="item logout"><LogoutButton disable_style={true}/></div>
                </div>
            </div>
            <main className="main gradient-animation red"><div className="wave"></div>{children}</main>
        </div>
    );
};

export default ManagerPage;