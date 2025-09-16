import { ReactNode } from "react";
import Header from "../components/default/header";
import "../../../assets/styles/templates/manager_page.scss";
import LogoutButton from "../components/default/logout_button";

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
                        <div className="item">Option 1</div>
                        <div className="item">Option 2</div>
                        <div className="item">Option 3</div>
                        <div className="item">Option 4</div>
                        <div className="item">Option 5</div>
                        <div className="item">Option 6</div>
                        <div className="item">Option 7</div>
                    </div>
                </div>
                <div className="footer">
                    <div className="item settings">Einnstellungen</div>
                    <div className="item logout"><LogoutButton disable_style={true}/></div>
                </div>
            </div>
            <main className="main">{children}</main>
        </div>
    );
};

export default ManagerPage;