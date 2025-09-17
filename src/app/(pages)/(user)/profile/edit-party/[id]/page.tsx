"use client";

import { useState, useEffect, use } from "react";
import withAuth from "@hoc/withAuth";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import { createParty } from "@/src/app/lib/services/partyService";
import { Party } from "@/src/app/lib/entities/party";
import { useUserProfile } from "@firebase/useUserProfile";
import { UserEntity } from "@/src/app/lib/entities/user";
import { getFirestore, doc, updateDoc, getDoc, DocumentReference } from "firebase/firestore";
import { User } from "@/src/app/lib/entities/user";
import 'flatpickr/dist/themes/material_blue.css';
import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import { uploadImagesToFirestore } from "@/src/app/lib/firebase/uploadImages";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Footer from "./footer";
import Step5 from "./step5";
import { Category } from "@/src/app/lib/entities/category";
import { getCategories } from "@/src/app/lib/services/categoryService"; 
import Loader from "@/src/app/lib/components/default/loader";
import DefautButton from "@/src/app/lib/components/default/default_button";

interface Props {
    params: Promise<{ id: string }>;
}

const EditParty: React.FC<Props> = ({ params }) => {
    const { id } = use(params);
    const db = getFirestore();


    const { authUser, loading } = useUserProfile();

    const [loadingData, setLoadingData] = useState(true);
    const [partyData, setPartyData] = useState<any>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [step, setStep] = useState(1);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [creating, setCreating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const categoryRefs: DocumentReference[] = selectedCategories
        .filter((category) => category.id)
        .map((category) =>
        doc(db, "categories", category.id!)
    );

    const [startDateOnly, setStartDateOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [startTimeOnly, setStartTimeOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [endDateOnly, setEndDateOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [endTimeOnly, setEndTimeOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [createdPartyId, setCreatedPartyId] = useState<string>("");

    const navigateToStep = (nextStep: number) => {
        if (nextStep >= 1 && nextStep <= 5) {
            setStep(nextStep);
        }
    };

    // *************************************************************************************************
    // * HOOKS START
    // *************************************************************************************************
    useEffect(() => {
    }, [step, imageFiles]);

    useEffect(() => {
        async function fetchParty() {
            setLoadingData(true);
            try {
                const partyRef = doc(db, "parties", id);
                const partySnap = await getDoc(partyRef);
                if (partySnap.exists()) {
                    setPartyData({ id: partySnap.id, ...partySnap.data() } as Party);
                } else {
                    console.error("Party not found");
                }
            } catch (error) {
                console.error("Error fetching party:", error);
            } finally {
                setLoadingData(false);
            }
        }
        fetchParty();
    }, [id]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categories = await getCategories();
                setAllCategories(categories);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        }
        fetchCategories();
    }, []);
    // *************************************************************************************************
    // * HOOKS END
    // *************************************************************************************************

    if (loadingData) return <div>Loading...</div>;
    if (!partyData) return <div>Party not found</div>;

    // *************************************************************************************************
    // * FUNCTIONS START
    // *************************************************************************************************
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
        setPartyData((prev: Party) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!authUser) {
            alert("User not authenticated.");
            return;
        }

        setCreating(true);

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
                categories: categoryRefs,
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

            setCreatedPartyId(partyId);
            setCreating(false);
            setShowSuccess(true);
            setStep(1);
 
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the party.");
        }
    };

    const resetForm = () => {
        setCreating(false);
        setShowSuccess(false);
        setStep(1);
        setCreatedPartyId("");
    }

    const viewParty = () => {
        window.location.href = window.location.origin + "/party/" + createdPartyId;
    }
    // *************************************************************************************************
    // * FUNCTIONS END
    // *************************************************************************************************

    return (
        <div className="main">
            <ManagerPage>
                <div className="create-party-wrapper">
                    <div className="create-party-container" style={showSuccess ? { minHeight: "unset" } : {}}>
                        <div className="create-party-background"></div>
                        {creating === false && showSuccess === false &&
                            <>
                                <div className="create-party-content">
                                    <div className="steps">
                                        <div onClick={() => navigateToStep(1)} className={`step basic-data ${step === 1 ? "active" : ""}`}>1</div>
                                        <div className="step-seperator"></div>
                                        <div onClick={() => navigateToStep(2)} className={`step exact-location ${step === 2 ? "active" : ""}`}>2</div>
                                        <div className="step-seperator"></div>
                                        <div onClick={() => navigateToStep(3)} className={`step additional-data ${step === 3 ? "active" : ""}`}>3</div>
                                        <div className="step-seperator"></div>
                                        <div onClick={() => navigateToStep(4)} className={`step submit ${step === 4 ? "active" : ""}`}>4</div>
                                        <div className="step-seperator"></div>
                                        <div onClick={() => navigateToStep(5)} className={`step submit ${step === 5 ? "active" : ""}`}>5</div>
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
                                        {step ===4 && 
                                            <Step4
                                                allCategories={allCategories}
                                                selectedCategories={selectedCategories}
                                                setSelectedCategories={setSelectedCategories}
                                            />
                                        }
                                        {step === 5 && 
                                            <Step5
                                                partyData={partyData}
                                                imagePreviews={imageFiles.map(file => URL.createObjectURL(file))}
                                                // categories={yourResolvedCategories} // Optional
                                            />
                                        }
                                    </div>
                                    <Footer
                                        step={step}
                                        navigateToStep={navigateToStep}
                                        onSubmit={handleSubmit}
                                    />
                                </div>
                            </>
                        }
                        {creating && 
                            <div className="loader-wrapper">
                                <Loader type="rgb-lettering" content="Creating Party..."/>
                            </div>
                        }
                        {showSuccess && 
                            <div className="success-message-wrapper">
                                <div className="success-message">
                                    <Loader type="rgb-lettering" content="Successfully created party!"></Loader>
                                </div>
                                <div className="operations">
                                    <DefautButton
                                        label="Create Party"
                                        type="button"
                                        onClick={() => resetForm()}
                                        styles={{
                                            bgColor: "black",
                                            textColor: "white",
                                            borderColor: "black",
                                            hoverBgColor: "white",
                                            hoverTextColor: "black",
                                            hoverBorderColor: "black",
                                        }}
                                    />

                                    <DefautButton
                                        label="View Party"
                                        type="button"
                                        onClick={() => viewParty()}
                                        styles={{
                                            bgColor: "black",
                                            textColor: "white",
                                            borderColor: "black",
                                            hoverBgColor: "white",
                                            hoverTextColor: "black",
                                            hoverBorderColor: "black",
                                        }}
                                    />
                                </div>
                            </div>
                        }
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

export default withAuth(EditParty);