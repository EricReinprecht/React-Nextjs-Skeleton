import createMiddleware from 'next-intl/middleware';
import { locales } from './locale_config';


export default createMiddleware({
    locales,
    defaultLocale: 'en'
})

export const config = {
    matcher: ["/", "/(de|en)/:path*"]
}