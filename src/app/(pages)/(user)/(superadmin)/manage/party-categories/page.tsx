"use client"

import "@styles/components/filter.scss"
import BasePage from '@/src/app/lib/templates/base_page';
import React, { useState, useEffect, useRef } from "react";
import $ from 'jquery';

import { Category } from "@/src/app/lib/entities/category";
import { createCategory, getCategories, deleteCategoryById, updateCategoryById } from "@/src/app/lib/services/categoryService";
import '@styles/manager/list.scss'
import Bin from "@/src/app/lib/svgs/bin";
import DefautButton from "@components/default/default_button";
import LoadingSpinner from "@/src/app/lib/components/default/loading_spinner";
import EditPen from "@/src/app/lib/svgs/edit_pen";
import EditAccept from "@/src/app/lib/svgs/edit_accept";
import ManagerPage from "@/src/app/lib/templates/manager_page";


export default function page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
    const [popupSubmitHandler, setPopupSubmitHandler] = useState<(() => void) | null>(null);

    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState<string>("");

    const categoryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategories();
      }, []);
    

    const fetchCategories = async () => {
        setLoading(true);
        try {
          let categories_response = await getCategories();
          setCategories(categories_response);
        } catch (error) {
          console.error("Error fetching parties:", error);
        } finally {
          setLoading(false);
        }
    };

    const addCategory = async () => {
        setLoading(true);
        const input = categoryInputRef.current;
        const category_name = input?.value;
        if(!category_name?.trim()) return false;
        const trimmedName = category_name.trim();
        try {
            const newCategoryId = await createCategory({ name: trimmedName, active: true });
            if (newCategoryId) {
                setCategories((prev) => [
                    ...prev,
                    { id: newCategoryId, name: trimmedName, active: true },
                ]);
                if(!input) return false;
                input.value = '';
            } else {
                alert("Category name must be unique or creation failed.");
            }
        } catch (error) {
            console.error("Error creating category:", error);
        }
        setLoading(false);
    };

    const handleDeleteCategory = (category: Category) => {
        setPopupContent(<p>Are you sure you want to delete <strong>{category.name}</strong>?</p>);
        setPopupSubmitHandler(() => async () => {
            if(!category.id) return;
            const success = await deleteCategoryById(category.id);
            if (success) {
                setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
            }
            setPopupVisible(false);
            setPopupSubmitHandler(null);
        });
        setPopupVisible(true);
    };

    const editCategory = (category: Category) => {
        if(!category.id) return;
        setEditingCategoryId(category.id);
        setEditedCategoryName(category.name);
    };

    const submitEditCategory = async (category: Category) => {
        setLoading(true);
        if(!category.id) return;
        try {
            const success = await updateCategoryById(category.id, { name: editedCategoryName });

            if (success) {
                setCategories(prev =>
                    prev.map(cat =>
                        cat.id === category.id ? { ...cat, name: editedCategoryName } : cat
                    )
                );
                setEditingCategoryId(null);
                setEditedCategoryName("");
            } else {
                alert("Failed to update category. Name might already exist.");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("An error occurred while updating the category.");
        }
        setLoading(false);
    };


  return (
    <div className="main">
        <ManagerPage>
            <div className="manager-list-wrapper">

                <div className="manager-list category">
                    {categories.map((category, index) => (
                        <div className="list-element category" key={category.id}>
                            <div className="data">
                                <div className="index">{index + 1}</div>
                                <div className="name">
                                  {editingCategoryId === category.id ? (
                                    <input
                                      type="text"
                                      value={editedCategoryName}
                                      onChange={(e) => setEditedCategoryName(e.target.value)}
                                    />
                                  ) : (
                                    category.name
                                  )}
                                </div>
                            </div>
                            <div className="operations">
                                {editingCategoryId === category.id ? (
                                    <div className="operation submit" onClick={() => submitEditCategory(category)}>
                                        <EditAccept height={24} width={24} color="black"/>                                    
                                    </div>
                                ) : (
                                    <div className="operation edit" onClick={() => editCategory(category)}>
                                        <EditPen height={24} width={24} color={"black"} />
                                    </div>
                                )}
                                <div className="operation delete" onClick={(e) => handleDeleteCategory(category)}><Bin height={24} width={24} color={"black"}/></div>
                            </div>
                        </div>
                    ))}
                </div>
                {loading && (
                    <LoadingSpinner type="manager"/>
                )}
            </div>
            <div className="add-list-element-container">
                <div className="input-container">
                    <label className="label" htmlFor="create-new-category">Create Category:</label>
                    <input disabled={loading} id="create-new-category" ref={categoryInputRef}></input>
                </div>
                <DefautButton
                    label="Submit"
                    type="button"
                    onClick={addCategory}
                    disabled={loading}
                    styles={{
                        bgColor: "submit_green", 
                        textColor: "white", 
                        borderColor: "submit_green", 
                        hoverBgColor: "white", 
                        hoverTextColor: "submit_green", 
                        hoverBorderColor: "submit_green" 
                    }}
                />
            </div>
            {popupVisible && (
                <div className="operations-popup">
                    <div className="inner">
                        <div className="content">{popupContent}</div>
                        <div className="footer">
                            <DefautButton
                                label="Abort"
                                type="button"
                                onClick={() => setPopupVisible(false)}
                                styles={{ 
                                    bgColor: "abort_red", 
                                    textColor: "white", 
                                    borderColor: "abort_red", 
                                    hoverBgColor: "white",
                                    hoverTextColor: "abort_red", 
                                    hoverBorderColor: "abort_red" 
                                }}
                            />
                            <DefautButton
                                label="Submit"
                                type="button"
                                onClick={() => popupSubmitHandler && popupSubmitHandler()}
                                styles={{
                                    bgColor: "submit_green", 
                                    textColor: "white", 
                                    borderColor: "submit_green", 
                                    hoverBgColor: "white", 
                                    hoverTextColor: "submit_green", 
                                    hoverBorderColor: "submit_green" 
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </ManagerPage>
    </div>
  )
}
