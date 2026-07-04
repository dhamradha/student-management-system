import "server-only";

import { adminAuth, adminDb } from "@/lib/firebase/admin";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Verify the request's Firebase ID token and assert the caller is a
 * SUPER_ADMIN. Returns the caller's uid, or throws an ApiError.
 */
export async function requireSuperAdmin(req: Request): Promise<string> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new ApiError(401, "Missing authentication token");

  let uid: string;
  try {
    uid = (await adminAuth.verifyIdToken(token)).uid;
  } catch {
    throw new ApiError(401, "Invalid authentication token");
  }

  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists || snap.data()?.role !== "SUPER_ADMIN") {
    throw new ApiError(403, "Super admin access required");
  }
  return uid;
}
