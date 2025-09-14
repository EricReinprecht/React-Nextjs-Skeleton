import { ReactNode } from "react";
import Footer from "../components/default/footer";
import Header from "../components/default/header";
import "../../../assets/styles/templates/base_page.scss";

interface LayoutProps {
    children: ReactNode;
}

const BasePage = ({ children }: LayoutProps) => {
    return (
        <div className="base_page-template">
            <div className="background type-red_gradient"></div>
            <Header />
                <main className="master-main">{children}</main>
            <Footer />
        </div>
    );
};

export default BasePage;