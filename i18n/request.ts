import { getRequestConfig } from "next-intl/server";
import { locales } from "../locale_config";

// Import all JSON files statically
import en from '../src/messages/en.json';
import de from '../src/messages/de.json';

export default getRequestConfig(async ({ locale }) => {
    const safe = locale === "de" ? "de" : "en";
    return { locale: safe, messages: safe === "de" ? de : en };
});
