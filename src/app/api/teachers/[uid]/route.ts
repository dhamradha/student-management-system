import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { ApiError, requireSuperAdmin } from "@/lib/server/require-super-admin";

export const runtime = "nodejs";

/** DELETE /api/teachers/:uid — SUPER_ADMIN revokes a teacher's access. */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    const callerUid = await requireSuperAdmin(req);
    const { uid } = await params;

    if (uid === callerUid) {
      return NextResponse.json(
        { error: "You cannot remove your own account." },
        { status: 400 },
      );
    }

    await adminAuth.deleteUser(uid).catch(() => {});
    await adminDb.collection("users").doc(uid).delete();

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Could not remove teacher." }, {
      status: 400,
    });
  }
}
