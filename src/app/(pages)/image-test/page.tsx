"use client";

import { useEffect, useState } from "react";
import BasePage from "@templates/base_page";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import DefautButton from "../../lib/components/default/default_button";
import { filesToBase64 } from "../../lib/utils/filesToBase64";

type ImageItem = {
    id: string;
    url: string;
    isNew: boolean;
    file?: File;
};

function SortableImage({ image, onRemove }: { image: ImageItem, onRemove: (img: ImageItem) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="image-wrapper">
            <img src={image.url} alt="party image" />
            <button onClick={() => onRemove(image)}>Remove</button>
        </div>
    );
}

export default function Party(props) {
    const partyId = "cmhdvgw7x000l46t44khlq4kw";

    const [party, setParty] = useState<any | null>(null);
    const [oldImages, setOldImages] = useState<ImageItem[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    useEffect(() => {
        const fetchParty = async () => {
            try {
                const res = await fetch(`/api/party/${partyId}/get`);
                if (!res.ok) throw new Error("Failed to fetch party");
                const data = await res.json();
                const existingImages = data.images?.map((img: any) => ({
                    id: img.id,
                    path: img.path,
                    url: `/uploads/${partyId}/${img.filename}`,
                    isNew: false
                })) || [];
                setParty(data);
                setOldImages(existingImages);
                setImages(existingImages);
            } catch (err) {
                console.error(err);
            }
        };
        fetchParty();
    }, [partyId]);

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

    const handleSubmit = async () => {
        try{
            const formData = new FormData();

            const mappedImages = new Set(images.map(img => img.id));
            const imagesToRemove = oldImages.filter(img => !mappedImages.has(img.id));
            const newImages = images.filter(img => img.isNew);

            imagesToRemove.forEach((file) => formData.append("removeImages", file.id));

            if (newImages.length > 0) {
                const files = newImages
                    .map((img) => img.file)
                    .filter((file): file is File => !!file);
                          
                if (files.length > 0) {
                    const base64Images = await filesToBase64(files);
                    base64Images.forEach((b64) => formData.append("newImages", b64));
                }
            }

            const res = await fetch(`/api/party/${partyId}/edit`, {
                method: "PUT",
                body: formData,
            });

            // console.log(res);
        }catch{

        }

    }

    return (
        <BasePage>
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
            <DefautButton
                label="Submit"
                type="button"
                onClick={handleSubmit}
                styles={{
                    bgColor: "black",
                    textColor: "white",
                    borderColor: "black",
                    hoverBgColor: "white",
                    hoverTextColor: "black",
                    hoverBorderColor: "black",
                }}
            />
        </BasePage>
    );
}
