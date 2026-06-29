import { computed, reactive, ref } from "vue";
import { activities } from "@/data/activities";
import { useSubmissionThrottle } from "./useSubmissionThrottle";
import { useTurnstile } from "./useTurnstile";
import { TURNSTILE_REQUIRED_ERROR } from "@/utils/turnstileErrors";

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

const ACTIVITY_KEYS = activities.map((a) => a.slug);
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
    activities: [],
    emergencyRelation: "",
    emergencyName: "",
    emergencyPhone: "",
    remarks: "",
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

  const turnstile = useTurnstile();
  const captchaRequired = computed(() => turnstile.enabled.value);

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
    form.activities = [];
    form.emergencyRelation = "";
    form.emergencyName = "";
    form.emergencyPhone = "";
    form.remarks = "";
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

    if (captchaRequired.value && !turnstile.getToken()) {
      showErrorPlain(turnstile.errorMessage.value || TURNSTILE_REQUIRED_ERROR);
      return false;
    }

    return true;
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

    if (form.website.trim()) {
      showSuccess();
      reset();
      return;
    }

    loading.value = true;

    try {
      const body = new FormData();
      body.append("firstName", form.firstName.trim());
      body.append("lastName", form.lastName.trim());
      body.append("birthdate", form.birthdate);
      body.append("gender", form.gender);
      body.append("nationality", form.nationality.trim());
      body.append("address", form.address.trim());
      body.append("zip", form.zip.trim());
      body.append("city", form.city.trim());
      body.append("phone", form.phone.trim());
      body.append("email", form.email.trim());
      body.append("avs", form.avs.trim());
      body.append("hasInsurance", form.hasInsurance);
      body.append("insuranceName", form.insuranceName.trim());
      body.append("activities", JSON.stringify(form.activities));
      body.append("emergencyRelation", form.emergencyRelation);
      body.append("emergencyName", form.emergencyName.trim());
      body.append("emergencyPhone", form.emergencyPhone.trim());
      body.append("remarks", form.remarks.trim());
      body.append("acceptTerms", form.acceptTerms ? "1" : "0");
      body.append("website", form.website);

      const captchaToken = turnstile.getToken();
      if (captchaToken) {
        body.append("cf-turnstile-response", captchaToken);
      }

      if (parentAuthFile.value) {
        body.append(
          "parentAuth",
          parentAuthFile.value,
          parentAuthFile.value.name,
        );
      }

      const res = await fetch("/adhesion.php", {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        showError(`Une erreur est survenue. ${MAIL_FALLBACK_HTML}`);
        return;
      }

      if (data?.success === true) {
        showSuccess(data.message);
        reset();
        turnstile.reset();
      } else if (data?.message) {
        showErrorPlain(data.message);
        turnstile.reset();
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
    age,
    maxBirthdate,
    minMembershipAge: MIN_MEMBERSHIP_AGE,
    needsParentAuth,
    parentAuthFileName,
    loading,
    successText,
    errorHtml,
    cooldownLeft: submissionThrottle.cooldownLeft,
    captchaRequired,
    turnstileContainerRef: turnstile.containerRef,
    turnstileReady: turnstile.ready,
    turnstileErrorMessage: turnstile.errorMessage,
    toggleActivity,
    onParentAuthChange,
    submit,
  };
}
