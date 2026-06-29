import { computed, reactive, ref } from "vue";
import { activities } from "@/data/activities";
import { useSubmissionThrottle } from "./useSubmissionThrottle";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const MAIL_FALLBACK_HTML =
  'Si le problème persiste, écrivez-nous à <a href="mailto:info@bussysport.ch" class="underline font-bold">info@bussysport.ch</a>.';

const SEND_ERROR =
  "Une erreur est survenue lors de l’envoi. Réessayez dans un instant ou contactez-nous à info@bussysport.ch.";

export const EMERGENCY_RELATIONS = [
  { value: "parent", label: "Parent" },
  { value: "frere-soeur", label: "Frère / Sœur" },
  { value: "conjoint", label: "Conjoint·e / Partenaire" },
  { value: "autre", label: "Autre" },
];

export const REFERRAL_SOURCES = [
  { value: "bouche-a-oreille", label: "Bouche-à-oreille (ami, famille)" },
  { value: "reseaux-sociaux", label: "Réseaux sociaux (Instagram, Facebook…)" },
  { value: "internet", label: "Recherche internet / site web" },
  { value: "evenement", label: "Événement / manifestation" },
  { value: "flyer-affiche", label: "Flyer / affiche" },
  { value: "autre", label: "Autre" },
];

const GENDER_LABELS = {
  femme: "Femme",
  homme: "Homme",
  autre: "Autre / Ne souhaite pas préciser",
};

const ACTIVITY_KEYS = activities.map((a) => a.slug);
const ACTIVITY_LABELS = Object.fromEntries(
  activities.map((a) => [a.slug, a.label]),
);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** YYYY-MM-DD → DD.MM.YYYY (sans dépendance, pour l'email). */
function formatBirthdateFr(birthdate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthdate);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : birthdate;
}

export const MIN_MEMBERSHIP_AGE = 16;

