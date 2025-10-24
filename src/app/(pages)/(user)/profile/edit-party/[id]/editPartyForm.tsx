"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
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
import { Party } from "@prisma/client";

type PartyWithImages = Party & {
    images: { id: string; filename: string; partyId: string }[];
    imageUrls?: string[];
    categories: { id: string; name: string; active: boolean }[];
};

interface Props {
    authUser: { id: string };
}

const EditPartyForm = ({ authUser }: Props) => {
    const params = useParams();
    const partyId = params?.id;
    if (!partyId) return <ManagerPage><div>Invalid party ID</div></ManagerPage>;

    const [partyData, setPartyData] = useState<Party | null>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [step, setStep] = useState(1);
    const [creating, setCreating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdPartyId, setCreatedPartyId] = useState<string>("");

    const [startDateOnly, setStartDateOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [startTimeOnly, setStartTimeOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [endDateOnly, setEndDateOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [endTimeOnly, setEndTimeOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));

    useEffect(() => {
        async function fetchParty() {
            try {
                const res = await fetch(`/api/party/${partyId}`);
                if (!res.ok) throw new Error("Failed to fetch party");
                const data: PartyWithImages = await res.json();
                setPartyData(data);

                setSelectedCategories(data.categories || []);

                const files: File[] = await Promise.all(
                    (data.images || []).map(async (img, idx) => {
                        const url = `/uploads/${partyId}/${img.filename}`;
                        const resp = await fetch(url);
                        const blob = await resp.blob();
                        return new File([blob], `image-${idx}.jpg`, { type: blob.type });
                    })
                );
                setImageFiles(files);
            } catch (err) {
                console.error(err);
            }
        }
        fetchParty();
    }, [partyId]);

    useEffect(() => {
        if (partyData) console.log("Updated state:", partyData);
    }, [partyData]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/partyCategory/get");
                const data = await res.json();
                setAllCategories(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchCategories();
    }, []);

    const navigateToStep = (nextStep: number) => {
        if (nextStep >= 1 && nextStep <= 5) setStep(nextStep);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPartyData(prev => prev ? { ...prev, [name]: value } : prev);
    };

    const handleSubmit = async () => {
        if (!partyData) return;
        setCreating(true);

        try {
            const startDateTime = new Date(startDateOnly);
            startDateTime.setHours(startTimeOnly.getHours(), startTimeOnly.getMinutes());

            const endDateTime = new Date(endDateOnly);
            endDateTime.setHours(endTimeOnly.getHours(), endTimeOnly.getMinutes());

            const formData = new FormData();
            formData.append("id", partyData.id);
            formData.append("name", partyData.name);
            formData.append("location", partyData.location);
            formData.append("latitude", partyData.latitude.toString());
            formData.append("longitude", partyData.longitude.toString());
            formData.append("startDate", startDateTime.toISOString());
            formData.append("endDate", endDateTime.toISOString());
            formData.append("description", partyData.description);
            formData.append("teaser", partyData.teaser);
            formData.append("createdBy", authUser.id);

            selectedCategories.forEach(cat => formData.append("categories", cat.id!));
            imageFiles.forEach(file => formData.append("images", file));

            const res = await fetch(`/api/party/edit/${partyId}`, {
                method: "PUT",
                body: formData,
            });
            console.log(res)

            if (!res.ok) throw new Error("Failed to update party");
            const data = await res.json();
            setCreatedPartyId(data.partyId);
            setShowSuccess(true);
        } catch (err) {
            console.error(err);
            alert("Error updating party");
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

    const viewParty = () => window.location.href = `/party/${createdPartyId}`;

    if (!partyData) return <Loader type="rgb-lettering" content="Loading party..." />;

    return (
        <div>
            <div className="create-party-wrapper">
                <div className="create-party-container" style={showSuccess ? { minHeight: "unset" } : {}}>
                    <div className="create-party-background"></div>

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
                                    {step===2 && 
                                        <Step2 
                                            partyData={partyData} 
                                            setPartyData={setPartyData}
                                        />
                                    }
                                    {step===3 && 
                                        <Step3 
                                            partyData={partyData} 
                                            setPartyData={setPartyData} 
                                            imageFiles={imageFiles} 
                                            setImageFiles={setImageFiles} 
                                            handleChange={handleChange} 
                                        />}
                                    {step===4 && 
                                        <Step4 
                                            allCategories={allCategories} 
                                            selectedCategories={selectedCategories} 
                                            setSelectedCategories={setSelectedCategories} 
                                        />
                                        }
                                    {step===5 && 
                                        <Step_Final 
                                            partyData={partyData} 
                                            imagePreviews={imageFiles.map(f => URL.createObjectURL(f))} 
                                        />
                                    }
                                </div>
                            </div>
                            <Footer step={step} navigateToStep={navigateToStep} onSubmit={handleSubmit} />
                        </>
                    )}

                    {creating && <Loader type="rgb-lettering" content="Updating Party..." />}
                    {showSuccess && (
                        <div className="success-message-wrapper">
                            <div className="success-message"><Loader type="rgb-lettering" content="Successfully updated party!" /></div>
                            <div className="operations">
                                <DefautButton label="Edit Another" type="button" onClick={resetForm} styles={{ bgColor:"black", textColor:"white", borderColor:"black", hoverBgColor:"white", hoverTextColor:"black", hoverBorderColor:"black" }} />
                                <DefautButton label="View Party" type="button" onClick={viewParty} styles={{ bgColor:"black", textColor:"white", borderColor:"black", hoverBgColor:"white", hoverTextColor:"black", hoverBorderColor:"black" }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default withAuth(EditPartyForm);