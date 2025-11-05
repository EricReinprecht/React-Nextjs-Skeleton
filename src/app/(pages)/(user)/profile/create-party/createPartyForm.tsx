"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

import Step1 from "@components/party/form/step1";
import Step2 from "@components/party/form/step2";
import Step3 from "@components/party/form/step3";
import Step4 from "@components/party/form/step4";
import Step_Final from "@/src/app/lib/components/party/form/step_final";
import Footer from "@components/party/form/footer";
import Loader from "@/src/app/lib/components/default/loader";
import withAuth from "@/src/app/lib/hoc/withAuth";

import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import { filesToBase64 } from "@/src/app/lib/utils/filesToBase64";
import { Category } from "@/src/app/lib/entities/category";
import { Party, Ticket, TicketClass } from "@prisma/client";

import "@styles/pages/create-party.scss";
import { ImageItem } from "@/src/app/lib/types/ImageItemType";

import Chain from "@svgs/chain";
import StepAssistant from "@/src/app/lib/components/default/step_manager";
import StepManager from "@/src/app/lib/components/default/step_manager";
import { PartyWithImages } from "@/src/app/lib/types/PartyWithImagesType";
import StepCards from "@/src/app/lib/components/party/form/step_cards";

interface Props {
    authUser: { id: string; email: string; username: string };
}

const CreatePartyForm = ({ authUser }: Props) => {
    const [step, setStep] = useState(1);
    const steps = [
        { name: "Basisdaten" },
        { name: "Geografische Daten" },
        { name: "Bilder & Beschreibung" },
        { name: "Kategorien" },
        { name: "Tickets" },
        { name: "Veröffentlichung" },
    ];
    const [creating, setCreating] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const [startDateOnly, setStartDateOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [startTimeOnly, setStartTimeOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [endDateOnly, setEndDateOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [endTimeOnly, setEndTimeOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));

    const [oldImages, setOldImages] = useState<ImageItem[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([]);

    const [hoverStep, setHoverStep] = React.useState<number | null>(null);

    const [partyData, setPartyData] = useState<PartyWithImages>({
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
        images: [],
        categories: [],
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
        if (nextStep >= 1 && nextStep <= steps.length) setStep(nextStep);
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

            selectedCategories.forEach(cat => formData.append("categories", cat.id!));

            const mappedImages = new Set(images.map(img => img.id));
            oldImages.filter(img => !mappedImages.has(img.id)).forEach(img => formData.append("removeImages", img.id));

            const newFiles = images.filter(img => img.isNew && img.file).map(img => img.file!) as File[];
            if (newFiles.length) {
                const base64Images = await filesToBase64(newFiles);
                base64Images.forEach(b64 => formData.append("newImages", b64));
            }

            const res = await fetch("/api/party/create", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to create party");

            setStep(1);
        } catch (err) {
            console.error(err);
            alert("An error occurred while creating the party.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="create-party-wrapper">
            <div className="step-manager-container">
                <StepManager steps={steps} currentStep={step} setStep={setStep} />
            </div>
            <div className="create-party-container">
                <div className="create-party-background"/>
                {!creating && (
                    <>
                        <div className="create-party-content">
                            <div className="steps">
                                    {steps.map((stepItem, index) => {
                                        const stepNumber = index + 1;
                                        return (
                                            <React.Fragment key={stepNumber}>
                                                <div onClick={() => navigateToStep(stepNumber)} className={`step ${stepNumber === 1 ? "basic-data" : stepNumber === 2 ? "exact-location" : stepNumber === 3 ? "additional-data" : "submit"} ${step === stepNumber ? "active" : ""}`}>
                                                    {stepNumber}
                                                </div>
                                                {stepNumber < steps.length && <div className="step-seperator"></div>}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>

                            <div className="body">
                                <div className="header">{steps[step - 1].name}</div>
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
                                {step === 3 && <Step3 party={partyData} setOldImages={setOldImages} setImages={setImages} images={images} setPartyData={setPartyData} />}
                                {step === 4 && <Step4 allCategories={allCategories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />}
                                {step === 5 && <StepCards tickets={tickets} setTickets={setTickets} ticketClasses={ticketClasses} setTicketClasses={setTicketClasses} />}
                                {step === 6 && <Step_Final partyData={partyData} images={images} />}
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
            </div>
        </div>
    );
};

export default withAuth(CreatePartyForm);
