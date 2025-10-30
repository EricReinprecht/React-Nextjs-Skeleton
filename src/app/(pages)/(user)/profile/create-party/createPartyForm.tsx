"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

import Step1 from "@components/party/form/step1";
import Step2 from "@components/party/form/step2";
import Step3 from "@components/party/form/step3";
import Step4 from "@components/party/form/step4";
import Step_Final from "@/src/app/lib/components/party/form/step_final";
import Footer from "@components/party/form/footer";
import Loader from "@/src/app/lib/components/default/loader";
import DefaultButton from "@/src/app/lib/components/default/default_button";
import withAuth from "@/src/app/lib/hoc/withAuth";

import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import { filesToBase64 } from "@/src/app/lib/utils/filesToBase64";
import { Category } from "@/src/app/lib/entities/category";
import { Party } from "@prisma/client";

import "@styles/pages/create-party.scss";

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

    const [partyData, setPartyData] = useState<Party>({
        id: "",
        name: "",
        location: "",
        description: "",
        teaser: "",
        latitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE ?? 0),
        longitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE ?? 0),
        startDate: getNextDateTimeAt("friday", 18),
        endDate: getNextDateTimeAt("saturday", 3),
        created: new Date(),
        userId: authUser.id,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/partyCategory/get");
                if (!res.ok) throw new Error("Failed to fetch categories");
                const categories: Category[] = await res.json();
                setAllCategories(categories);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    const navigateToStep = (nextStep: number) => {
        if (nextStep >= 1 && nextStep <= 5) setStep(nextStep);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPartyData((prev) => ({ ...prev, [name]: value }));
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

            selectedCategories.forEach((cat) => {
                if (cat.id) formData.append("categories", cat.id);
            });
            imageFiles.forEach((file) => formData.append("images", file));

            const res = await fetch("/api/party/create", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to create party");

            const { partyId } = data;
            setCreatedPartyId(partyId);

            

            if (imageFiles.length > 0) {
                const base64Images = await filesToBase64(imageFiles);
                const res2 = await fetch("/api/image/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ partyId, images: base64Images }),
                });

                if (!res2.ok) {
                    console.warn("Image upload failed", await res2.text());
                }
            }

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
        setStep(1);
        setCreating(false);
        setShowSuccess(false);
        setCreatedPartyId("");
        setImageFiles([]);
        setSelectedCategories([]);
    };

    const viewParty = () => {
        if (createdPartyId) window.location.href = `/party/${createdPartyId}`;
    };

    return (
        <div className="create-party-wrapper">
            <div
                className="create-party-container"
                style={showSuccess ? { minHeight: "unset" } : {}}
            >
                <div className="create-party-background" />

                {!creating && !showSuccess && (
                    <>
                        <div className="create-party-content">
                            <div className="steps">
                                {[1,2,3,4,5].map(n => (
                                    <React.Fragment key={n}>
                                        <div onClick={() => navigateToStep(n)} className={`step ${n===1?"basic-data":n===2?"exact-location":n===3?"additional-data":"submit"} ${step===n?"active":""}`}>{n}</div>
                                        {n<5 && <div className="step-seperator"></div>}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="body">
                                {step === 1 && (
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
                                )}
                                {step === 2 && (
                                    <Step2 
                                        partyData={partyData} 
                                        setPartyData={setPartyData} 
                                    />
                                )}
                                {step === 3 && (
                                    <Step3
                                        imageFiles={imageFiles}
                                        setImageFiles={setImageFiles}
                                        partyData={partyData}
                                        setPartyData={setPartyData}
                                        handleChange={handleChange}
                                    />
                                )}
                                {step === 4 && (
                                    <Step4
                                        allCategories={allCategories}
                                        selectedCategories={selectedCategories}
                                        setSelectedCategories={setSelectedCategories}
                                    />
                                )}
                                {step === 5 && (
                                    <Step_Final
                                        partyData={partyData}
                                        imagePreviews={imageFiles.map((file) =>
                                            URL.createObjectURL(file)
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                        <Footer step={step} navigateToStep={navigateToStep} onSubmit={handleSubmit} />
                    </>
                )}

                {creating && (
                    <div className="loader-wrapper">
                        <Loader type="rgb-lettering" content="Creating Party..." />
                    </div>
                )}

                {showSuccess && (
                    <div className="success-message-wrapper">
                        <div className="success-message">
                            <Loader type="rgb-lettering" content="Successfully created party!" />
                        </div>
                        <div className="operations">
                            <DefaultButton
                                label="Create Another"
                                type="button"
                                onClick={resetForm}
                                styles={{
                                    bgColor: "black",
                                    textColor: "white",
                                    borderColor: "black",
                                    hoverBgColor: "white",
                                    hoverTextColor: "black",
                                    hoverBorderColor: "black",
                                }}
                            />
                            <DefaultButton
                                label="View Party"
                                type="button"
                                onClick={viewParty}
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
                )}
            </div>
        </div>
    );
};

export default withAuth(CreatePartyForm);
