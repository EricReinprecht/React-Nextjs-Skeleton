"use client";
import React from "react";
import MultiImageUploader from "@components/default/multi_image_uploader";
import TiptapEditor from "@/src/app/lib/components/default/tiptap_texteditor";
import { Party } from "@prisma/client";
import { PartyWithImages } from "@types_ts/PartyWithImagesType";
import { ImageItem } from "@types_ts/ImageItemType";

interface Step3Props {
    party: PartyWithImages;
    setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    setOldImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    images: ImageItem[];
    setPartyData: React.Dispatch<React.SetStateAction<PartyWithImages | undefined>>;
}

const Step3: React.FC<Step3Props> = ({
    party,
    setImages,
    setOldImages,
    images,
    setPartyData,
}) => {
    return (
        <div className="step-content additional-data">
            <form className="party-form">

                <div className="form-group">
                    <div className="column">
                        <MultiImageUploader party={party} setOldImages={setOldImages} setImages={setImages} images={images} />
                    </div>
                </div>

                {/* Description */}
                <div className="form-group">
                    <div className="column">
                        <label htmlFor="description">Beschreibung</label>
                        <TiptapEditor
                            content={party.description}
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
