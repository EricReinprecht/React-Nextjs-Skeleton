import { getRequestConfig } from "next-intl/server";
import prisma from "@/src/app/lib/prisma/prisma";
import { getServerSession } from "next-auth";

import en from "../src/messages/en.json";
import de from "../src/messages/de.json";

export default getRequestConfig(async () => {
    const session = await getServerSession();

    // safe default
    let selectedLocale: "en" | "de" = "en";

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { language: true }
        });
      
        if (user?.language === "de") selectedLocale = "de";
        if (user?.language === "en") selectedLocale = "en";
    }

    return {
        locale: selectedLocale,
        messages: selectedLocale === "de" ? de : en
    };
});
