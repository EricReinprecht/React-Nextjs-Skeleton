import { authService } from '@backend/services/auth.service';
import { getServerSession } from 'next-auth';
import { getRequestConfig } from 'next-intl/server';

import de from '../src/messages/de.json';
import en from '../src/messages/en.json';

const messages = { en, de };

export default getRequestConfig(async ({ requestLocale }) => {
    // 1. Get the locale derived from middleware / URL route
    let locale = await requestLocale;

    // 2. If no valid locale in URL, fallback to user session preference
    if (!locale || !['en', 'de'].includes(locale)) {
        const session = await getServerSession();
        let selectedLocale: 'en' | 'de' = 'de';

        if (session?.user?.email) {
            const user = await authService.getUserByEmail(session.user.email);
            if (user?.language === 'de' || user?.language === 'en') {
                selectedLocale = user.language;
            }
        }
        locale = selectedLocale;
    }

    return {
        locale,
        messages: messages[locale as 'en' | 'de'] ?? de,
    };
});
