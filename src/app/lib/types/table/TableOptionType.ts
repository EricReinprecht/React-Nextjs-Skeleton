export type TableOption = {
    label: string;
    onClick: () => void | Promise<void>;
    disabled?: boolean;
    variant?: "primary" | "danger" | "secondary";
};
