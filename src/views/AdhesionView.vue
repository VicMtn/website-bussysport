<script setup>
import { useHead } from "@unhead/vue";
import { RouterLink } from "vue-router";
import { useAdhesionForm } from "@/composables/useAdhesionForm";

useHead({
  title: "Demande d'adhésion – BussySport Bussigny",
  meta: [
    {
      name: "description",
      content:
        "Formulaire d'adhésion à l'association sportive BussySport à Bussigny-près-Lausanne. Rejoignez nos activités running, cross-training, street workout et tournois.",
    },
  ],
  link: [{ rel: "canonical", href: "https://bussysport.ch/adhesion" }],
});

const {
  form,
  activityLabels,
  emergencyRelations,
  referralSources,
  age,
  maxBirthdate,
  minMembershipAge,
  needsParentAuth,
  parentAuthFileName,
  loading,
  successText,
  errorHtml,
  cooldownLeft,
  toggleActivity,
  onParentAuthChange,
  submit,
} = useAdhesionForm();
</script>

<template>
  <section
    class="pt-32 pb-16 px-4 text-white"
    style="background: linear-gradient(135deg, #0d2137 0%, #1565c0 100%)"
  >
    <div class="max-w-5xl mx-auto">
      <nav class="flex items-center gap-2 text-xs text-white/60 mb-6">
        <RouterLink to="/" class="hover:text-white">Accueil</RouterLink>
        <span>›</span>
        <span class="text-white">Adhésion</span>
      </nav>
      <h1 class="font-display font-black text-4xl sm:text-5xl mb-4">
        Demande d'adhésion
      </h1>
      <p class="text-white/75 max-w-2xl leading-relaxed">
        Rejoignez BussySport en remplissant ce formulaire. Toutes les
        informations seront transmises à notre comité pour le traitement de
        votre demande.
      </p>
    </div>
  </section>

  <section class="py-16 bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <form
        class="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-10"
        novalidate
        data-testid="adhesion-form"
        @submit.prevent="submit"
      >
        <!-- Honeypot -->
        <div class="hidden" aria-hidden="true">
          <label for="website">Website</label>
          <input
            id="website"
            v-model="form.website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <!-- Identité -->
        <fieldset class="space-y-5">
          <legend
            class="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-2"
          >
            <i class="fas fa-user text-primary text-sm" aria-hidden="true"></i>
            Identité
          </legend>
          <p class="text-sm text-gray-400 -mt-2 mb-4">
            Informations personnelles de l'adhérent·e
          </p>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label for="firstName" class="field-label">
                Prénom <span class="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                autocomplete="given-name"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
            <div>
              <label for="lastName" class="field-label">
                Nom <span class="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                autocomplete="family-name"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label for="birthdate" class="field-label">
                Date de naissance <span class="text-red-500">*</span>
              </label>
              <input
                id="birthdate"
                v-model="form.birthdate"
                type="date"
                required
                :max="maxBirthdate"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
              <p class="text-xs text-gray-400 mt-1.5">
                Adhésion à partir de {{ minMembershipAge }} ans révolus.
              </p>
              <p v-if="age !== null" class="text-xs text-gray-400 mt-1">
                Âge : {{ age }} ans
                <span
                  v-if="needsParentAuth"
                  class="text-amber-600 font-semibold"
                >
                  — autorisation parentale requise
                </span>
              </p>
            </div>
            <div>
              <label for="gender" class="field-label">Sexe</label>
              <select
                id="gender"
                v-model="form.gender"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              >
                <option value="">—</option>
                <option value="femme">Femme</option>
                <option value="homme">Homme</option>
                <option value="autre">Autre / Ne souhaite pas préciser</option>
              </select>
            </div>
          </div>

          <div>
            <label for="nationality" class="field-label">Nationalité</label>
            <input
              id="nationality"
              v-model="form.nationality"
              type="text"
              class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
            />
          </div>
        </fieldset>

        <!-- Coordonnées -->
        <fieldset class="space-y-5">
          <legend
            class="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-2"
          >
            <i
              class="fas fa-location-dot text-primary text-sm"
              aria-hidden="true"
            ></i>
            Coordonnées
          </legend>

          <div>
            <label for="address" class="field-label">
              Rue et numéro <span class="text-red-500">*</span>
            </label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              required
              autocomplete="street-address"
              class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
            />
          </div>

          <div class="grid sm:grid-cols-3 gap-5">
            <div>
              <label for="zip" class="field-label">
                NPA <span class="text-red-500">*</span>
              </label>
              <input
                id="zip"
                v-model="form.zip"
                type="text"
                required
                inputmode="numeric"
                autocomplete="postal-code"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
            <div class="sm:col-span-2">
              <label for="city" class="field-label">
                Localité <span class="text-red-500">*</span>
              </label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                required
                autocomplete="address-level2"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label for="phone" class="field-label">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                autocomplete="tel"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
            <div>
              <label for="email" class="field-label">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label for="avs" class="field-label">N° AVS (optionnel)</label>
            <input
              id="avs"
              v-model="form.avs"
              type="text"
              inputmode="numeric"
              placeholder="756.XXXX.XXXX.XX"
              class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
            />
          </div>
        </fieldset>

        <!-- Assurance -->
        <fieldset class="space-y-5">
          <legend
            class="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-2"
          >
            <i
              class="fas fa-shield-halved text-primary text-sm"
              aria-hidden="true"
            ></i>
            Assurance accident
          </legend>

          <div>
            <span class="field-label block mb-3">
              Disposez-vous d'une assurance accident ?
              <span class="text-red-500">*</span>
            </span>
            <div class="flex flex-wrap gap-4">
              <label
                class="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  v-model="form.hasInsurance"
                  type="radio"
                  value="oui"
                  class="accent-primary"
                />
                Oui
              </label>
              <label
                class="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  v-model="form.hasInsurance"
                  type="radio"
                  value="non"
                  class="accent-primary"
                />
                Non
              </label>
            </div>
          </div>

          <div v-if="form.hasInsurance === 'oui'">
            <label for="insuranceName" class="field-label">
              Nom de l'assureur <span class="text-red-500">*</span>
            </label>
            <input
              id="insuranceName"
              v-model="form.insuranceName"
              type="text"
              class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
            />
          </div>
        </fieldset>

        <!-- Aptitude médicale -->
        <fieldset class="space-y-5">
          <legend
            class="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-2"
          >
            <i
              class="fas fa-heart-pulse text-primary text-sm"
              aria-hidden="true"
            ></i>
            Aptitude médicale
          </legend>

          <div>
            <span class="field-label block mb-3">
              Avez-vous une contre-indication médicale à la pratique d'une
              activité physique moyennement à très soutenue ?
              <span class="text-red-500">*</span>
            </span>
            <div class="flex flex-wrap gap-4">
              <label
                class="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  v-model="form.medicalContraindication"
                  type="radio"
                  value="non"
                  class="accent-primary"
                />
                Non
              </label>
              <label
                class="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  v-model="form.medicalContraindication"
                  type="radio"
                  value="oui"
                  class="accent-primary"
                />
                Oui
              </label>
            </div>
            <p class="text-xs text-gray-400 mt-2">
              En répondant « Non », je certifie ne pas avoir de contre-indication
              médicale à la pratique sportive.
            </p>
          </div>

          <div v-if="form.medicalContraindication === 'oui'">
            <label for="medicalDetails" class="field-label">
              Merci de préciser <span class="text-red-500">*</span>
            </label>
            <textarea
              id="medicalDetails"
              v-model="form.medicalDetails"
              rows="2"
              class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm resize-none"
              placeholder="Nature de la contre-indication, restrictions éventuelles…"
            ></textarea>
          </div>
        </fieldset>

        <!-- Activités -->
        <fieldset class="space-y-5">
          <legend
            class="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-2"
          >
            <i
              class="fas fa-dumbbell text-primary text-sm"
              aria-hidden="true"
            ></i>
            Activités souhaitées
          </legend>
          <p class="text-sm text-gray-400 -mt-2 mb-2">
            Sélectionnez une ou plusieurs activités
            <span class="text-red-500">*</span>
          </p>

          <div class="grid sm:grid-cols-2 gap-3">
            <label
              v-for="activity in activityLabels"
              :key="activity.slug"
              class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors"
              :class="
                form.activities.includes(activity.slug)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <input
                type="checkbox"
                :checked="form.activities.includes(activity.slug)"
                class="accent-primary"
                @change="toggleActivity(activity.slug)"
              />
              <i
                :class="['fas', activity.icon, 'text-primary text-sm']"
                aria-hidden="true"
              ></i>
              <span class="text-sm font-medium text-gray-800">{{
                activity.label
              }}</span>
            </label>
          </div>
        </fieldset>

        <!-- Urgence -->
        <fieldset class="space-y-5">
          <legend
            class="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-2"
          >
            <i
              class="fas fa-phone-volume text-primary text-sm"
              aria-hidden="true"
            ></i>
            Contact d'urgence
          </legend>

          <div class="space-y-5">
            <div>
              <label for="emergencyRelation" class="field-label">
                Lien de parenté <span class="text-red-500">*</span>
              </label>
              <select
                id="emergencyRelation"
                v-model="form.emergencyRelation"
                required
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              >
                <option value="">Choisissez…</option>
                <option
                  v-for="relation in emergencyRelations"
                  :key="relation.value"
                  :value="relation.value"
                >
                  {{ relation.label }}
                </option>
              </select>
            </div>
            <div>
              <label for="emergencyName" class="field-label">
                Nom et prénom <span class="text-red-500">*</span>
              </label>
              <input
                id="emergencyName"
                v-model="form.emergencyName"
                type="text"
                required
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
            <div>
              <label for="emergencyPhone" class="field-label">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <input
                id="emergencyPhone"
                v-model="form.emergencyPhone"
                type="tel"
                required
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
              />
            </div>
          </div>
        </fieldset>

        <!-- Autorisation parentale (16–17 ans) -->
        <div
          v-if="needsParentAuth"
          class="rounded-2xl p-6 border-2 border-amber-200 bg-amber-50 space-y-5"
          data-testid="parent-auth-section"
        >
          <div class="flex items-start gap-3">
            <i
              class="fas fa-file-signature text-amber-600 text-lg mt-0.5"
              aria-hidden="true"
            ></i>
            <div>
              <h3 class="font-display font-bold text-gray-900 mb-1">
                Autorisation parentale obligatoire
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                Pour les adhérent·e·s de
                <strong>16 à 18 ans non révolus</strong>, une autorisation
                signée par un parent ou tuteur légal est requise. Téléchargez le
                document, faites-le signer, puis chargez-le ci-dessous (PDF, JPG
                ou PNG, max. 5 Mo).
              </p>
            </div>
          </div>

          <a
            href="/documents/autorisation-parentale.html"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style="background: linear-gradient(135deg, #0d2137, #1565c0)"
            data-testid="download-parent-auth"
          >
            <i class="fas fa-download" aria-hidden="true"></i>
            Télécharger l'autorisation parentale
          </a>

          <div>
            <label for="parentAuth" class="field-label">
              Document signé <span class="text-red-500">*</span>
            </label>
            <input
              id="parentAuth"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              class="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer"
              data-testid="parent-auth-upload"
              @change="onParentAuthChange"
            />
            <p
              v-if="parentAuthFileName"
              class="text-xs text-green-700 mt-2 font-medium"
            >
              <i class="fas fa-check-circle mr-1" aria-hidden="true"></i>
              {{ parentAuthFileName }}
            </p>
          </div>
        </div>

        <!-- Comment a connu BussySport -->
        <div>
          <label for="referralSource" class="field-label">
            Comment avez-vous connu BussySport ?
            <span class="text-red-500">*</span>
          </label>
          <select
            id="referralSource"
            v-model="form.referralSource"
            required
            class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
          >
            <option value="">Choisissez…</option>
            <option
              v-for="source in referralSources"
              :key="source.value"
              :value="source.value"
            >
              {{ source.label }}
            </option>
          </select>
          <input
            v-if="form.referralSource === 'autre'"
            v-model="form.referralSourceOther"
            type="text"
            class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm mt-3"
            placeholder="Précisez (optionnel)"
          />
        </div>

        <!-- Remarques -->
        <div>
          <label for="remarks" class="field-label">Remarques (optionnel)</label>
          <textarea
            id="remarks"
            v-model="form.remarks"
            rows="3"
            class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm resize-none"
            placeholder="Informations complémentaires, contraintes médicales, etc."
          ></textarea>
        </div>

        <!-- Droit à l'image -->
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            v-model="form.imageRights"
            type="checkbox"
            class="mt-1 accent-primary"
          />
          <span class="text-sm text-gray-600 leading-relaxed">
            J'autorise BussySport à publier en ligne (site internet, réseaux
            sociaux) des photos et vidéos prises dans le cadre des activités de
            l'association sur lesquelles je pourrais apparaître.
            <span class="text-gray-400">(facultatif)</span>
          </span>
        </label>

        <!-- Acceptation -->
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="mt-1 accent-primary"
          />
          <span class="text-sm text-gray-600 leading-relaxed">
            Je déclare que les informations fournies sont exactes et j'accepte
            les
            <RouterLink
              to="/mentions-legales"
              class="text-primary font-semibold hover:underline"
            >
              conditions générales
            </RouterLink>
            et la politique de confidentialité de BussySport.
            <span class="text-red-500">*</span>
          </span>
        </label>

        <!-- Feedback -->
        <div
          v-if="successText"
          class="p-4 rounded-xl text-sm font-semibold"
          style="background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7"
          role="status"
        >
          <i class="fas fa-check-circle mr-2" aria-hidden="true"></i>
          {{ successText }}
        </div>

        <div
          v-if="errorHtml"
          class="p-4 rounded-xl text-sm font-semibold"
          style="background: #ffebee; color: #c62828; border: 1px solid #ffcdd2"
          role="alert"
        >
          <i class="fas fa-exclamation-circle mr-2" aria-hidden="true"></i>
          <span v-html="errorHtml"></span>
        </div>

        <button
          type="submit"
          :disabled="loading || cooldownLeft > 0"
          class="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3"
          data-testid="adhesion-submit-btn"
        >
          <i
            :class="[
              'fas',
              loading
                ? 'fa-spinner fa-spin-anim'
                : cooldownLeft > 0
                  ? 'fa-hourglass-half'
                  : 'fa-paper-plane',
            ]"
            aria-hidden="true"
          ></i>
          <span v-if="loading">Envoi en cours…</span>
          <span v-else-if="cooldownLeft > 0"
            >Patientez {{ cooldownLeft }} s</span
          >
          <span v-else>Envoyer ma demande d'adhésion</span>
        </button>

        <p class="text-xs text-gray-400 text-center leading-relaxed">
          Vos données sont utilisées uniquement pour le traitement de votre
          adhésion et ne seront jamais partagées à des tiers.
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

input[type="file"]::file-selector-button {
  background: linear-gradient(135deg, #0d2137, #1565c0);
}
</style>
