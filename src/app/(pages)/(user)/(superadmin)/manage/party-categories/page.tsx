"use client"

import "@styles/components/filter.scss"
import BasePage from '@/src/app/lib/templates/base_page';
import React, { useState, useEffect } from "react";
import $ from 'jquery';

import CarentDown from "@svgs/carent_down";
import CheckboxFilled from "@svgs/checkbox_filled";
import CheckboxEmpty from "@svgs/checkbox_empty";
import { Category } from "@/src/app/lib/entities/category";
import { createCategory, getCategories } from "@/src/app/lib/services/categoryService";
import '@styles/manager/list.scss'

export default function page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
        let active = true;
        if (!category_name || category_name.toString().trim() === "") {
            return false; // prevent empty names
        }
    
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

    const removeCategory = (el: JQuery<HTMLElement>) => {
        let current_section = el.closest(".section");
        current_section.toggleClass("active");
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
                            <div className="operation edit">Edit</div>
                            <div className="operation delete">Delete</div>
                        </div>
                  </div>
                ))}
            </div>
            <div className="add-list-element-container">
                <label className="label" htmlFor="create-new-category">Create Category:</label>
                <input id="create-new-category"></input>
                <div className="submit" onClick={(e) => addCategory($(e.currentTarget))}>Submit</div>
            </div>
        </BasePage>
    </div>
  )
}
