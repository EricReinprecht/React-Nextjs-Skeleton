"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Step1 from "@components/party/form/step1";
import Step2 from "@components/party/form/step2";
import Step3 from "@components/party/form/step3";
import Step4 from "@components/party/form/step4";
import StepCards from "@components/party/form/step_cards";
import StepFinal from "@components/party/form/step_final";
import StepManager from "@components/default/step_manager";
import { Category } from "@/src/app/lib/entities/category";
import { Party } from "@prisma/client";
import { PartyWithImages } from "@types_ts/party/PartyWithImagesType";
import { ImageItem } from "@/src/app/lib/types/ImageItemType";
import { TicketClassWithExtendedDate } from "@/src/app/lib/types/TicketClassWithExtendedDate";
import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import { createFormDataForParty } from "@/src/app/lib/utils/createFormDataForParty";
import withAuth from "@/src/app/lib/hoc/withAuth";
import "@styles/pages/create-party.scss";
import Footer from "@/src/app/lib/components/party/form/footer";
import { useParams } from "next/navigation";
import Loader from "@/src/app/lib/components/default/loader";

interface Props {
    authUser: { id: string; email: string; username: string };
}

const CreatePartyForm = ({ authUser }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [startDateOnly, setStartDateOnly] = useState<Date>(getNextDateTimeAt("friday", 18)); 
    const [startTimeOnly, setStartTimeOnly] = useState<Date>(getNextDateTimeAt("friday", 18));
    const [endDateOnly, setEndDateOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [endTimeOnly, setEndTimeOnly] = useState<Date>(getNextDateTimeAt("saturday", 3));
    const [images, setImages] = useState<ImageItem[]>([]);
    const [oldImages, setOldImages] = useState<ImageItem[]>([]);
    const [ticketClasses, setTicketClasses] = useState<TicketClassWithExtendedDate[]>([]);
    const [isCreated, setIsCreated] = useState(false);
    const [isSavingParty, setIsSavingParty] = useState(false);
    const [lastSavedPartyData, setLastSavedPartyData] = useState<PartyWithImages | null>(null);
    const [partyData, setPartyData] = useState<PartyWithImages>({
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "",
        location: "",
        description: "",
        teaser: "",
        latitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE ?? 0),
        longitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE ?? 0),
        startDate: startDateOnly,
        endDate: endDateOnly,
        status: "draft",
        userId: authUser.id,
        images: [],
        categories: [],
    });

    const params = useParams();
    const partyId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    useEffect(() => {
        if (partyId && !isCreated) {
            fetchParty(partyId);
            setIsCreated(true);
            setPartyData((p) => ({ ...p, id: partyId }));
            setLastSavedPartyData((prev) => prev ?? partyData);
        }else{
            saveParty();
        }
    }, [step]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/partyCategory/get");
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data: Category[] = await res.json();
                setAllCategories(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPartyData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchParty = async (partyId: string) => {
        console.log("here");
        try {
            const res = await fetch(`/api/party/${partyId}/get`);
            if (!res.ok) throw new Error("Failed to fetch party");
            const data: PartyWithImages = await res.json();
            setPartyData(data);
            setSelectedCategories(data.categories || []);
            const start = data.startDate ? new Date(data.startDate) : getNextDateTimeAt("friday", 18);
            const end = data.endDate ? new Date(data.endDate) : getNextDateTimeAt("saturday", 3);
            setPartyData({
                ...data,
                startDate: start,
                endDate: end,
            });
            setSelectedCategories(data.categories || []);
            setStartDateOnly(start);
            setStartTimeOnly(start);
            setEndDateOnly(end);
            setEndTimeOnly(end);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const saveParty = async () => {
        if (partyData === lastSavedPartyData || isSavingParty) return;
        setIsSavingParty(true);
        try {
            const endpoint = isCreated
                ? `/api/party/${partyData.id}/edit`
                : "/api/party/create";
            const formData = await createFormDataForParty(
                partyData,
                authUser.id,
                selectedCategories,
                images,
                oldImages
            );
            const res = await fetch(endpoint, {
                method: isCreated ? "PUT" : "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to save party");
            const data = await res.json();
            const partyId = data.partyId;
            !isCreated && partyId && setPartyData(p => ({ ...p, id: partyId }));
            setLastSavedPartyData(partyData);
            setIsCreated(true);
        } catch (err) {
            console.error(err);
            alert("Error saving party");
        } finally {
            setIsSavingParty(false);
            setIsLoading(false);
        }
    };

    const steps = [
        { name: "Basisdaten" },
        { name: "Geografische Daten" },
        { name: "Bilder & Beschreibung" },
        { name: "Kategorien" },
        { name: "Tickets" },
        { name: "Veröffentlichung" },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (["ArrowLeft", "ArrowUp"].includes(e.key))
                setStep((s) => (s > 1 ? s - 1 : steps.length));
            if (["ArrowRight", "ArrowDown"].includes(e.key))
                setStep((s) => (s < steps.length ? s + 1 : 1));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [steps.length]);

    const stepComponents: Record<number, React.ReactNode> = {
        1: (
            <Step1
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
            />
        ),
        2: <Step2 partyData={partyData} setPartyData={setPartyData as React.Dispatch<React.SetStateAction<Party>>} />,
        3: <Step3 party={partyData} setOldImages={setOldImages} setImages={setImages} images={images} setPartyData={setPartyData} />,
        4: <Step4 allCategories={allCategories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />,
        5: <StepCards ticketClasses={ticketClasses} setTicketClasses={setTicketClasses} partyData={partyData} />,
        6: <StepFinal partyData={partyData} images={images} />,
    };

    return (
        <div className="create-party-wrapper">
            <Loader type="rgb-lettering" />
            { !isLoading && 
                <>
                    <div className="step-manager-container">
                        <StepManager steps={steps} currentStep={step} setStep={setStep} />
                    </div>
                    <div className="create-party-container">
                        <div className="create-party-background" />
                        <div className="create-party-content">
                            <div className="body">
                                <div className="header">{steps[step - 1].name}</div>
                                {stepComponents[step]}
                            </div>
                        </div>
                        <Footer steps={steps} step={step} navigateToStep={setStep} onSubmit={saveParty} />
                    </div>
                </>
            }
        </div>
    );
};

export default withAuth(CreatePartyForm);