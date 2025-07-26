import React, { useState } from "react";

type ImageUploaderProps = {
  onImageChange: (file: File | null) => void;
  initialImageUrl?: string;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, initialImageUrl }) => {
  const [preview, setPreview] = useState<string | undefined>(initialImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageChange(file);
    } else {
      setPreview(undefined);
      onImageChange(null);
    }
  };

  return (
    <div className="image-uploader">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <div className="preview">
          <img src={preview} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
