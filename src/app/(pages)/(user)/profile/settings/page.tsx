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
            <BasePage>
                <div className="settings-page">
                    <div className="form-container">
                        <form onSubmit={handleSubmit} className="profile-form">
                            {["username", "firstname", "lastname", "country", "zip", "city", "street", "housenumber", "unit"].map((field) => (
                                (formData as Record<string, any>)[field] !== undefined && (
                                    <div className="input-container" key={field}>
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <input 
                                            name={field} 
                                            value={(formData as Record<string, any>)[field]} 
                                            onChange={handleChange} 
                                            type={field === "zip" || field === "housenumber" ? "number" : "text"} 
                                        />
                                    </div>
                                )
                            ))}
                            <div className="button-container">
                                <DefautButton type="submit" label="Submit" />
                            </div>
                            {message && <p>{message}</p>}
                        </form>
                    </div>
                    <div className="logout-container">
                        <div className="button-container">
                            <LogoutButton/>
                        </div>
                    </div>
                </div>
            </BasePage>
        </div>
    );
};

export default withAuth(Profile);
