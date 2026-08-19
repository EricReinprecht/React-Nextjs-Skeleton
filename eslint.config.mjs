// eslint.config.mjs

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
    ...nextVitals,
    ...nextTypescript,

    // Global rules
    {
        rules: {
            "no-console": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-unused-expressions": "off",
        },
    },

    // TypeScript-specific overrides
    {
        files: ["*.ts", "*.tsx"],
        rules: {
            "@typescript-eslint/typedef": "off",
            "@typescript-eslint/no-inferrable-types": "off",
        },
    },

    // Test files overrides
    {
        files: ["*.test.ts", "*.test.tsx"],
        rules: {
            "no-unused-expressions": "off",
        },
    },

    // Generated files
    {
        files: [".next/**/*.ts", ".next/**/*.tsx"],
        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/typedef": "off",
        },
    },
];