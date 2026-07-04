/**
 * Provision a TEACHER or SUPER_ADMIN staff account. The first SUPER_ADMIN must
 * be bootstrapped here (there is no self-serve staff sign-up); afterwards a
 * SUPER_ADMIN can add teachers from the Teachers console.
 *
 * Usage (Node 22+, loads secrets from .env.local):
 *   node --env-file=.env.local scripts/provision-staff.mjs <email> <password> "<Display Name>" <TEACHER|SUPER_ADMIN>
 *
 * Requires FIREBASE_ADMIN_* service-account vars in .env.local.
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const [email, password, displayName, roleArg] = process.argv.slice(2);
const role = (roleArg ?? "TEACHER").toUpperCase();

if (!email || !password || !displayName || !["TEACHER", "SUPER_ADMIN"].includes(role)) {
  console.error(
    'Usage: node --env-file=.env.local scripts/provision-staff.mjs <email> <password> "<Display Name>" <TEACHER|SUPER_ADMIN>',
  );
  process.exit(1);
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_ADMIN_* env vars. See .env.local.example.");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const auth = getAuth();
const db = getFirestore();

let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password, displayName });
  console.log(`Reusing existing auth user ${user.uid}`);
} catch {
  user = await auth.createUser({ email, password, displayName, emailVerified: true });
  console.log(`Created auth user ${user.uid}`);
}

await auth.setCustomUserClaims(user.uid, { role });

const now = new Date().toISOString();
await db
  .collection("users")
  .doc(user.uid)
  .set(
    {
      uid: user.uid,
      role,
      email,
      displayName,
      institution: "Hunuwala Dharmaraja Vidyalaya",
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  );

console.log(`✓ ${displayName} <${email}> provisioned as ${role}`);
process.exit(0);
