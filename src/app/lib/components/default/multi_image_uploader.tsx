"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
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
    images: { id: string; filename: string; partyId: string }[];
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

   useEffect(() => {
        const prepareImages = async () => {
            try {
                const existingImages = party.images?.map((img: any) => ({
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
    }, [party.id]);

    const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const newImages = files.map(file => ({
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            isNew: true,
            file
        }));
        setImages(prev => [...prev, ...newImages]);
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

    return (
        <>
        <div className="container">
                <h2>Drag & Drop Images</h2>
                <div
                    className="dropzone"
                    onDrop={handleDropFiles}
                    onDragOver={handleDragOver}
                >
                    <p>Drag images here or click to select</p>
                </div>

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
        </>
    );
}
