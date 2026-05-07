import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { db } from "../db/db.js";

export const auth = betterAuth({
    trustedOrigins: [
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    database: mongodbAdapter(db, {}),
});