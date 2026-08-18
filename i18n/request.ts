import { getRequestConfig } from "next-intl/server";
import { authService } from "@backend/services/auth.service";
import { getServerSession } from "next-auth";

import en from "../src/messages/en.json";
import de from "../src/messages/de.json";

export default getRequestConfig(async () => {
    const session = await getServerSession();

    // safe default
    let selectedLocale: "en" | "de" = "en";

    if (session?.user?.email) {
        const user = await authService.getUserByEmail(session.user.email);
      
        if (user?.language === "de") selectedLocale = "de";
        if (user?.language === "en") selectedLocale = "en";
    }

    return {
        locale: selectedLocale,
        messages: selectedLocale === "de" ? de : en
    };
});
