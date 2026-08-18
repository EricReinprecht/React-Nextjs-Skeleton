"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import { Step1, Step2, Step3, Step4, StepCards, StepFinal, StepManager, Footer, Loader } from "@frontend/components";
import { Category } from "@shared/entities/category";
import type { Party } from "@shared/types";
import { PartyWithImages, ImageItem, TicketClassWithExtendedDate } from "@shared/types";
import { getNextDateTimeAt } from "@shared/utils/formatDate";
import { createFormDataForParty } from "@shared/utils/createFormDataForParty";
import withAuth from "@frontend/hoc/withAuth";

import "@styles/pages/create-party.scss";


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
    const router = useRouter();
    const locale = useLocale();
    const partyId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const hasInitializedStep = useRef(false);

    useEffect(() => {
        if (partyId && !isCreated) {
            fetchParty(partyId);
            setIsCreated(true);
            setPartyData((p) => ({ ...p, id: partyId }));
            setLastSavedPartyData((prev) => prev ?? partyData);
        } else if (!partyId) {
            setIsLoading(false);
        }
    }, [partyId]);

    useEffect(() => {
        if (!hasInitializedStep.current) {
            hasInitializedStep.current = true;
            return;
        }
        if (partyData.name.trim()) saveParty();
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

    const saveParty = async (): Promise<string | null> => {
        if (partyData === lastSavedPartyData || isSavingParty) return partyData.id || null;
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
            return partyId || partyData.id || null;
        } catch (err) {
            console.error(err);
            alert("Error saving party");
            return null;
        } finally {
            setIsSavingParty(false);
            setIsLoading(false);
        }
    };

    const submitParty = async () => {
        const savedPartyId = await saveParty();
        if (savedPartyId) router.push(`/${locale}/profile/show-parties/${savedPartyId}`);
    };

    const steps = [
        { name: "Basisdaten" },
        { name: "Geografische Daten" },
        { name: "Bilder & Beschreibung" },
        { name: "Kategorien" },
        { name: "Tickets" },
        { name: "Vorschau & Abschluss" },
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
        6: <StepFinal partyData={partyData} images={images} categories={selectedCategories} />,
    };

    return (
        <div className="create-party-wrapper">
            {isLoading ? (
                <div className="create-party-loading">
                    <Loader type="rgb-lettering" content="Party wird vorbereitet …" />
                </div>
            ) : (
                <>
                    <aside className="step-manager-container" aria-label="Party creation progress">
                        <div className="step-manager-heading">
                            <span>Party erstellen</span>
                            <strong>{step} / {steps.length}</strong>
                        </div>
                        <StepManager steps={steps} currentStep={step} setStep={setStep} />
                    </aside>

                    <section className="create-party-container">
                        <header className="create-party-header">
                            <div>
                                <span className="step-kicker">Schritt {step} von {steps.length}</span>
                                <h1>{steps[step - 1].name}</h1>
                            </div>
                            <span className={`save-state ${isSavingParty ? "saving" : "saved"}`}>
                                {isSavingParty ? "Wird gespeichert …" : isCreated ? "Entwurf gespeichert" : "Noch nicht gespeichert"}
                            </span>
                        </header>

                        <div className="create-party-content">
                            {stepComponents[step]}
                        </div>

                        <Footer steps={steps} step={step} navigateToStep={setStep} onSubmit={submitParty} />
                    </section>
                </>
            )}
        </div>
    );
};

export default withAuth(CreatePartyForm);
