import ManagerPage from "@/src/app/lib/templates/manager_page";
import CreatePartyForm from "./createPartyForm"; // Client Component
import { getAuthUser } from "@utils/getAuthUser";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

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