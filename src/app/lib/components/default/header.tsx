import "@styles/components/header.scss";
import Link from "next/link";

import { Profile } from "@svgs";
import { getAuthUser } from "@utils/getAuthUser";

interface HeaderProps {
  messages: Record<string, string>;
}

export default async function Header({ messages }: HeaderProps) {
    const user = await getAuthUser();

    return (
        <header>
            <div className="left">
                <Link href="/" className="logo">
                    <img src="/logo.png" style={{ height: "70px", width: "auto" }} />
                    <div className="text">Pfautec</div>
                </Link>
            </div>

            <div className="header-inner">
                <Link href="/browse" className="nav-item-outer">
                    <div className="nav-item">{messages.browse}</div>
                </Link>

                {user && (
                    <>
                        <Link href="/profile/my-tickets" className="nav-item-outer"><div className="nav-item">{messages.my_cards}</div></Link>
                        <Link href="/profile/my-parties" className="nav-item-outer"><div className="nav-item">{messages.my_parties}</div></Link>
                        <Link href="/profile/create-party" className="nav-item-outer"><div className="nav-item">{messages.create_new_party}</div></Link>
                        <Link href="/profile/settings" className="nav-item-outer"><div className="nav-item">{messages.settings}</div></Link>
                    </>
                )}
            </div>

            <div className="right">
                <Link href="/profile" className="nav-item-outer">
                    <div className="nav-item">
                        <Profile width={40} height={40} color="white" border_color="white" />
                    </div>
                </Link>
            </div>
        </header>
    );
}
