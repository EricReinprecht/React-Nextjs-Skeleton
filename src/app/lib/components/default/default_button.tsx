import React from "react";

import "@styles/components/default_button.scss"

interface DefaultButtonProps {
    label: string;
    type: "submit" | "reset" | "button";
    onClick?: () => void;
  }

const DefautButton:React.FC<DefaultButtonProps> = ({ label, type, onClick }) => {
    return (
        <button className="default-button" type={type} onClick={onClick}>{label}</button>
    )
};

export default DefautButton;