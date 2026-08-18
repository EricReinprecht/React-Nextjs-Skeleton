"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { DefaultButton } from "@frontend/components";
import { logout } from "@frontend/api/auth";

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
            onClick={() => logout(router)}
            styles={{
                bgColor: "black",
                textColor: "white",
                borderColor: "black",
                hoverBgColor: "white",
                hoverTextColor: "black",
                hoverBorderColor: "black",
            }}
            disable_style={disable_style}
        />
    );
};

export default LogoutButton;

