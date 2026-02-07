import bcrypt from "bcryptjs";
import crypto from "crypto";

export default async function generateRandomHash(): Promise<string> {
    return await bcrypt.hash(
        crypto.randomBytes(16).toString("hex"),
        12
    );
}