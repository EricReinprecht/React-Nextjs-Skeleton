"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@styles/components/date_picker.scss";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

// Parse YYYY-MM-DD as local date
const parseLocalDate = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-based
};

// Convert Date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const DatePickerComponent: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const selectedDate = value ? parseLocalDate(value) : null;

  return (
    <div className="date-filter-picker">
      <span className="date-filter-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M7 2v3M17 2v3M3.5 9h17M5.5 4h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => onChange(date ? formatDate(date) : "")}
        dateFormat="dd.MM.yyyy"
        placeholderText="Datum wählen"
        isClearable
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        todayButton="Heute"
        popperPlacement="bottom-start"
        calendarClassName="filter-date-calendar"
        wrapperClassName="date-filter-input-wrapper"
        popperClassName="date-filter-popper"
        aria-label="Datumsfilter"
      />
    </div>
  );
};

export default DatePickerComponent;

