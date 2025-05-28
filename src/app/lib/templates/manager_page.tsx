import { ReactNode } from "react";
import Header from "../components/default/header";
import "../../../assets/styles/templates/base_page.scss";

interface LayoutProps {
    children: ReactNode;
}

const ManagerPage = ({ children }: LayoutProps) => {
    return (
        <div className="base_page-template">
            <Header />
            <main className="main">{children}</main>
        </div>
    );
};

export default ManagerPage;