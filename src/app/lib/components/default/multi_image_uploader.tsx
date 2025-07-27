import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "@styles/components/multi_image_uploader.scss";

type MultiImageUploaderProps = {
  onImagesChange: (files: File[]) => void;
};

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ onImagesChange }) => {
    const [previews, setPreviews] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
        onImagesChange(acceptedFiles);
    }, [onImagesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true,
    });

    return (
        <div className="multi-image-uploader">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                <input {...getInputProps()} />
                <p className="dropzone-text">{isDragActive ? "Drop the images here ..." : "Drag & drop some images here, or click to select files"}</p>
            </div>
            <div className="previews">
                {previews.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} className="preview-img" />
                ))}
            </div>
        </div>

    );
};

export default MultiImageUploader;
