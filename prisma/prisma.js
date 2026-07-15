"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_neon_1 = require("@prisma/adapter-neon");
const connectionString = process.env.DATABASE_URL;
console.log("DB URL:", connectionString);
const adapter = new adapter_neon_1.PrismaNeon({
    connectionString,
});
const prisma = new client_1.PrismaClient({
    adapter,
});
exports.default = prisma;
