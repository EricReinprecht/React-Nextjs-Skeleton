import { ReactNode } from "react";
import Header from "../components/default/header";
import "../../../assets/styles/templates/manager_page.scss";
import LogoutButton from "../components/default/logout_button";
import Link from "next/link";

interface LayoutProps {
    children: ReactNode;
}

const ManagerPage = ({ children }: LayoutProps) => {
    return (
        <div className="manager_page-template">
            {/* <div className="background type-orange_gradient"></div> */}
            {/* <Header /> */}
            <div className="sidebar">
                <div className="content">
                    <div className="header"></div>
                    <div className="menu-items">
                        <div className="item"><Link href={"/profile/create-party"}>Neue Party erstellen</Link></div>
                        <div className="item"><Link href={"/profile/my-parties"}>Partys</Link></div>
                        <div className="item"><Link href={"/profile/settings"}>Einstellungen</Link></div>
                        <div className="item"><Link href={"/profile/cards"}>Karten</Link></div>
                        <div className="item">Option 5</div>
                        <div className="item">Option 6</div>
                        <div className="item">Option 7</div>
                    </div>
                </div>
                <div className="footer">
                    <div className="item settings">Einstellungen</div>
                    <div className="item logout"><LogoutButton disable_style={true}/></div>
                </div>
            </div>
            <main className="main gradient-animation"><div className="wave"></div>{children}</main>
        </div>
    );
};

export default ManagerPage;