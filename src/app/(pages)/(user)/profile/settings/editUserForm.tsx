"use client";

import { useState, useEffect } from "react";
import DefautButton from "@/src/app/lib/components/default/default_button";
import withAuth from "@/src/app/lib/hoc/withAuth";
import"@styles/pages/create-party.scss";
import { User } from "@prisma/client";

interface PartyFormData {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    startDate: Date;
    endDate: Date;
    description: string;
    teaser: string;
}

interface EditUserFormProps {
  authUser: User;
}

const EditUserForm = ({ authUser }: EditUserFormProps) => {
    console.log(authUser.firstname)
    const [formData, setFormData] = useState<User | null>(null);
    const [isChanged, setIsChanged] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : prev);
        setIsChanged(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChanged) return setMessage("No changes to update.");


        try {
            const res = await fetch(`/api/user/${authUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update profile");
            setMessage("Profile updated successfully.");
            setIsChanged(false);
        } catch (err) {
            console.error(err);
            setMessage("Failed to update profile.");
        }
    };
    

    return (
        <div className="settings-page">
            <div className="form-background"></div>
            <div className="form-content">
                <div className="body">
                    <form onSubmit={handleSubmit} className="profile-form">
                        {/* Username / Firstname / Lastname */}
                        <div className="row">
                            <div className="column">
                                <label>Username</label>
                                <input
                                    name="username"
                                    value={authUser.username || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                            <div className="column">
                                <label>Firstname</label>
                                <input
                                    name="firstname"
                                    value={authUser.firstname || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                            <div className="column">
                                <label>Lastname</label>
                                <input
                                    name="lastname"
                                    value={authUser.lastname || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="row">
                            <div className="column">
                                <label>Country</label>
                                <input
                                    name="country"
                                    value={authUser.country || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                            <div className="column">
                                <label>City</label>
                                <input
                                    name="city"
                                    value={authUser.city || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                            <div className="column">
                                <label>Zip</label>
                                <input
                                    name="zip"
                                    value={authUser.zip || ""}
                                    onChange={handleChange}
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="column">
                                <label>Street</label>
                                <input
                                    name="street"
                                    value={authUser.street || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                            <div className="column">
                                <label>Housenumber</label>
                                <input
                                    name="housenumber"
                                    value={authUser.housenumber || ""}
                                    onChange={handleChange}
                                    type="number"
                                />
                            </div>
                            <div className="column">
                                <label>Unit</label>
                                <input
                                    name="unit"
                                    value={authUser.unit || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                        </div>

                        {message && <p>{message}</p>}

                        <div className="button-container">
                            <DefautButton type="submit" label="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default withAuth(EditUserForm);