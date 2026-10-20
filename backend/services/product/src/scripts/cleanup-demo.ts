/**
 * One-off demo-data cleanup.
 *
 *   npx tsx src/scripts/cleanup-demo.ts --report   # counts only (default)
 *   npx tsx src/scripts/cleanup-demo.ts --apply    # delete the demo data
 *
 * Reads every service's own .env for its MONGO_URI so it can clear the seeded
 * catalogue and everything derived from it: warehouse rows, NexaGuard reports,
 * carts, demo orders/notifications and the throwaway smoke-test accounts.
 * Admin accounts (role: admin) are always kept so the console stays reachable.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const here = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.resolve(here, "..", "..", ".."); // backend/services

const uriFor = (service: string): string => {
    const envPath = path.join(servicesDir, service, ".env");
    const raw = fs.readFileSync(envPath, "utf8");
    const match = raw.match(/^MONGO_URI\s*=\s*"?([^"\r\n]+)"?/m);
    const uri = match?.[1];

    if (!uri) {
        throw new Error(`MONGO_URI missing in ${envPath}`);
    }

    return uri;
};

const APPLY = process.argv.includes("--apply");

/** Optional extra account to remove regardless of role: --email a@b.c */
const emailFlagIndex = process.argv.indexOf("--email");
const extraEmail = emailFlagIndex === -1 ? undefined : process.argv[emailFlagIndex + 1];

/** service -> collections to clear (admin accounts excluded where noted). */
const TARGETS: { service: string; collections: string[] }[] = [
    { service: "product", collections: ["products"] },
    { service: "inventory", collections: ["inventories"] },
    { service: "agent", collections: ["agentreports"] },
    { service: "cart", collections: ["carts"] },
    { service: "order", collections: ["orders"] },
    { service: "notification", collections: ["notifications"] },
];

const run = async (): Promise<void> => {
    const connections: mongoose.Connection[] = [];
    const report: string[] = [];

    try {
        for (const target of TARGETS) {
            const connection = await mongoose.createConnection(uriFor(target.service)).asPromise();
            connections.push(connection);

            for (const name of target.collections) {
                const collection = connection.collection(name);
                const count = await collection.countDocuments();
                report.push(`${target.service.padEnd(12)} ${name.padEnd(16)} ${count}`);

                if (APPLY && count > 0) {
                    await collection.deleteMany({});
                }
            }
        }

        // Auth: drop every account except admins, plus their refresh tokens.
        const auth = await mongoose.createConnection(uriFor("auth")).asPromise();
        connections.push(auth);

        const users = auth.collection("users");
        const $or: Record<string, unknown>[] = [{ role: { $ne: "admin" } }];
        if (extraEmail) $or.push({ email: extraEmail.toLowerCase() });
        const doomedFilter = { $or };
        const userCount = await users.countDocuments(doomedFilter);
        report.push(
            `${"auth".padEnd(12)} ${"users".padEnd(16)} ${userCount} (non-admin${extraEmail ? ` + ${extraEmail}` : ""})`,
        );

        const doomedIds = (await users.find(doomedFilter, { projection: { _id: 1 } }).toArray()).map(
            (doc) => doc._id,
        );

        const tokens = auth.collection("refreshtokens");
        const tokenCount = doomedIds.length
            ? await tokens.countDocuments({ userId: { $in: doomedIds } })
            : 0;
        report.push(`${"auth".padEnd(12)} ${"refreshtokens".padEnd(16)} ${tokenCount} (of doomed users)`);

        const adminCount = await users.countDocuments({ role: "admin" });
        report.push(`${"auth".padEnd(12)} ${"users(admin)".padEnd(16)} ${adminCount} (kept)`);

        if (APPLY) {
            if (doomedIds.length > 0) {
                await users.deleteMany({ _id: { $in: doomedIds } });
                await tokens.deleteMany({ userId: { $in: doomedIds } });
            }
        }

        console.log(`${APPLY ? "DELETED" : "FOUND"} demo data:`);
        for (const line of report) console.log(`  ${line}`);
        if (APPLY) console.log("Admin accounts kept; re-run `npm run seed` to restore demo data.");
    } finally {
        await Promise.all(connections.map((connection) => connection.close().catch(() => undefined)));
    }
};

run().catch((error: unknown) => {
    console.error("Cleanup failed:", error);
    process.exit(1);
});
