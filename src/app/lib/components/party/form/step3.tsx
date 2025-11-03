"use client";
import React from "react";
import MultiImageUploader from "@components/default/multi_image_uploader";
import TiptapEditor from "@/src/app/lib/components/default/tiptap_texteditor";
import { Party } from "@prisma/client";

type Step3Props = {
    imageFiles: File[];
    setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
    partyData: Party;
    setPartyData: React.Dispatch<React.SetStateAction<Party>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const Step3: React.FC<Step3Props> = ({
    imageFiles,
    setImageFiles,
    partyData,
    setPartyData,
}) => {
    const imagePath = `/uploads/${partyData.id}/`;

    return (
        <div className="step-content additional-data">
            <form className="party-form">

                <div className="form-group">
                    <div className="column">
                        {/* <MultiImageUploader
                            imagePath={imagePath}
                            imageFiles={imageFiles}
                            onImagesChange={setImageFiles}
                        /> */}
                    </div>
                </div>

                {/* Description */}
                <div className="form-group">
                    <div className="column">
                        <label htmlFor="description">Beschreibung</label>
                        <TiptapEditor
                            content={partyData.description}
                            onChange={(value) =>
                                setPartyData((prev) => ({ ...prev!, description: value }))
                            }
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Step3;
