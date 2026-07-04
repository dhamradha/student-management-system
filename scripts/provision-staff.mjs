/**
 * Provision an ADMIN or SUPER_ADMIN account (there is no self-serve UI for
 * staff — the first SUPER_ADMIN must be bootstrapped here).
 *
 * Usage (Node 22+, loads secrets from .env.local):
 *   node --env-file=.env.local scripts/provision-staff.mjs <email> <password> <ADMIN|SUPER_ADMIN>
 *
 * Requires FIREBASE_ADMIN_* service-account vars in .env.local.
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const [email, password, roleArg] = process.argv.slice(2);
const role = (roleArg ?? "ADMIN").toUpperCase();

if (!email || !password || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
  console.error(
    "Usage: node --env-file=.env.local scripts/provision-staff.mjs <email> <password> <ADMIN|SUPER_ADMIN>",
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

// Create (or reuse) the auth user.
let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password });
  console.log(`Reusing existing auth user ${user.uid}`);
} catch {
  user = await auth.createUser({ email, password, emailVerified: true });
  console.log(`Created auth user ${user.uid}`);
}

// Mirror the role into a custom claim (fast checks) and the Firestore doc.
await auth.setCustomUserClaims(user.uid, { role });

const now = new Date().toISOString();
await db
  .collection("users")
  .doc(user.uid)
  .set(
    {
      uid: user.uid,
      role,
      isApproved: true,
      status: "approved",
      institution: "Hunuwala Dharmaraja Vidyalaya",
      admissionNo: null,
      academicData: null,
      guardianData: null,
      onboardingStep: 2,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  );

console.log(`✓ ${email} provisioned as ${role}`);
process.exit(0);
