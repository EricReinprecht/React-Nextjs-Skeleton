import React from "react";

import "@styles/components/default_button.scss"
import { handleLogout } from "@firebase/handleLogout";
import DefautButton from "@components/default/default_button";


const LogoutButton:React.FC = () => {
    return (
        <DefautButton type="submit" label="Logout" onClick={handleLogout} />
    )
};

export default LogoutButton;

