"use client";

import { useState, useEffect } from "react";
import withAuth from "@hoc/withAuth";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import { createParty } from "@/src/app/lib/services/partyService";
import { Party } from "@/src/app/lib/entities/party";
import { useUserProfile } from "@firebase/useUserProfile";
import { UserEntity } from "@/src/app/lib/entities/user";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { User } from "@/src/app/lib/entities/user";
import 'flatpickr/dist/themes/material_blue.css';
import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import { uploadImagesToFirestore } from "@/src/app/lib/firebase/uploadImages";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Footer from "./footer";

const CreateParty = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const { authUser, loading } = useUserProfile();
    const [step, setStep] = useState<number>(1);


    const navigateToStep = (nextStep: number) => {
        if (nextStep >= 1 && nextStep <= 4) {
            setStep(nextStep);
        }
    };

    useEffect(() => {
    }, [step, imageFiles]);

    const [partyData, setPartyData] = useState<Party>({
        id: "",
        name: "",
        startDate: getNextDateTimeAt("friday", 18),
        endDate: getNextDateTimeAt("saturday", 3),
        location: "",
        latitude: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE ? Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE) : 0,
        longitude: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE ? Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE) : 0,
        description: "",
        teaser: "",
    });

    const [startDateOnly, setStartDateOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [startTimeOnly, setStartTimeOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [endDateOnly, setEndDateOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [endTimeOnly, setEndTimeOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                createdBy: authUser.uid,
                created: new Date(),
            };

            const partyId = await createParty(partyWithUser);

            if (!partyId) {
                alert("Failed to create party.");
                return;
            }

            const imageUrls = await uploadImagesToFirestore(imageFiles, partyId);

            if (imageUrls.length > 0) {
                const partyRef = doc(db, "parties", partyId);
                await updateDoc(partyRef, { imageUrls });
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

    return (
        <div className="main">
            <ManagerPage>
                <div className="create-party-wrapper">
                    <div className="create-party-container">
                        <div className="create-party-background"></div>
                        <div className="create-party-content">
                            <div className="steps">
                                <div onClick={() => navigateToStep(1)} className={`step basic-data ${step === 1 ? "active" : ""}`}>1</div>
                                <div className="step-seperator"></div>
                                <div onClick={() => navigateToStep(2)} className={`step exact-location ${step === 2 ? "active" : ""}`}>2</div>
                                <div className="step-seperator"></div>
                                <div onClick={() => navigateToStep(3)} className={`step additional-data ${step === 3 ? "active" : ""}`}>3</div>
                                <div className="step-seperator"></div>
                                <div onClick={() => navigateToStep(4)} className={`step submit ${step === 4 ? "active" : ""}`}>4</div>
                            </div>
                            <div className="body">
                                {step === 1 && 
                                    <Step1
                                        partyData={partyData}
                                        startDateOnly={startDateOnly}
                                        startTimeOnly={startTimeOnly}
                                        endDateOnly={endDateOnly}
                                        endTimeOnly={endTimeOnly}
                                        setPartyData={setPartyData}
                                        setStartDateOnly={setStartDateOnly}
                                        setStartTimeOnly={setStartTimeOnly}
                                        setEndDateOnly={setEndDateOnly}
                                        setEndTimeOnly={setEndTimeOnly}
                                        handleChange={handleChange}
                                    />
                                }
                                <div style={{ display: step === 2 ? "block" : "none" }}>
                                    <Step2
                                        partyData={partyData}
                                        setPartyData={setPartyData}
                                    />
                                </div>
                                <div style={{ display: step === 3 ? "block" : "none" }}>
                                    <Step3
                                        imageFiles={imageFiles}
                                        setImageFiles={setImageFiles}
                                        partyData={partyData}
                                        setPartyData={setPartyData}
                                        handleChange={handleChange}
                                    />
                                </div>
                                {step === 4 && 
                                <Step4
                                    partyData={partyData}
                                    imagePreviews={imageFiles.map(file => URL.createObjectURL(file))}
                                    // categories={yourResolvedCategories} // Optional
                                />
                                
                                }
                            </div>
                        </div>
                        <Footer
                            step={step}
                            navigateToStep={navigateToStep}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </ManagerPage>
        </div>
    );

    function combineDateAndTime(date: Date, time: Date): Date {
        const combined = new Date(date);
        combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return combined;
    }
};

export default withAuth(CreateParty);