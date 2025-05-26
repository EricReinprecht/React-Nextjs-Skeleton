"use client"

import React from 'react'
import DefaultPartyList from '../../lib/components/lists/default_party_list'
import "@styles/components/filter.scss"
import BasePage from '../../lib/templates/base_page'
import $ from 'jquery';

import CarentDown from "@svgs/carent_down";
import CheckboxFilled from "@svgs/checkbox_filled";
import CheckboxEmpty from "@svgs/checkbox_empty";

export default function page() {
    const openSection = (el: JQuery<HTMLElement>) => {
        let current_section = el.closest(".section");
        current_section.toggleClass("active");
    };

    const handleCheckboxClick = (el: JQuery<HTMLElement>) => {
        const isActive = el.find(".checkbox.empty").hasClass("active");
        el.find(".checkbox.empty").toggleClass("active", !isActive);
        el.find(".checkbox.filled").toggleClass("active", isActive);
        const hiddenInput = el.find("input[type='hidden']");
        hiddenInput.val(isActive ? "0" : "1");
    };

  return (
    <div className="main">
        <BasePage>
            <div className='filter active'>
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
                    <div className='options terms-list' onClick={(e) => handleCheckboxClick($(e.currentTarget))}>
                        <div className='option'>
                            <input id="term-zeltfest" type='hidden'/>
                            <label htmlFor="term-zeltfest" className='checkbox empty active'><CheckboxEmpty height={24} width={24} color={"#ffffff"} /></label>
                            <label htmlFor="term-zeltfest" className='checkbox filled'><CheckboxFilled height={24} width={24} color={"#ffffff"} /></label>
                            <label htmlFor="term-zeltfest">Zeltfest</label>
                        </div>
                    </div>
                </div>
            </div>
            <DefaultPartyList />
        </BasePage>
    </div>
  )
}
