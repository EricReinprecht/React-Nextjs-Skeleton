"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { DefaultButton } from "@components";
import { handleLogout } from "@auth/handleLogout";

import "@styles/components/default_button.scss";

interface LogoutButtonProps {
  disable_style?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ disable_style }) => {
    const router = useRouter();

    return (
        <DefaultButton
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