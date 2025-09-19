"use client";
import React from "react";
import MultiImageUploader from "@/src/app/lib/components/default/multi_image_uploader";
import TiptapEditor from "@/src/app/lib/components/default/tiptap_texteditor";
import { Party } from "@/src/app/lib/entities/party";

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
    return (
        <div className="step-content additional-data">
            <form className="party-form">

                <div className="form-group">
                    <div className="column">
                        <MultiImageUploader
                            files={imageFiles}
                            onImagesChange={setImageFiles}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="form-group">
                    <div className="column">
                        <label htmlFor="description">Beschreibung</label>
                        <TiptapEditor
                            content={partyData.description}
                            onChange={(value) =>
                                setPartyData((prev) => ({ ...prev, description: value }))
                            }
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Step3;
