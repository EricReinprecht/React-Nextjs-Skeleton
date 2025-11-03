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
import { ImageItem } from "@types_ts/ImageItemType";
import Footer from "@components/party/form/footer";
import Loader from "@/src/app/lib/components/default/loader";
import withAuth from "@/src/app/lib/hoc/withAuth";
import MultiImageUploader from "@/src/app/lib/components/default/multi_image_uploader";
import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import { filesToBase64 } from "@/src/app/lib/utils/filesToBase64";

import { Party } from "@prisma/client";
import { Category } from "@/src/app/lib/entities/category";

type PartyWithImages = Party & {
    images: { id: string; filename: string; partyId: string; path: string }[];
    imageUrls?: string[];
    categories: { id: string; name: string; active: boolean }[];
};



interface Props {
    authUser: { id: string };
}

const EditPartyForm = ({ authUser }: Props) => {
    const params = useParams();
    const partyId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    if (!partyId) return <ManagerPage><div>Invalid party ID</div></ManagerPage>;

    const [partyData, setPartyData] = useState<PartyWithImages>();
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [step, setStep] = useState(1);
    const [creating, setCreating] = useState(false);

    const [startDateOnly, setStartDateOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [startTimeOnly, setStartTimeOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [endDateOnly, setEndDateOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [endTimeOnly, setEndTimeOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));

    const [oldImages, setOldImages] = useState<ImageItem[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);

    useEffect(() => {
        const fetchParty = async () => {
            try {
                const res = await fetch(`/api/party/${partyId}/get`);
                if (!res.ok) throw new Error("Failed to fetch party");
                const data: PartyWithImages = await res.json();
                setPartyData(data);
                setSelectedCategories(data.categories || []);

                if (data.startDate) {
                    const start = new Date(data.startDate);
                    setStartDateOnly(start);
                    setStartTimeOnly(start);
                }
                if (data.endDate) {
                    const end = new Date(data.endDate);
                    setEndDateOnly(end);
                    setEndTimeOnly(end);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchParty();
    }, [partyId]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/partyCategory/get");
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();
                setAllCategories(data);
            } catch (err) {
                console.error(err);
            }
        };
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

            const mappedImages = new Set(images.map(img => img.id));
            oldImages.filter(img => !mappedImages.has(img.id)).forEach(img => formData.append("removeImages", img.id));

            const newFiles = images.filter(img => img.isNew && img.file).map(img => img.file!) as File[];
            if (newFiles.length) {
                const base64Images = await filesToBase64(newFiles);
                base64Images.forEach(b64 => formData.append("newImages", b64));
            }

            const res = await fetch(`/api/party/${partyId}/edit`, { method: "PUT", body: formData });
            if (!res.ok) throw new Error("Failed to update party");

        } catch (err) {
            console.error(err);
            alert("Error updating party");
        } finally {
            setCreating(false);
        }
    };

    if (!partyData) return <Loader type="rgb-lettering" content="Loading party..." />;

    return (
        <div className="create-party-wrapper">
            <div className="create-party-container">
                <div className="create-party-background"></div>

                {!creating ? (
                    <>
                        <div className="create-party-content">
                            <div className="steps">
                                {[1,2,3,4,5].map(n => (
                                    <React.Fragment key={n}>
                                        <div 
                                            onClick={() => navigateToStep(n)}
                                            className={`step ${["basic-data", "exact-location", "additional-data", "submit", "final"][n-1]} ${step===n?"active":""}`}
                                        >
                                            {n}
                                        </div>
                                        {n<5 && <div className="step-seperator"></div>}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="body">
                                {step === 1 && <Step1 
                                    partyData={partyData}
                                    setPartyData={setPartyData as React.Dispatch<React.SetStateAction<Party>>}
                                    startDateOnly={startDateOnly}
                                    startTimeOnly={startTimeOnly}
                                    endDateOnly={endDateOnly}
                                    endTimeOnly={endTimeOnly}
                                    setStartDateOnly={setStartDateOnly}
                                    setStartTimeOnly={setStartTimeOnly}
                                    setEndDateOnly={setEndDateOnly}
                                    setEndTimeOnly={setEndTimeOnly}
                                    handleChange={handleChange}
                                />}
                                {step === 2 && <Step2 partyData={partyData} setPartyData={setPartyData as React.Dispatch<React.SetStateAction<Party>>} />}
                                {step === 3 && <MultiImageUploader party={partyData} setOldImages={setOldImages} setImages={setImages} images={images} />}
                                {step === 4 && <Step4 allCategories={allCategories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />}
                                {step === 5 && <Step_Final partyData={partyData} images={images} />}
                            </div>
                        </div>
                        <Footer step={step} navigateToStep={navigateToStep} onSubmit={handleSubmit} />
                    </>
                ) : <Loader type="rgb-lettering" content="Updating Party..." />}
            </div>
        </div>
    );
};

export default withAuth(EditPartyForm);