/**
 * Import a downloaded Firebase service-account JSON into .env.local, filling in
 * the FIREBASE_ADMIN_* variables (and escaping the private key's newlines).
 * Other variables in .env.local are preserved.
 *
 * Usage:
 *   node scripts/import-service-account.mjs [path-to-service-account.json]
 * Defaults to ./service-account.json
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const saPath = process.argv[2] ?? "service-account.json";
if (!existsSync(saPath)) {
  console.error(`Not found: ${saPath}`);
  console.error(
    "Download it from Firebase Console → Project settings → Service accounts → Generate new private key.",
  );
  process.exit(1);
}

const sa = JSON.parse(readFileSync(saPath, "utf8"));
if (!sa.private_key || !sa.client_email || !sa.project_id) {
  console.error("That file doesn't look like a service-account key.");
  process.exit(1);
}

const updates = {
  FIREBASE_ADMIN_PROJECT_ID: sa.project_id,
  FIREBASE_ADMIN_CLIENT_EMAIL: sa.client_email,
  FIREBASE_ADMIN_PRIVATE_KEY: `"${sa.private_key.replace(/\n/g, "\\n")}"`,
};

const lines = existsSync(".env.local")
  ? readFileSync(".env.local", "utf8").split(/\r?\n/)
  : [];

for (const [key, value] of Object.entries(updates)) {
  const line = `${key}=${value}`;
  const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
  if (idx >= 0) lines[idx] = line;
  else lines.push(line);
}

writeFileSync(".env.local", lines.join("\n"));
console.log(`✓ Imported FIREBASE_ADMIN_* into .env.local from ${saPath}`);
console.log(`  project: ${sa.project_id}`);
console.log(`  client:  ${sa.client_email}`);
