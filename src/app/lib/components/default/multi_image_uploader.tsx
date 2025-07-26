import React, { useState } from "react";

type MultiImageUploaderProps = {
    onImagesChange: (files: File[]) => void;
};

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ onImagesChange }) => {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
        onImagesChange(files);
    };

    return (
        <div className="multi-image-uploader">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <div className="previews" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {previews.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} style={{ maxWidth: "150px", maxHeight: "150px" }} />
                ))}
            </div>
        </div>
    );
};

export default MultiImageUploader;
