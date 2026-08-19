import '@styles/components/header.scss';
import Link from 'next/link';

import { Profile } from '@frontend/svgs';
import { PROFILE_ROUTES } from '../../navigation/routes';
import HeaderNavLink from './header_nav_link';

interface HeaderProps {
    messages: Record<string, string>;
    locale: 'en' | 'de';
    user: { username: string } | null;
}

export default function Header({ messages, locale, user }: HeaderProps) {
    const localized = (path: string) => `/${locale}${path}`;

    return (
        <header className="public-header">
            <div className="left">
                <Link href={`/${locale}`} className="logo">
                    <span className="logo-mark" aria-hidden="true">
                        E
                    </span>
                    <span className="logo-copy">
                        <strong>EVENTLY</strong>
                        <small>find your night</small>
                    </span>
                </Link>
            </div>

            <nav className="header-inner" aria-label="Hauptnavigation">
                <HeaderNavLink href={localized('/browse')} className="nav-item-outer nav-browse">
                    <span className="nav-item">{messages.browse}</span>
                </HeaderNavLink>

                {user && (
                    <>
                        <HeaderNavLink
                            href={localized('/profile/my-tickets')}
                            activePaths={[...PROFILE_ROUTES.tickets]}
                            className="nav-item-outer nav-secondary"
                            prefetch={false}
                        >
                            <span className="nav-item">{messages.my_cards}</span>
                        </HeaderNavLink>
                        <HeaderNavLink
                            href={localized('/profile/my-parties')}
                            activePaths={[...PROFILE_ROUTES.parties]}
                            className="nav-item-outer nav-secondary"
                            prefetch={false}
                        >
                            <span className="nav-item">{messages.my_parties}</span>
                        </HeaderNavLink>
                        <HeaderNavLink
                            href={localized('/profile/settings')}
                            className="nav-item-outer nav-secondary nav-settings"
                            prefetch={false}
                        >
                            <span className="nav-item">{messages.settings}</span>
                        </HeaderNavLink>
                    </>
                )}
            </nav>

            <div className="right">
                {user && (
                    <Link
                        href={localized('/profile/edit-party')}
                        prefetch={false}
                        className="header-create-event"
                    >
                        <span aria-hidden="true">+</span> {messages.create_new_party}
                    </Link>
                )}
                <Link
                    href={localized(user ? '/profile' : '/login')}
                    prefetch={false}
                    className="header-profile-link"
                    aria-label="Benutzerbereich öffnen"
                >
                    <span className="header-profile-icon">
                        <Profile width={40} height={40} color="white" border_color="white" />
                    </span>
                    <span className="header-profile-copy">
                        <small>{user ? 'Dein Bereich' : 'Anmelden'}</small>
                        <strong>{user ? user.username : 'Account'}</strong>
                    </span>
                </Link>
            </div>
        </header>
    );
}
