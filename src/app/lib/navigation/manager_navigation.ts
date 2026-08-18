import { PROFILE_ROUTES } from "./routes";

export type ManagerNavigationItem = {
    label: string;
    shortLabel: string;
    path: string;
    icon: string;
    routes: readonly string[];
    exact?: boolean;
};

export const MANAGER_NAVIGATION: readonly ManagerNavigationItem[] = [
    { label: "Übersicht", shortLabel: "Home", path: "/profile", icon: "⌂", routes: ["/profile"], exact: true },
    { label: "Neue Party", shortLabel: "Neu", path: "/profile/edit-party", icon: "+", routes: ["/profile/edit-party"] },
    { label: "Meine Partys", shortLabel: "Partys", path: "/profile/my-parties", icon: "P", routes: PROFILE_ROUTES.parties },
    { label: "Meine Tickets", shortLabel: "Tickets", path: "/profile/my-tickets", icon: "T", routes: PROFILE_ROUTES.tickets },
    { label: "Warenkorb", shortLabel: "Korb", path: "/profile/shopping-cart", icon: "W", routes: ["/profile/shopping-cart"] },
    { label: "Einstellungen", shortLabel: "Konto", path: "/profile/settings", icon: "E", routes: ["/profile/settings"] },
];
