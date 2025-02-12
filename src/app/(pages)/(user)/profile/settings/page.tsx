"use client"

import withAuth from "@hoc/withAuth";
import BasePage from "@/src/app/lib/templates/base_page";
import "@styles/pages/profile.scss"
import Gear from "@svgs/gear";

const Profile: React.FC = () => {
    return (
        <div className="main">
            <BasePage>
                <div className="grid-container">
                    <div className="grid">
                        <div className="item"><Gear></Gear></div>
                        <div className="item"><Gear></Gear></div>
                        <div className="item"><Gear></Gear></div>
                        <div className="item"><Gear></Gear></div>
                        <div className="item"><Gear></Gear></div>
                        <div className="item"><Gear></Gear></div>
                    </div>
                </div>
            </BasePage>
        </div>
    );
};

export default withAuth(Profile);