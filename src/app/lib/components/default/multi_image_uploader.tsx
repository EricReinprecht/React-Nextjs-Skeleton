"use client";

import { useEffect, useRef } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Party } from "@prisma/client";
import "@styles/pages/shit.scss";

type ImageItem = {
    id: string;
    url: string;
    isNew: boolean;
    file?: File;
};

function SortableImage({ image, onRemove }: { image: ImageItem; onRemove: (img: ImageItem) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="image-wrapper">
            <img src={image.url} alt="party image" />
            <button onClick={() => onRemove(image)}>Remove</button>
        </div>
    );
}

type PartyWithImages = Party & {
    images: { id: string; filename: string; partyId: string; path: string }[];
    imageUrls?: string[];
    categories: { id: string; name: string; active: boolean }[];
};

interface MultiImageUploaderProps {
    party: PartyWithImages;
    setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    setOldImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    images: ImageItem[];
}

export default function MultiImageUploader({ party, setOldImages, setImages, images }: MultiImageUploaderProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const prepareImages = async () => {
            try {
                const existingImages = party.images?.map((img) => ({
                    id: img.id,
                    path: img.path,
                    url: img.path,
                    isNew: false
                })) || [];
                setOldImages(existingImages);
                setImages(existingImages);
            } catch (err) {
                console.error(err);
            }
        };
        prepareImages();
    }, [party.id, setOldImages, setImages]);

    const handleFiles = (files: File[]) => {
        const newImages = files.map(file => ({
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            isNew: true,
            file
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(Array.from(e.dataTransfer.files));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleRemove = (img: ImageItem) => {
        setImages(prev => prev.filter(i => i.id !== img.id));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleClickDropzone = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    return (
        <div className="container">
            <h2>Drag & Drop Images</h2>
            <div
                className="dropzone"
                onDrop={handleDropFiles}
                onDragOver={handleDragOver}
                onClick={handleClickDropzone}
            >
                <p>Drag images here or click to select</p>
            </div>

            {/* Hidden file input for click */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleInputChange}
            />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="previews">
                        {images.map(img => (
                            <SortableImage key={img.id} image={img} onRemove={handleRemove} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}