"use client";

import { useState, useEffect } from "react";
import withAuth from "@hoc/withAuth";
import BasePage from "@/src/app/lib/templates/base_page";
import { useUserProfile } from "@firebase/useUserProfile";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { User } from "@entities/user";
import DefautButton from "@components/default/default_button";
import "@styles/forms/login_form.scss"
import "@styles/pages/settings.scss"
import LogoutButton from "@/src/app/lib/components/default/logout_button";
import ManagerPage from "@/src/app/lib/templates/manager_page";

const Profile = () => {
    const { authUser, userProfile, loading } = useUserProfile();
    const [isChanged, setIsChanged] = useState(false);
    const [message, setMessage] = useState("");
    const db = getFirestore();
    const [formData, setFormData] = useState<User | null>(null);

    useEffect(() => {
        if (userProfile) setFormData(userProfile.data as User);
    }, [userProfile]);

    if (loading) return <div>Loading...</div>;
    if (!formData) return <BasePage><div>No user profile found.</div></BasePage>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev!,
            [e.target.name]: e.target.value
        }));
        setIsChanged(true);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!isChanged) return setMessage("No changes to update.");
    
        try {
            const userRef = doc(db, "users", authUser!.uid);
            await updateDoc(userRef, { ...formData });
            setMessage("Profile updated successfully.");
            setIsChanged(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile.");
        }
    };

    return (
        <div className="main">
            <ManagerPage>
                <div className="settings-page">
                    <div className="form-background"></div>
                    <div className="form-content">
                        <div className="form-header"></div>
                        <div className="body">
                            <div className="step-content">
                                <form onSubmit={handleSubmit} className="profile-form">

                                    <div className="row">
                                        <div className="column">
                                            <div className="input-container">
                                                <label>Username</label>
                                                <input
                                                    name="username"
                                                    value={formData.username || ""}
                                                    onChange={handleChange}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="input-container">
                                                <label>Firstname</label>
                                                <input
                                                    name="firstname"
                                                    value={formData.firstname || ""}
                                                    onChange={handleChange}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="column">
                                            <div className="input-container">
                                                <label>Lastname</label>
                                                <input
                                                    name="lastname"
                                                    value={formData.lastname || ""}
                                                    onChange={handleChange}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="input-container">
                                                <label>Country</label>
                                                <input
                                                    name="country"
                                                    value={formData.country || ""}
                                                    onChange={handleChange}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="column">
                                            <div className="input-container">
                                                <label>Zip</label>
                                                <input
                                                    name="zip"
                                                    value={formData.zip || ""}
                                                    onChange={handleChange}
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="input-container">
                                                <label>City</label>
                                                <input
                                                    name="city"
                                                    value={formData.city || ""}
                                                    onChange={handleChange}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="column">
                                            <div className="input-container">
                                                <label>Street</label>
                                                <input
                                                    name="street"
                                                    value={formData.street || ""}
                                                    onChange={handleChange}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="column">
                                                <div className="input-container">
                                                    <label>Housenumber</label>
                                                    <input
                                                        name="housenumber"
                                                        value={formData.housenumber || ""}
                                                        onChange={handleChange}
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="column">
                                                <div className="input-container">
                                                    <label>Unit</label>
                                                    <input
                                                        name="unit"
                                                        value={formData.unit || ""}
                                                        onChange={handleChange}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    {message && <p>{message}</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="button-container">
                            <DefautButton type="submit" label="Submit" />
                        </div>
                    </div>
                </div>
            </ManagerPage>
        </div>
    );
};

export default withAuth(Profile);