/** Dernière date de naissance autorisée pour avoir l'âge minimum révolu. */
export function maxBirthdateForMinAge(minAge = MIN_MEMBERSHIP_AGE) {
  const today = new Date();
  const y = today.getFullYear() - minAge;
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function meetsMinMembershipAge(age, minAge = MIN_MEMBERSHIP_AGE) {
  return age !== null && age >= minAge;
}

/** Âge révolu à la date du jour (fuseau local du navigateur). */
export function computeAge(birthdate) {
  if (!birthdate) return null;
  const birth = new Date(`${birthdate}T12:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

/** 16 ans révolus mais pas encore 18 ans révolus. */
export function requiresParentAuthorization(age) {
  return age !== null && age >= 16 && age < 18;
}

export function useAdhesionForm({ throttle } = {}) {
  const form = reactive({
    firstName: "",
    lastName: "",
    birthdate: "",
    gender: "",
    nationality: "Suisse",
    address: "",
    zip: "",
    city: "",
    phone: "",
    email: "",
    avs: "",
    hasInsurance: "",
    insuranceName: "",
    medicalContraindication: "",
    medicalDetails: "",
    activities: [],
    emergencyRelation: "",
    emergencyName: "",
    emergencyPhone: "",
    referralSource: "",
    referralSourceOther: "",
    remarks: "",
    imageRights: false,
    acceptTerms: false,
    website: "", // honeypot
  });

  const parentAuthFile = ref(null);
  const parentAuthFileName = ref("");

  const submissionThrottle =
    throttle ??
    useSubmissionThrottle({
      key: "bussysport:adhesion:lastSubmit",
      cooldownMs: 10_000,
    });

  const loading = ref(false);
  const successText = ref("");
  const errorHtml = ref("");

  const age = computed(() => computeAge(form.birthdate));
  const maxBirthdate = maxBirthdateForMinAge();
  const needsParentAuth = computed(() =>
    requiresParentAuthorization(age.value),
  );

  function reset() {
    form.firstName = "";
    form.lastName = "";
    form.birthdate = "";
    form.gender = "";
    form.nationality = "Suisse";
    form.address = "";
    form.zip = "";
    form.city = "";
    form.phone = "";
    form.email = "";
    form.avs = "";
    form.hasInsurance = "";
    form.insuranceName = "";
    form.medicalContraindication = "";
    form.medicalDetails = "";
    form.activities = [];
    form.emergencyRelation = "";
    form.emergencyName = "";
    form.emergencyPhone = "";
    form.referralSource = "";
    form.referralSourceOther = "";
    form.remarks = "";
    form.imageRights = false;
    form.acceptTerms = false;
    form.website = "";
    parentAuthFile.value = null;
    parentAuthFileName.value = "";
  }

  function showSuccess(text) {
    successText.value =
      text ||
      "Votre demande d'adhésion a bien été envoyée. Nous vous contacterons prochainement !";
    errorHtml.value = "";
    setTimeout(() => {
      successText.value = "";
    }, 10000);
  }

  function showError(html) {
    errorHtml.value = html;
    successText.value = "";
  }

  function showErrorPlain(msg) {
    errorHtml.value = escapeHtml(msg);
    successText.value = "";
  }

  function toggleActivity(slug) {
    const idx = form.activities.indexOf(slug);
    if (idx === -1) {
      form.activities.push(slug);
    } else {
      form.activities.splice(idx, 1);
    }
  }

  function onParentAuthChange(event) {
    const file = event.target.files?.[0] ?? null;
    parentAuthFile.value = null;
    parentAuthFileName.value = "";

    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showErrorPlain(
        "Format de fichier non accepté. Merci d'envoyer un PDF ou une image (JPG, PNG).",
      );
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showErrorPlain("Le fichier est trop volumineux (maximum 5 Mo).");
      event.target.value = "";
      return;
    }

    parentAuthFile.value = file;
    parentAuthFileName.value = file.name;
    errorHtml.value = "";
  }

  function validate() {
    const required = [
      ["firstName", "le prénom"],
      ["lastName", "le nom"],
      ["birthdate", "la date de naissance"],
      ["address", "l'adresse"],
      ["zip", "le NPA"],
      ["city", "la localité"],
      ["phone", "le téléphone"],
      ["email", "l'adresse email"],
      ["emergencyRelation", "le lien avec le contact d'urgence"],
      ["emergencyName", "le contact d'urgence"],
      ["emergencyPhone", "le téléphone d'urgence"],
    ];

    for (const [field, label] of required) {
      if (!String(form[field]).trim()) {
        showErrorPlain(`Veuillez renseigner ${label}.`);
        return false;
      }
    }

    if (age.value === null) {
      showErrorPlain("Date de naissance invalide.");
      return false;
    }

    if (!meetsMinMembershipAge(age.value)) {
      showErrorPlain(
        `L'adhésion est ouverte à partir de ${MIN_MEMBERSHIP_AGE} ans révolus.`,
      );
      return false;
    }

    if (!EMERGENCY_RELATIONS.some((r) => r.value === form.emergencyRelation)) {
      showErrorPlain(
        "Veuillez sélectionner le lien avec le contact d'urgence.",
      );
      return false;
    }

    if (!isValidEmail(form.email.trim())) {
      showErrorPlain("Veuillez saisir une adresse email valide.");
      return false;
    }

    if (form.activities.length === 0) {
      showErrorPlain("Veuillez sélectionner au moins une activité.");
      return false;
    }

    if (form.hasInsurance === "") {
      showErrorPlain(
        "Veuillez indiquer si vous disposez d'une assurance accident.",
      );
      return false;
    }

    if (form.hasInsurance === "oui" && !form.insuranceName.trim()) {
      showErrorPlain("Veuillez indiquer le nom de votre assureur.");
      return false;
    }

    if (!["oui", "non"].includes(form.medicalContraindication)) {
      showErrorPlain(
        "Veuillez indiquer si vous avez une contre-indication médicale.",
      );
      return false;
    }

    if (form.medicalContraindication === "oui" && !form.medicalDetails.trim()) {
      showErrorPlain("Veuillez préciser votre contre-indication médicale.");
      return false;
    }

    if (!REFERRAL_SOURCES.some((s) => s.value === form.referralSource)) {
      showErrorPlain("Veuillez indiquer comment vous avez connu BussySport.");
      return false;
    }

    if (!form.acceptTerms) {
      showErrorPlain("Veuillez accepter les conditions d'adhésion.");
      return false;
    }

    if (needsParentAuth.value && !parentAuthFile.value) {
      showErrorPlain(
        "Les adhérent·e·s de 16 à 18 ans non révolus doivent joindre l'autorisation parentale signée.",
      );
      return false;
    }

    return true;
  }

  /** Récapitulatif lisible envoyé dans le corps de l'email Web3Forms. */
  function buildSummary() {
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const activityLabels = form.activities.map(
      (slug) => ACTIVITY_LABELS[slug] ?? slug,
    );
    const insuranceLabel =
      form.hasInsurance === "oui"
        ? `Oui — ${form.insuranceName.trim()}`
        : "Non";
    const relation =
      EMERGENCY_RELATIONS.find((r) => r.value === form.emergencyRelation)
        ?.label ?? form.emergencyRelation;
    let referralLabel =
      REFERRAL_SOURCES.find((s) => s.value === form.referralSource)?.label ??
      form.referralSource;
    if (form.referralSource === "autre" && form.referralSourceOther.trim()) {
      referralLabel += ` — ${form.referralSourceOther.trim()}`;
    }
    const medicalLabel =
      form.medicalContraindication === "oui"
        ? `Contre-indication signalée : ${form.medicalDetails.trim()}`
        : "Aucune contre-indication déclarée (apte à la pratique)";

    return [
      "NOUVELLE DEMANDE D'ADHÉSION",
      "",
      "— Identité —",
      `Prénom : ${form.firstName.trim()}`,
      `Nom : ${form.lastName.trim()}`,
      `Date de naissance : ${formatBirthdateFr(form.birthdate)} (${age.value} ans)`,
      `Sexe : ${form.gender ? GENDER_LABELS[form.gender] : "—"}`,
      `Nationalité : ${form.nationality.trim() || "—"}`,
      "",
      "— Coordonnées —",
      `Adresse : ${form.address.trim()}`,
      `NPA / Localité : ${form.zip.trim()} ${form.city.trim()}`,
      `Téléphone : ${form.phone.trim()}`,
      `Email : ${form.email.trim()}`,
      `N° AVS : ${form.avs.trim() || "—"}`,
      "",
      "— Assurance accident —",
      insuranceLabel,
      "",
      "— Aptitude médicale —",
      medicalLabel,
      "",
      "— Activités souhaitées —",
      activityLabels.join(", "),
      "",
      "— Contact d'urgence —",
      `${relation} — ${form.emergencyName.trim()}`,
      `Téléphone : ${form.emergencyPhone.trim()}`,
      "",
      "— Autorisation parentale —",
      needsParentAuth.value ? "Requise — jointe à cet email" : "Non requise",
      "",
      "— Comment a connu BussySport —",
      referralLabel,
      "",
      "— Droit à l'image —",
      form.imageRights
        ? "Accordé (publication photos/vidéos en ligne autorisée)"
        : "Refusé (pas de publication en ligne)",
      "",
      "— Remarques —",
      form.remarks.trim() || "—",
    ].join("\n");
  }

  async function submit() {
    successText.value = "";
    errorHtml.value = "";

    if (!validate()) return;

    if (!submissionThrottle.tryConsume()) {
      const seconds = submissionThrottle.cooldownLeft.value;
      showErrorPlain(
        `Merci de patienter ${seconds} seconde${seconds > 1 ? "s" : ""} avant de renvoyer une demande.`,
      );
      return;
    }

    // Honeypot : un bot qui remplit ce champ caché reçoit un faux succès.
    if (form.website.trim()) {
      showSuccess();
      reset();
      return;
    }

    const accessKey = (window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY || "").trim();
    if (!accessKey) {
      showError(`Le formulaire n'est pas configuré. ${MAIL_FALLBACK_HTML}`);
      return;
    }

    loading.value = true;

    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;

      // multipart/form-data : requis pour joindre l'autorisation parentale.
      const body = new FormData();
      body.append("access_key", accessKey);
      body.append(
        "subject",
        `[BussySport] Nouvelle demande d'adhésion — ${fullName}`,
      );
      body.append("from_name", "BussySport — Adhésion");
      body.append("name", fullName);
      body.append("email", form.email.trim());
      body.append("replyto", form.email.trim());
      body.append("message", buildSummary());

      if (parentAuthFile.value) {
        body.append(
          "attachment",
          parentAuthFile.value,
          parentAuthFile.value.name,
        );
      }

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        showError(`Réponse du service d'envoi invalide. ${MAIL_FALLBACK_HTML}`);
        return;
      }

      if (data?.success === true) {
        showSuccess();
        reset();
      } else if (data?.message) {
        showErrorPlain(data.message);
      } else {
        showError(SEND_ERROR);
      }
    } catch {
      showError(SEND_ERROR);
    } finally {
      loading.value = false;
    }
  }

  return {
    form,
    activities: ACTIVITY_KEYS,
    activityLabels: activities,
    emergencyRelations: EMERGENCY_RELATIONS,
    referralSources: REFERRAL_SOURCES,
    age,
    maxBirthdate,
    minMembershipAge: MIN_MEMBERSHIP_AGE,
    needsParentAuth,
    parentAuthFileName,
    loading,
    successText,
    errorHtml,
    cooldownLeft: submissionThrottle.cooldownLeft,
    toggleActivity,
    onParentAuthChange,
    submit,
  };
}
