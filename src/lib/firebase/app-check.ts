import type { FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

let started = false;

/**
 * Initialise Firebase App Check (reCAPTCHA v3) so Firebase only accepts
 * requests from this genuine app — protecting Firestore/Auth (and the public
 * form endpoint) from bots and direct abuse.
 *
 * No-ops on the server, or when no site key is configured, so the app runs
 * normally before App Check is set up. In non-production it enables a debug
 * token so localhost can attest (register it under App Check → debug tokens).
 */
export function initAppCheck(app: FirebaseApp): void {
  if (typeof window === "undefined" || started) return;

  const siteKey = process.env.NEXT_PUBLIC_APPCHECK_RECAPTCHA_SITE_KEY;
  if (!siteKey) return;

  started = true;

  if (process.env.NODE_ENV !== "production") {
    const debug = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;
    // @ts-expect-error — App Check reads this global to use a debug token.
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = debug ? debug : true;
  }

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    // Ignore re-initialisation during hot reloads.
  }
}
