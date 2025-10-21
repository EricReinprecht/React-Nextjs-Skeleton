'use client'

import BasePage from "@templates/base_page";
import { useState } from "react";

export default function SeedUsers(props) {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const res = await fetch("/api/fixtures", { method: "POST" });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <BasePage>
      <button 
        onClick={handleClick} 
        style={{ backgroundColor: "red" }}
      >
        Create User Fixtures
      </button>
      {message && <p>{message}</p>}
    </BasePage>
  );
}
