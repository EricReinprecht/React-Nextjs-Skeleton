"use client"

import Link from "next/link";

import { MyParties, CreateParty, Gear } from "@svgs";
import { ManagerPage } from "@templates";
import withAuth from "@hoc/withAuth";

import "@styles/pages/profile.scss"


const Profile: React.FC = () => {
    return (
        <div className="main">
            <ManagerPage>
                <div className="grid-container">
                    <div className="grid">
                        <div className="item"><Link href={"/profile/settings"}><Gear></Gear></Link></div>
                        <div className="item"><Link href={"/profile/my-parties"}><MyParties></MyParties></Link></div>
                        <div className="item"><Link href={"/profile/edit-party"}><CreateParty></CreateParty></Link></div>
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