import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ReactSortable } from "react-sortablejs";
import "@styles/components/multi_image_uploader.scss";

type ImagePreview = {
  id: string;
  src: string;
  file: File;
};

type MultiImageUploaderProps = {
  onImagesChange: (files: File[]) => void;
};

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ onImagesChange }) => {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) => ({
        id: URL.createObjectURL(file), // Using URL as id (unique for the session)
        src: URL.createObjectURL(file),
        file,
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
      onImagesChange([...previews.map(p => p.file), ...acceptedFiles]);
    },
    [onImagesChange, previews]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // Called when drag order changes
  const handleSort = (newState: ImagePreview[]) => {
    setPreviews(newState);
    onImagesChange(newState.map((item) => item.file));
  };

  // Remove an image by id
  const removeImage = (id: string) => {
    const filtered = previews.filter((p) => p.id !== id);
    setPreviews(filtered);
    onImagesChange(filtered.map((p) => p.file));
  };

  return (
    <div className="multi-image-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <p className="dropzone-text">{isDragActive ? "Drop the images here ..." : "Drag & drop some images here, or click to select files"}</p>
      </div>

      <ReactSortable
        list={previews}
        setList={handleSort}
        className="previews"
        style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}
      >
        {previews.map(({ id, src }) => (
          <div
            className="image-wrapper"
            key={id}
            style={{
              position: "relative",
              maxWidth: "150px",
              maxHeight: "150px",
              borderRadius: "6px",
              overflow: "hidden",
              cursor: "grab",
            }}
          >
            <img
              src={src}
              alt="preview"
              style={{ width: "150px", height: "150px", objectFit: "cover", display: "block" }}
              draggable={false}
            />
            <button
              onClick={() => removeImage(id)}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                background: "rgba(0,0,0,0.6)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: 24,
                height: 24,
                cursor: "pointer",
              }}
              aria-label="Remove image"
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default MultiImageUploader;
