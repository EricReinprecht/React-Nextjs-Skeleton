import React from "react";

import "@styles/components/default_button.scss"
import { handleLogout } from "@firebase/handleLogout";
import DefautButton from "@components/default/default_button";

interface LogoutButtonProps {
    disable_style?: boolean;
}

const LogoutButton:React.FC<LogoutButtonProps> = ({disable_style}) => {
    return (
        <DefautButton type="submit" label="Logout" onClick={handleLogout} disable_style={disable_style} />
    )
};

export default LogoutButton;

