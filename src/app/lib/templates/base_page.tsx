import { ReactNode, FC } from "react";
import "@styles/templates/base_page.scss";

interface LayoutProps {
    children: ReactNode;
    backgroundType?: string;
}

const BasePage: FC<LayoutProps> = ({ children, backgroundType = "default" }) => {
    return (
        <div className="base_page-template">
            <div className={`background type-${backgroundType}`}></div>
            <main className="main gradient-animation blue"><div className="wave"></div>{children}</main>
        </div>
    );
};

export default BasePage;