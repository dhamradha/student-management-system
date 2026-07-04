import { NextResponse } from "next/server";

import { INSTITUTION_NAME } from "@/lib/constants/academic";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { ApiError, requireSuperAdmin } from "@/lib/server/require-super-admin";
import { newTeacherSchema } from "@/lib/validations/student";

export const runtime = "nodejs";

/** POST /api/teachers — SUPER_ADMIN provisions a new teacher account. */
export async function POST(req: Request) {
  try {
    await requireSuperAdmin(req);

    const parsed = newTeacherSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, password, displayName } = parsed.data;

    const user = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
    await adminAuth.setCustomUserClaims(user.uid, { role: "TEACHER" });

    const now = new Date().toISOString();
    await adminDb.collection("users").doc(user.uid).set({
      uid: user.uid,
      role: "TEACHER",
      email,
      displayName,
      institution: INSTITUTION_NAME,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, uid: user.uid });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    const code = (e as { code?: string })?.code;
    const msg =
      code === "auth/email-already-exists"
        ? "An account with this email already exists."
        : "Could not create the teacher account.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
