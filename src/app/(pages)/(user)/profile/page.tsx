"use client"

import withAuth from "@hoc/withAuth";
import BasePage from "@/src/app/lib/templates/base_page";
import "@styles/pages/profile.scss"
import Gear from "@svgs/gear";
import Link from "next/link";

const Profile: React.FC = () => {
    return (
        <div className="main">
            <BasePage>
                <div className="grid-container">
                    <div className="grid">
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                    </div>
                </div>
            </BasePage>
        </div>
    );
};

export default withAuth(Profile);