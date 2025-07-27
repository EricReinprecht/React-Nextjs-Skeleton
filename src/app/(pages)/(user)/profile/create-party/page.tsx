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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import GeoPointPicker from "@/src/app/lib/components/default/geo_point_picker";
import { getNextDateTimeAt } from "@/src/app/lib/utils/formatDate";
import ImageUploader from "@/src/app/lib/components/default/image_uploader";
import MultiImageUploader from "@/src/app/lib/components/default/multi_image_uploader";
import { uploadImagesToFirestore } from "@/src/app/lib/firebase/uploadImages";
import TiptapEditor from "@/src/app/lib/components/default/tiptap_texteditor";
import TextareaAutosize from 'react-textarea-autosize';

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
        console.log("Step changed to", step);
        console.log("Current imageFiles", imageFiles);
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
                userId: authUser.uid,
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
                                    <div className="step-content basic-data">
                                        <form className="party-form">

                                            {/* Name input */}
                                            <div className="form-group">
                                                <label htmlFor="name">Name</label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={partyData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter party name"
                                                    required
                                                />
                                            </div>

                                            {/* Location input */}
                                            <div className="form-group">
                                                <label htmlFor="location">Location</label>
                                                <input
                                                    id="location"
                                                    name="location"
                                                    type="text"
                                                    value={partyData.location}
                                                    onChange={handleChange}
                                                    placeholder="Enter location"
                                                />
                                            </div>

                                            {/* START DATE */}
                                            <div className="form-group">
                                                <label>Startdatum</label>
                                                <Flatpickr
                                                    options={{ enableTime: false, dateFormat: "d.m.Y", closeOnSelect: false }}
                                                    value={startDateOnly}
                                                    onChange={([date]) => {
                                                        setStartDateOnly(date);
                                                        if (date && startTimeOnly) {
                                                            const combined = combineDateAndTime(date, startTimeOnly);
                                                            setPartyData(prev => ({ ...prev, startDate: combined }));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* START TIME */}
                                            <div className="form-group">
                                                <label>Startzeit</label>
                                                <Flatpickr
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "H:i",
                                                        time_24hr: true,
                                                        closeOnSelect: false,
                                                        allowInput: true,
                                                    }}
                                                    value={startTimeOnly}
                                                    onChange={([time]) => {
                                                        setStartTimeOnly(time);
                                                        if (startDateOnly && time) {
                                                            const combined = combineDateAndTime(startDateOnly, time);
                                                            setPartyData(prev => ({ ...prev, startDate: combined }));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* END DATE */}
                                            <div className="form-group">
                                                <label>Enddatum</label>
                                                <Flatpickr
                                                    options={{ enableTime: false, dateFormat: "d.m.Y", allowInput: true }}
                                                    value={endDateOnly}
                                                    onChange={([date]) => {
                                                        setEndDateOnly(date ?? null);
                                                        if (date && endTimeOnly) {
                                                            const combined = combineDateAndTime(date, endTimeOnly);
                                                            setPartyData(prev => ({ ...prev, endDate: combined }));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* END TIME */}
                                            <div className="form-group">
                                                <label>Endzeit</label>
                                                <Flatpickr
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "H:i",
                                                        time_24hr: true,
                                                        closeOnSelect: false,
                                                        allowInput: true,
                                                    }}
                                                    value={endTimeOnly}
                                                    onChange={([time]) => {
                                                        setEndTimeOnly(time);
                                                        if (endDateOnly && time) {
                                                            const combined = combineDateAndTime(endDateOnly, time);
                                                            setPartyData(prev => ({ ...prev, endDate: combined }));
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                }
                                {step === 2 && 
                                    <div className="step-content exact-location">
                                        <form className="party-form">
                                            <GeoPointPicker
                                                lat={partyData.latitude}
                                                lng={partyData.longitude}
                                                onLocationSelect={(lat, lng) => {
                                                    setPartyData(prev => ({
                                                        ...prev,
                                                        latitude: lat,
                                                        longitude: lng,
                                                    }));
                                                }}
                                            />
                                            <div className="form-group">
                                                <label htmlFor="latitude">Latitude</label>
                                                <input
                                                    type="number"
                                                    id="latitude"
                                                    name="latitude"
                                                    value={partyData.latitude ?? ""}
                                                    onChange={(e) =>
                                                        setPartyData(prev => ({
                                                            ...prev,
                                                            latitude: parseFloat(e.target.value),
                                                        }))
                                                    }
                                                    step="any"
                                                    placeholder="Latitude"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="longitude">Longitude</label>
                                                <input
                                                    type="number"
                                                    id="longitude"
                                                    name="longitude"
                                                    value={partyData.longitude ?? ""}
                                                    onChange={(e) =>
                                                        setPartyData(prev => ({
                                                            ...prev,
                                                            longitude: parseFloat(e.target.value),
                                                        }))
                                                    }
                                                    step="any"
                                                    placeholder="Longitude"
                                                />
                                            </div>
                                        </form>
                                    </div>
                                }
                                <div className="step-content additional-data" style={{ display: step === 3 ? "block" : "none" }}>
                                    <form className="party-form">
                                            <MultiImageUploader 
                                                files={imageFiles}
                                                onImagesChange={setImageFiles} 
                                            />

                                            {/* TEASER */}
                                            <div className="form-group">
                                                <label htmlFor="teaser">Teaser</label>
                                                <TextareaAutosize
                                                    name="teaser"
                                                    value={partyData.teaser}
                                                    onChange={handleChange}
                                                    placeholder="Enter teaser"
                                                    required
                                                    className="your-custom-class"
                                                />
                                            </div>

                                            {/* Description with Tiptap */}
                                            <div className="form-group">
                                                <label htmlFor="description">Beschreibung</label>
                                                <TiptapEditor
                                                    content={partyData.description}
                                                    onChange={(value) =>
                                                        setPartyData(prev => ({ ...prev, description: value }))
                                                    }
                                                />
                                            </div>
                                    </form>
                                </div>
                                {step === 4 && 
                                    <div className="step-content submit">
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