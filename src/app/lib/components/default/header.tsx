import "@styles/components/header.scss";
import Link from "next/link";

import React from "react";
import Profile from "../../svgs/profile";
import { getAuthUser } from "../../utils/getAuthUser";

const Header: React.FC = async () => {

    const user = await getAuthUser();

    return (
        <header>
            <div className="left">
                <Link href="/" className="logo"><img src={"/logo.png"} style={{ height: "70px", width: "auto" }}/><div className="text">Pfautec</div></Link>
            </div>

            <div className="header-inner">
                <Link href="/browse" className="nav-item-outer"><div className="nav-item">Stöbern</div></Link>
                {user && (
                    <>
                        <Link href="/profile/my-cards" className="nav-item-outer"><div className="nav-item">Meine Karten</div></Link>
                        <Link href="/profile/my-parties" className="nav-item-outer"><div className="nav-item">Meine Partys</div></Link>
                        <Link href="/profile/create-party" className="nav-item-outer"><div className="nav-item">Neue Party erstellen</div></Link>
                        <Link href="/profile/settings" className="nav-item-outer"><div className="nav-item">Einstellungen</div></Link>
                    </>
                )}
            </div>

            <div className="right">
                <Link href="/profile" className="nav-item-outer"><div className="nav-item"><Profile width={40} height={40} color="white" border_color="white"/></div></Link>
            </div>
        </header>
    );
};

export default Header;