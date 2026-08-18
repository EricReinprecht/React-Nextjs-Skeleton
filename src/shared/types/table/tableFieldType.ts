export type TableField<T> = {
    key: Extract<keyof T, string | number>;
    label: string;
    type: "text" | "date" | "select";
    options?: { label: string; value: any }[];
};
