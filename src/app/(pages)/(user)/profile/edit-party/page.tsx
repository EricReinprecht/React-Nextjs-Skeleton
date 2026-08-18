import type { ReactElement } from "react";
import { redirect } from "next/navigation";

import { ManagerPage } from "@frontend/templates";
import CreatePartyForm from "./createPartyForm";
import { getAuthUser } from "@backend/auth/session";


const CreatePartyPage = async (): Promise<ReactElement> => {
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

export default CreatePartyPage;
