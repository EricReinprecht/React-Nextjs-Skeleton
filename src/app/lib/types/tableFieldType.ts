export type TableField = {
    key: string;
    label: string;
    type: "text" | "date" | "select";
    options?: { value: string; label: string }[]; 
};