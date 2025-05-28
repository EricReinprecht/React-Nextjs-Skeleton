"use client"

import "@styles/components/filter.scss"
import BasePage from '@/src/app/lib/templates/base_page';
import React, { useState, useEffect } from "react";
import $ from 'jquery';

import { Category } from "@/src/app/lib/entities/category";
import { createCategory, getCategories, deleteCategoryById } from "@/src/app/lib/services/categoryService";
import '@styles/manager/list.scss'
import Bin from "@/src/app/lib/svgs/bin";
import DefautButton from "@components/default/default_button";
import LoadingSpinner from "@/src/app/lib/components/default/loading_spinner";
import EditPen from "@/src/app/lib/svgs/edit_pen";


export default function page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
    const [popupSubmitHandler, setPopupSubmitHandler] = useState<(() => void) | null>(null);

    useEffect(() => {
        fetchParties();
      }, []);
    

    const fetchParties = async () => {
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

    const addCategory = async (el: JQuery<HTMLElement>) => {
        let current_container = el.closest(".add-list-element-container");
        let input = current_container.find("input");
        let category_name = input.val();
        if (!category_name?.toString().trim()) return false;
        const trimmedName = category_name.toString().trim();    
        try {
            const newCategoryId = await createCategory({ name: trimmedName, active: true });
            if (newCategoryId) {
                setCategories((prev) => [
                    ...prev,
                    { id: newCategoryId, name: trimmedName, active: true },
                ]);
                input.val('');
            } else {
              alert("Category name must be unique or creation failed.");
            }
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    const handleDeleteCategory = (category: Category) => {
        setPopupContent(<p>Are you sure you want to delete <strong>{category.name}</strong>?</p>);
        setPopupSubmitHandler(() => async () => {
            if (!category.id) return;
            const success = await deleteCategoryById(category.id);
            if (success) {
                setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
            }
            setPopupVisible(false);
            setPopupSubmitHandler(null);
        });
        setPopupVisible(true);
    };

    const editCategory = (el: JQuery<HTMLElement>) => {
        let current_section = el.closest(".section");
        current_section.toggleClass("active");
    };


  return (
    <div className="main">
        <BasePage>
            <div className="manager-list category">
                {categories.map((category, index) => (
                    <div className="list-element category" key={category.id}>
                        <div className="data">
                            <div className="index">{index + 1}</div>
                            <div className="name">{category.name}</div>
                        </div>
                        <div className="operations">
                            <div className="operation edit" onClick={(e) => handleDeleteCategory(category)}><EditPen height={24} width={24} color={"black"}/></div>
                            <div className="operation delete" onClick={(e) => handleDeleteCategory(category)}><Bin height={24} width={24} color={"black"}/></div>
                        </div>
                  </div>
                ))}
                {loading && (
                    <LoadingSpinner type="manager"/>
                )}
            </div>
            <div className="add-list-element-container">
                <label className="label" htmlFor="create-new-category">Create Category:</label>
                <input id="create-new-category"></input>
                <div className="submit" onClick={(e) => addCategory($(e.currentTarget))}>Submit</div>
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
        </BasePage>
    </div>
  )
}
