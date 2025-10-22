"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DefautButton from "@components/default/default_button";
import "@styles/components/default_button.scss";
import { handleLogout } from "@auth/handleLogout";

interface LogoutButtonProps {
  disable_style?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ disable_style }) => {
    const router = useRouter();

    return (
        <DefautButton
            type="button"
            label="Logout"
            onClick={() => handleLogout(router)}
            styles={{
                bgColor: "black",
                textColor: "white",
                borderColor: "black",
                hoverBgColor: "white",
                hoverTextColor: "black",
                hoverBorderColor: "black",
            }}
        />
    );
};

export default LogoutButton;