"use client";
import React from "react";
import MultiImageUploader from "@/src/app/lib/components/default/multi_image_uploader";
import TiptapEditor from "@/src/app/lib/components/default/tiptap_texteditor";
import TextareaAutosize from "react-textarea-autosize";
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
    handleChange,
}) => {
    return (
        <div className="step-content additional-data">
            <form className="party-form">
                <MultiImageUploader
                    files={imageFiles}
                    onImagesChange={setImageFiles}
                />

                {/* Teaser */}
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

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">Beschreibung</label>
                    <TiptapEditor
                        content={partyData.description}
                        onChange={(value) =>
                            setPartyData((prev) => ({ ...prev, description: value }))
                        }
                    />
                </div>
            </form>
        </div>
    );
};

export default Step3;
