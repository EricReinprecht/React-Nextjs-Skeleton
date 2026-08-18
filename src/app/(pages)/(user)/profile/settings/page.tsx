import { ManagerPage } from "@frontend/templates";
import { getAuthUser } from "@backend/auth/session";

import EditUserForm from "./editUserForm";

import "@styles/forms/login_form.scss";
import "@styles/pages/settings.scss";

export default async function EditUser() {
    const authUser = await getAuthUser();

    if (!authUser) {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="main">
            <ManagerPage>
                <EditUserForm authUser={authUser} />   
            </ManagerPage>
        </div>
    );
};
