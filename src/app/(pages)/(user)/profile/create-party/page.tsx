"use client";

import { useState, useEffect } from "react";
import withAuth from "@hoc/withAuth";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import DefautButton from "@components/default/default_button";
import { createParty } from "@/src/app/lib/services/partyService";
import { Party } from "@/src/app/lib/entities/party";
import { useUserProfile } from "@firebase/useUserProfile";
import { UserEntity } from "@/src/app/lib/entities/user";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { User } from "@/src/app/lib/entities/user";

const CreateParty = () => {
    const { authUser, loading } = useUserProfile();
    console.log("here", authUser);
    const [step, setStep] = useState<number>(1);

    const navigateToStep = (nextStep: number) => {
        if (nextStep >= 1 && nextStep <= 3) {
            console.log(nextStep)
            setStep(nextStep);
        }
    };

    const [partyData, setPartyData] = useState<Party>({
        name: "",
        date: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
        setPartyData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const db = getFirestore();
    const handleSubmit = async () => {
        if (!authUser) {
            alert("User not authenticated.");
            return;
        }

        try {
            const userRef = doc(db, "users", authUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                alert("User profile not found.");
                return;
            }

            const userData = userSnap.data() as User;
            const partyWithUser = {
                ...partyData,
                userId: authUser.uid,
            };

            const partyId = await createParty(partyWithUser);

            if (!partyId) {
                alert("Failed to create party.");
                return;
            }

            const userEntity = new UserEntity(userData);
            userEntity.addCreatedParty(partyId);

            await updateDoc(userRef, {
                createdParties: userEntity.toJSON().createdParties,
            });

            alert(`Party created with ID: ${partyId}`);
            setStep(1);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the party.");
        }
    };

    const formSchema = [
        { name: "name", label: "Party Name", type: "text", placeholder: "Enter party name", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "location", label: "Location", type: "text", placeholder: "Enter location", required: false },
    ];

    return (
        <div className="main">
            <ManagerPage>
                <div className="create-party-container">
                    <div className="steps">
                        <div onClick={() => navigateToStep(1)} className={`step basic-data ${step === 1 ? "active" : ""}`}>1</div>
                        <div className="step-seperator"></div>
                        <div onClick={() => navigateToStep(2)} className={`step preview ${step === 2 ? "active" : ""}`}>2</div>
                        <div className="step-seperator"></div>
                        <div onClick={() => navigateToStep(3)} className={`step submit ${step === 3 ? "active" : ""}`}>3</div>
                    </div>
                    <div className="body">
                        {step === 1 && 
                            <div className="step-content basic-data">
                                <form className="party-form">
                                    {formSchema.map(({ name, label, type, placeholder, required }) => {
                                        const value = partyData[name as keyof Party];
                                        if (typeof value !== "string" && typeof value !== "number") return null;
                                        return (
                                            <div className="form-group" key={name}>
                                                <label htmlFor={name}>{label}</label>
                                                <input
                                                    id={name}
                                                    name={name}
                                                    type={type}
                                                    value={value}
                                                    onChange={handleChange}
                                                    placeholder={placeholder}
                                                    required={required}
                                                />
                                            </div>
                                        );
                                    })}
                                </form>
                            </div>
                        }
                        {step === 2 && 
                            <div className="step-content preview">ACAB</div>
                        }
                        {step === 3 && 
                            <div className="step-content preview">
                                <DefautButton
                                    label="Submit"
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    styles={{
                                        bgColor: "submit_green",
                                        textColor: "white",
                                        borderColor: "submit_green",
                                        hoverBgColor: "white",
                                        hoverTextColor: "submit_green",
                                        hoverBorderColor: "submit_green"
                                    }}
                                />
                            </div>
                        }
                    </div>

                    <div className="footer">
                        <DefautButton
                            label="Prev"
                            type="button"
                            onClick={() => navigateToStep(step - 1)}
                            styles={{
                                bgColor: "black",
                                textColor: "white",
                                borderColor: "black",
                                hoverBgColor: "white",
                                hoverTextColor: "black",
                                hoverBorderColor: "black"
                            }}
                        />
                        <DefautButton
                            label="Next"
                            type="button"
                            onClick={() => navigateToStep(step + 1)}
                            styles={{
                                bgColor: "black",
                                textColor: "white",
                                borderColor: "black",
                                hoverBgColor: "white",
                                hoverTextColor: "black",
                                hoverBorderColor: "black"
                            }}
                        />
                    </div>
                </div>
            </ManagerPage>
        </div>
    );
};

export default withAuth(CreateParty);