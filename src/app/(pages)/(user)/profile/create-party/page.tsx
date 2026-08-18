import { redirect } from "next/navigation";

export default function LegacyCreatePartyPage() {
    redirect("/profile/edit-party");
}
