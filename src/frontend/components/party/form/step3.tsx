"use client";
import React from "react";
import { MultiImageUploader, TiptapEditor } from "@frontend/components";
import { PartyWithImages, ImageItem } from "@shared/types";

interface Step3Props {
    party: PartyWithImages;
    setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    setOldImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    images: ImageItem[];
    setPartyData: React.Dispatch<React.SetStateAction<PartyWithImages>>;
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
            <div className="form-intro">
                <span>Story & Medien</span>
                <h2>Zeige, wie sich dein Event anfühlt</h2>
                <p>Starke Bilder und eine gut lesbare Beschreibung machen aus Besuchern Gäste.</p>
            </div>
            <form className="party-form">
                <section className="form-section">
                    <div className="form-section-heading"><span className="form-section-index">01</span><div><h3>Eventbilder</h3><p>Das erste Bild wird als Titelbild verwendet. Ziehen ändert die Reihenfolge.</p></div></div>
                    <div className="form-group">
                    <div className="column">
                        <MultiImageUploader party={party} setOldImages={setOldImages} setImages={setImages} images={images} />
                    </div>
                    </div>
                </section>

                <section className="form-section">
                    <div className="form-section-heading"><span className="form-section-index">02</span><div><h3>Ausführliche Beschreibung</h3><p>Programm, Highlights und alles, was Gäste vorab wissen sollten.</p></div></div>
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
                </section>

            </form>
        </div>
    );
};

export default Step3;

