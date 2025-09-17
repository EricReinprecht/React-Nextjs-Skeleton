"use client"

import DefaultPartyList from '../../lib/components/lists/default_party_list'
import "@styles/components/filter.scss"
import BasePage from '../../lib/templates/base_page'
import $ from 'jquery';
import React, { useState, useEffect, useRef } from "react";
import { getCategories } from "@/src/app/lib/services/categoryService";


import CarentDown from "@svgs/carent_down";
import CheckboxFilled from "@svgs/checkbox_filled";
import CheckboxEmpty from "@svgs/checkbox_empty";
import { Category } from '../../lib/entities/category'
import ExcelPartyList from '../../lib/components/lists/excel_party_list';
import DefaultSearch from '../../lib/components/search/default_search';

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Store which sections are open; keys = section names, values = boolean open/close
    const [sectionsOpen, setSectionsOpen] = useState<{ [key: string]: boolean }>({
        calendar: true,
        terms: true,
    });

    // Store which terms are checked: keys = category IDs, values = boolean checked
    const [checkedTerms, setCheckedTerms] = useState<{ [key: string]: boolean }>({});

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

    const openSection = (el: JQuery<HTMLElement>) => {
        let current_section = el.closest(".section");
        current_section.toggleClass("active");
    };

    // Toggle checkbox for a term
    const toggleTermChecked = (categoryId: string) => {
        setCheckedTerms(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

  return (
    <div className="main">
        <BasePage>
            {/* <div className='filter active'>
                <div className='section calendar'>
                    <div className='header' onClick={(e) => openSection($(e.currentTarget))}>
                        <div className='title'>Calendar</div>
                        <CarentDown height={24} width={24} color={"#ffffff"} />
                    </div>
                    <div className="options date">
                        <div className='datepickr'></div>
                    </div>
                </div>
                <div className='section terms'>
                    <div className='header' onClick={(e) => openSection($(e.currentTarget))}>
                        <div className='title'>Terms</div>
                        <CarentDown height={24} width={24} color={"#ffffff"} />
                    </div>
                        <div className='options terms-list'>
                        {categories.map((category) => {
                            if (!category.id) return null;
                            const id = category.id;
                            const checked = checkedTerms[category.id] ?? false;
                            const checkboxId = `term-${category.id}`;
                            return (
                              <div className='option' key={category.id}>
                                  <input
                                      id={checkboxId}
                                      type='checkbox'
                                      checked={checked}
                                      onChange={() => toggleTermChecked(id)}
                                      style={{ display: 'none' }}
                                  />
                                  <label
                                      htmlFor={checkboxId}
                                      className={`checkbox empty ${!checked ? 'active' : ''}`}
                                      aria-hidden="true"
                                  >
                                    <CheckboxEmpty height={24} width={24} color={"#ffffff"} />
                                  </label>
                                  <label
                                      htmlFor={checkboxId}
                                      className={`checkbox filled ${checked ? 'active' : ''}`}
                                      aria-hidden="true"
                                  >
                                      <CheckboxFilled height={24} width={24} color={"#ffffff"} />
                                  </label>
                                  <label htmlFor={checkboxId}>{category.name}</label>
                              </div>
                            );
                        })}
                    </div>
                </div>
            </div> */}
            <DefaultSearch id='browse-header' placeholder='Search for parties ...'/>
            <ExcelPartyList/>
        </BasePage>
    </div>
  )
}
