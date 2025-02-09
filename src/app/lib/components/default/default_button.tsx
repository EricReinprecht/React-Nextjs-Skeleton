import React from "react";

import "@styles/components/default_button.scss"

interface DefaultButtonProps {
    label: string;
    type: "submit" | "reset" | "button";
  }

const DefautButton:React.FC<DefaultButtonProps> = ({ label, type }) => {
    return (
        <button className="default-button" type={type}>{label}</button>
    )
};

export default DefautButton;