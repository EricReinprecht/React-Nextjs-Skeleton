"use client"

import withAuth from "@hoc/withAuth";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import "@styles/pages/profile.scss"
import Gear from "@svgs/gear";
import Link from "next/link";
import PartyIcon from "@/src/app/lib/svgs/myParties";
import CreateParty from "@/src/app/lib/svgs/create_party";

const Profile: React.FC = () => {
    return (
        <div className="main">
            <ManagerPage>
                <div className="grid-container">
                    <div className="grid">
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/my-parties"}><PartyIcon></PartyIcon></Link></div>
                        <div className="item"><Link href={"/profile/create-party"}><CreateParty></CreateParty></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                    </div>
                </div>
            </ManagerPage>
        </div>
    );
};

export default withAuth(Profile);