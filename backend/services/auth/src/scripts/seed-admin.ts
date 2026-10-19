import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const seedAdmin = async (): Promise<void> => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(uri);
    console.log("Connected — ensuring admin account…");

    const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@nexacart.dev").toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123";
    const name = process.env.SEED_ADMIN_NAME ?? "NexaCart Admin";

    const existing = await User.findOne({ email });

    if (existing) {
        if (existing.role !== "admin") {
            existing.role = "admin";
            existing.isVerified = true;
            await existing.save();
            console.log(`Promoted ${email} to admin.`);
        } else {
            console.log(`Admin ${email} already exists.`);
        }
    } else {
        await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role: "admin",
            isVerified: true,
        });
        console.log(`Created admin ${email}.`);
    }

    await mongoose.disconnect();
};

seedAdmin().catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
});
