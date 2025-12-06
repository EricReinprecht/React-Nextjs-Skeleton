import { ReactNode, FC } from "react";
import "@styles/templates/checkout_page.scss";

interface LayoutProps {
    children: ReactNode;
    backgroundType?: string;
}

const CheckoutPage: FC<LayoutProps> = ({ children, backgroundType = "default" }) => {
    return (
        <div className="checkout_page-template">
            <div className={`background type-${backgroundType}`}></div>
            <main className="main gradient-animation green"><div className="wave"></div>{children}</main>
        </div>
    );
};

export default CheckoutPage;