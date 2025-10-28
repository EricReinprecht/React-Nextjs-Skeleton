"use client";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "@styles/components/multi_image_uploader.scss";

type ImageFile = {
    id: string;
    file?: File;
    url: string;
    isServerFile?: boolean;
};

type MultiImageUploaderProps = {
    imageFiles: File[];
    onImagesChange: (files: File[]) => void;
    imagePath?: string;
    serverFiles?: string[];
};

const SortableImage: React.FC<{
    image: ImageFile;
    index: number;
    onRemove: (id: string) => void;
}> = ({ image, index, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div className="sortable-image" ref={setNodeRef} style={style}>
            <img {...listeners} src={image.url} alt={`img-${index}`} />
            <button type="button" className="remove-btn" onClick={() => onRemove(image.id)}>
                ✕
            </button>
        </div>
    );
};

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
    imageFiles,
    onImagesChange,
    imagePath = "",
}) => {
    const [images, setImages] = useState<ImageFile[]>([]);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (imageFiles.length > 0) {
            const serverImages = imageFiles.map((file, i) => ({
                id: `server-${i}-${file.name}`,
                url: imagePath + file.name,
                isServerFile: true,
            }));
            setImages((prev) => [...serverImages, ...prev.filter(img => !img.isServerFile)]);
        }
    }, [imageFiles, imagePath]);

    const onDrop = (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file) => ({
            id: `${file.name}-${file.size}-${file.lastModified}`,
            file,
            url: URL.createObjectURL(file),
        }));
        const newImages = [...images, ...newFiles];
        setImages(newImages);
        onImagesChange(newImages.filter((img) => img.file).map((img) => img.file!));
    };

    const onRemove = (id: string) => {
        console.log()
        const filtered = images.filter((img) => img.id !== id);
        setImages(filtered);
        onImagesChange(filtered.filter((img) => img.file).map((img) => img.file!));
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over?.id);
            const newImages = arrayMove(images, oldIndex, newIndex);
            setImages(newImages);
            onImagesChange(newImages.filter((img) => img.file).map((img) => img.file!));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    return (
        <div className="multi-image-uploader">
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop images here, or click to select</p>}
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
                    <div className="images-list">
                        {images.map((img, i) => (
                            <SortableImage key={img.id} image={img} index={i} onRemove={onRemove} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default MultiImageUploader;
