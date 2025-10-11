const fs = require("fs");
const path = require("path");

const base = fs.readFileSync(path.join("prisma", "schema-base.prisma"), "utf-8");
const modelsDir = path.join("prisma", "models");
const models = fs
    .readdirSync(modelsDir)
    .filter(f => f.endsWith(".prisma"))
    .map(f => fs.readFileSync(path.join(modelsDir, f), "utf-8"))
    .join("\n\n");

fs.writeFileSync(path.join("prisma", "schema.prisma"), `${base}\n\n${models}`);
console.log("✅ schema.prisma successfully built from models/");