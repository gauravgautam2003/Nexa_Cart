#!/usr/bin/env node
/**
 * Starts the gateway plus every microservice in one terminal.
 * Each child gets a colourised prefix so logs stay readable.
 *
 *   npm run dev:all          # everything
 *   npm run dev:all -- product agent   # only these
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const TARGETS = [
    { name: "gateway", dir: path.join(root, "gateway"), color: "\x1b[35m" },
    { name: "auth", dir: path.join(root, "services", "auth"), color: "\x1b[36m" },
    { name: "product", dir: path.join(root, "services", "product"), color: "\x1b[32m" },
    { name: "cart", dir: path.join(root, "services", "cart"), color: "\x1b[33m" },
    { name: "order", dir: path.join(root, "services", "order"), color: "\x1b[34m" },
    { name: "payment", dir: path.join(root, "services", "payment"), color: "\x1b[31m" },
    { name: "inventory", dir: path.join(root, "services", "inventory"), color: "\x1b[95m" },
    { name: "notification", dir: path.join(root, "services", "notification"), color: "\x1b[94m" },
    { name: "agent", dir: path.join(root, "services", "agent"), color: "\x1b[92m" },
];

const RESET = "\x1b[0m";
const filters = process.argv.slice(2);
const targets = filters.length > 0 ? TARGETS.filter((t) => filters.includes(t.name)) : TARGETS;

if (targets.length === 0) {
    console.error(`No matching services. Known: ${TARGETS.map((t) => t.name).join(", ")}`);
    process.exit(1);
}

const children = [];

for (const target of targets) {
    if (!existsSync(path.join(target.dir, "node_modules"))) {
        console.error(`${target.name}: node_modules missing — run npm install in ${path.relative(root, target.dir)}`);
        process.exit(1);
    }

    const child = spawn("npm", ["run", "dev"], {
        cwd: target.dir,
        shell: process.platform === "win32",
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
    });

    const prefix = `${target.color}[${target.name}]${RESET} `;

    const pipe = (stream, sink) => {
        let buffer = "";
        stream.on("data", (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? "";
            for (const line of lines) sink.write(`${prefix}${line}\n`);
        });
    };

    pipe(child.stdout, process.stdout);
    pipe(child.stderr, process.stderr);

    child.on("exit", (code) => {
        console.log(`${prefix}exited with code ${code}`);
        if (code !== 0) shutdown(code ?? 1);
    });

    children.push({ name: target.name, child });
}

console.log(`Starting: ${children.map((c) => c.name).join(", ")}  (Ctrl+C to stop)`);

function shutdown(code = 0) {
    for (const { child } of children) {
        if (!child.killed) child.kill("SIGTERM");
    }
    setTimeout(() => process.exit(code), 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
