// eslint.config.mjs

import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use FlatCompat to extend legacy configs like Next.js recommendations
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
    // Extend Next.js + TypeScript recommended configs
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // Global rules
    {
        rules: {
            "no-console": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "react/react-in-jsx-scope": "off", // Not needed in Next.js
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-unused-expressions": "off",
        },
    },

    // TypeScript-specific overrides
    {
        files: ["*.ts", "*.tsx"],
        rules: {
            // "@typescript-eslint/typedef": [
            //     "error",
            //     {
            //         parameter: true,
            //         propertyDeclaration: true,
            //         variableDeclaration: true,
            //     },
            // ],
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
    }
];
