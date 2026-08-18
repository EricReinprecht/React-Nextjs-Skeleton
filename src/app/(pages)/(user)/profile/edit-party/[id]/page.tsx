import ManagerPage from "@frontend/templates/manager_page";
import CreatePartyForm from "../createPartyForm"; // Client Component
import { getAuthUser } from "@backend/auth/session";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

const EditPartyPage = async (): Promise<ReactElement> => {
    const user = await getAuthUser();
    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="main">
            <ManagerPage>
                <CreatePartyForm authUser={user} />
            </ManagerPage>
        </div>
    );
}

export default EditPartyPage;
