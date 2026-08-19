import '@styles/templates/checkout_page.scss';
import { FC, ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    backgroundType?: string;
}

const CheckoutPage: FC<LayoutProps> = ({ children, backgroundType = 'default' }) => {
    return (
        <div className="checkout_page-template">
            <div className={`background type-${backgroundType}`}></div>
            <main className="main">{children}</main>
        </div>
    );
};

export default CheckoutPage;
