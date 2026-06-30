/**
 * Clé d’accès Web3Forms — utilisée par le FORMULAIRE DE CONTACT
 * (service tiers d’envoi d’emails depuis un site statique).
 */
window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY = "fac804d6-6f8b-47c3-9adb-7b1a1a03f714";

/**
 * Endpoint Forminit — utilisé par le FORMULAIRE D’ADHÉSION (gère les pièces
 * jointes, contrairement à Web3Forms gratuit).
 *
 * 1. Créez un formulaire sur https://forminit.com (dashboard) — formulaire
 *    NON protégé, pour qu’il accepte les envois sans clé secrète.
 * 2. Réglez le destinataire des notifications sur info@bussysport.ch et, si
 *    souhaité, le sujet de l’email, dans les paramètres du formulaire.
 * 3. Copiez l’URL d’envoi du formulaire ci-dessous (forme : forminit.com/f/<id>).
 *
 * ⚠️ Mettez ICI l’URL publique du formulaire (l’ID dans l’URL), JAMAIS la clé
 * secrète « sk_live_… » : ce fichier est servi au navigateur et le dépôt est public.
 */
window.BUSSYSPORT_FORMINIT_ENDPOINT = "https://forminit.com/f/z37biwpa0ey";
