export type TableAction<T> = {
    label: string;
    icon?: React.ReactNode;
    href?: (row: T) => string;
    onClick?: (
        row: T,
        helpers: {
            removeRow: (id: string) => void;
        }
    ) => void | Promise<void>;
};
