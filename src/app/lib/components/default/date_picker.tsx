"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date | null) => {
        if (date) {
          onChange(formatDate(date));
        } else {
          onChange("");
        }
      }}
      dateFormat="dd.MM.yyyy"
      placeholderText="TT.MM.JJJJ"
      isClearable
    />
  );
};

export default DatePickerComponent;
