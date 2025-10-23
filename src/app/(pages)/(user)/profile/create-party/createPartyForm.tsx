"use client";

import { useState, useEffect } from "react";
import Step1 from "@components/party/form/step1";
import Step2 from "@components/party/form/step2";
import Step3 from "@components/party/form/step3";
import Step4 from "@components/party/form/step4";
import Step_Final from "@/src/app/lib/components/party/form/step_final";
import Footer from "@components/party/form/footer";
import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import { Category } from "@/src/app/lib/entities/category";
import Loader from "@/src/app/lib/components/default/loader";
import DefautButton from "@/src/app/lib/components/default/default_button";
import withAuth from "@/src/app/lib/hoc/withAuth";
import"@styles/pages/create-party.scss";
import { getAuthUser } from "@/src/app/lib/utils/getAuthUser";
import { filesToBase64 } from "@/src/app/lib/utils/filesToBase64";

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

interface Props {
    authUser: { id: string; email: string; username: string };
}

const CreatePartyForm = ({ authUser }: Props) => {
    const [step, setStep] = useState(1);
    const [creating, setCreating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdPartyId, setCreatedPartyId] = useState("");
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [startDateOnly, setStartDateOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [startTimeOnly, setStartTimeOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [endDateOnly, setEndDateOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [endTimeOnly, setEndTimeOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));

    const [partyData, setPartyData] = useState<PartyFormData>({
        name: "",
        location: "",
        latitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE ?? 0),
        longitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE ?? 0),
        startDate: getNextDateTimeAt("friday", 18),
        endDate: getNextDateTimeAt("saturday", 3),
        description: "",
        teaser: "",
    });

    useEffect(() => {
        async function fetchCategoriesData() {
            const res = await fetch("/api/partyCategory/get");
            const categories = await res.json();
            setAllCategories(categories);
        }
        fetchCategoriesData();
    }, []);

    const navigateToStep = (nextStep: number) => {
        if (nextStep >= 1 && nextStep <= 5) setStep(nextStep);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPartyData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setCreating(true);
        try {
            const formData = new FormData();
            formData.append("createdBy", authUser.id);
            formData.append("name", partyData.name);
            formData.append("location", partyData.location);
            formData.append("latitude", partyData.latitude.toString());
            formData.append("longitude", partyData.longitude.toString());
            formData.append("startDate", partyData.startDate.toISOString());
            formData.append("endDate", partyData.endDate.toISOString());
            formData.append("description", partyData.description);
            formData.append("teaser", partyData.teaser);

            selectedCategories.forEach(cat => formData.append("categories", cat.id!));
            imageFiles.forEach(file => formData.append("images", file));

            const res = await fetch("/api/party/create", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            const partyId = data.partyId;
            
            const base64Images = await filesToBase64(imageFiles);

            const res2 = await fetch("/api/image/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ partyId, images: base64Images }),
            });

            const data2 = await res2.json();
            console.log(data2)

            if (!res.ok) throw new Error(data.message || "Failed to create party");

            setCreatedPartyId(data.partyId);
            setShowSuccess(true);
            setStep(1);
        } catch (err) {
            console.error(err);
            alert("An error occurred while creating the party.");
        } finally {
            setCreating(false);
        }
    };

    const resetForm = () => {
        setCreating(false);
        setShowSuccess(false);
        setStep(1);
        setCreatedPartyId("");
    };

    const viewParty = () => {
        window.location.href = `/party/${createdPartyId}`;
    };

    return (
        <div>
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
                                        {/* <div className="step-seperator"></div>
                                        <div onClick={() => navigateToStep(6)} className={`step submit ${step === 6 ? "active" : ""}`}>6</div> */}
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
                                            <Step_Final
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
        </div>
    );
}

export default withAuth(CreatePartyForm);