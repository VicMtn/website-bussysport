/**
 * Messages affichés aux visiteur·e·s pour le contrôle de sécurité (Turnstile).
 * Les détails techniques restent côté logs serveur / console développeur.
 */

export const TURNSTILE_REQUIRED_ERROR =
  "Merci de valider le contrôle de sécurité ci-dessous.";

export const TURNSTILE_EXPIRED_ERROR =
  "Le contrôle de sécurité a expiré. Validez-le à nouveau, puis renvoyez votre demande.";

export const TURNSTILE_UNAVAILABLE_ERROR =
  "Le contrôle de sécurité est momentanément indisponible. Rechargez la page et réessayez.";

export const TURNSTILE_DEFAULT_ERROR =
  "Nous n’avons pas pu vérifier le contrôle de sécurité. Réessayez dans un instant.";

const EXPIRED_KEYS = new Set([
  "timeout-or-duplicate",
  "invalid-input-response",
  110600,
  110620,
  300030,
  300031,
]);

const REQUIRED_KEYS = new Set(["missing-input-response"]);

/** Codes config / réseau / domaine — message unique, sans détail technique. */
const UNAVAILABLE_KEYS = new Set([
  "missing-input-secret",
  "invalid-input-secret",
  "bad-request",
  "internal-error",
  100010,
  100020,
  100030,
  110100,
  110110,
  110200,
  200100,
  200500,
  300010,
  300020,
  600010,
]);

function normalizeKey(errorCode) {
  if (errorCode == null || errorCode === "") return null;
  const numeric = Number(errorCode);
  if (Number.isFinite(numeric)) return numeric;
  return String(errorCode);
}

export function turnstileUserMessage(errorCode) {
  const key = normalizeKey(errorCode);
  if (key == null) return TURNSTILE_DEFAULT_ERROR;
  if (REQUIRED_KEYS.has(key)) return TURNSTILE_REQUIRED_ERROR;
  if (EXPIRED_KEYS.has(key)) return TURNSTILE_EXPIRED_ERROR;
  if (UNAVAILABLE_KEYS.has(key)) return TURNSTILE_UNAVAILABLE_ERROR;
  return TURNSTILE_DEFAULT_ERROR;
}

/** @deprecated Alias conservé pour les imports existants */
export function turnstileClientErrorMessage(errorCode) {
  return turnstileUserMessage(errorCode);
}

/** Plusieurs codes Siteverify → un seul message lisible. */
export function turnstileServerErrorMessage(errorCodes = []) {
  for (const code of errorCodes) {
    const msg = turnstileUserMessage(code);
    if (msg !== TURNSTILE_DEFAULT_ERROR) return msg;
  }
  return TURNSTILE_DEFAULT_ERROR;
}

export const TURNSTILE_LOAD_ERROR = TURNSTILE_UNAVAILABLE_ERROR;
