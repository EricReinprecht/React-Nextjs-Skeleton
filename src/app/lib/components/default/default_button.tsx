import React from "react";

import "@styles/components/default_button.scss"

interface DefaultButtonProps {
    label: string;
    type: "submit" | "reset" | "button";
    onClick?: () => void;
    styles?: StyleProps;
}

interface StyleProps {
  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
}

const DefautButton:React.FC<DefaultButtonProps> = ({ label, type, onClick, styles = {} }) => {

    const classNames = [
        "default-button",
        styles.bgColor ? `bg-${styles.bgColor}` : null,
        styles.hoverBgColor ? `hover-bg-${styles.hoverBgColor}` : null,
        styles.textColor ? `text-${styles.textColor}` : null,
        styles.textColor ? `hover-text-${styles.hoverTextColor}` : null,
        styles.borderColor ? `border-${styles.borderColor}` : null,
        styles.textColor ? `hover-border-${styles.hoverBorderColor}` : null,
    ]
    .filter(Boolean) // remove nulls
    .join(" ");

    return (
        <button className={classNames} type={type} onClick={onClick}>{label}</button>
    )
};

export default DefautButton;