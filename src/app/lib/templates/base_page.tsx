import { ReactNode, FC } from "react";
import Footer from "../components/default/footer";
import Header from "../components/default/header";
import "@styles/templates/base_page.scss";

interface LayoutProps {
    children: ReactNode;
    backgroundType?: string;
}

const BasePage: FC<LayoutProps> = ({ children, backgroundType = "default" }) => {
    return (
        <div className="base_page-template">
            <div className={`background type-${backgroundType}`}></div>
            <main className="master-main">{children}</main>
        </div>
    );
};

export default BasePage;