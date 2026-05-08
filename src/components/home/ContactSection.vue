<script setup>
import { useContactForm } from '@/composables/useContactForm'

const { form, loading, successText, errorHtml, submit } = useContactForm()
</script>

<template>
  <section id="contact" class="py-24 bg-white" data-testid="contact-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" v-reveal>
        <div class="flex items-center justify-center gap-4 mb-5">
          <div class="swiss-line"></div>
          <span class="text-xs font-bold uppercase tracking-widest text-gray-400">
            Nous contacter
          </span>
          <div class="swiss-line"></div>
        </div>
        <h2 class="sec-title font-display font-black text-4xl sm:text-5xl text-gray-900 mb-5">
          Contactez-nous
        </h2>
        <p class="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Une question, une idée, ou envie de rejoindre BussySport ?
          Nous vous répondrons rapidement !
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div v-reveal>
          <div
            class="rounded-2xl p-8 mb-6 text-white"
            style="background: linear-gradient(145deg, #0d2137 0%, #1565c0 100%);"
          >
            <h3 class="font-display font-bold text-lg mb-7 text-white/90">Informations</h3>

            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style="background: rgba(255, 255, 255, 0.1);"
                >
                  <img
                    src="/images/blason-bussigny.svg"
                    alt="Armoiries de Bussigny-près-Lausanne"
                    class="h-6 w-auto"
                    style="opacity: 0.9;"
                  />
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-widest text-white/45 mb-1">
                    Localisation
                  </div>
                  <address class="text-white font-medium not-italic text-sm leading-relaxed">
                    Bussigny-près-Lausanne<br />1030 Vaud, Suisse
                  </address>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style="background: rgba(255, 255, 255, 0.1);"
                >
                  <i class="fas fa-envelope text-sm text-primary-light" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-widest text-white/45 mb-1">
                    Email
                  </div>
                  <a
                    href="mailto:info@bussysport.ch"
                    class="text-white font-medium text-sm hover:text-blue-200 transition-colors"
                    data-testid="contact-email-link"
                  >info@bussysport.ch</a>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-white/10">
              <div class="text-xs font-bold uppercase tracking-widest text-white/45 mb-4">
                Réseaux Sociaux
              </div>
              <div class="flex gap-3">
                <a
                  href="https://www.instagram.com/bussysport"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BussySport sur Instagram"
                  data-testid="social-instagram"
                  class="social-icon w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style="background: rgba(255, 255, 255, 0.1);"
                >
                  <i class="fab fa-instagram text-xl" aria-hidden="true"></i>
                </a>
                <a
                  href="https://www.facebook.com/bussysport"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BussySport sur Facebook"
                  data-testid="social-facebook"
                  class="social-icon w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style="background: rgba(255, 255, 255, 0.1);"
                >
                  <i class="fab fa-facebook-f text-xl" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-reveal class="reveal-d2">
          <form
            class="bg-gray-50 p-8 rounded-2xl border border-gray-100 space-y-5"
            data-testid="contact-form"
            novalidate
            @submit.prevent="submit"
          >
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

            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  for="name"
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2"
                >
                  Nom complet <span class="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  autocomplete="name"
                  class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
                  placeholder="Jean Dupont"
                  data-testid="contact-name-input"
                />
              </div>
              <div>
                <label
                  for="email"
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2"
                >
                  Adresse Email <span class="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
                  placeholder="jean@exemple.com"
                  data-testid="contact-email-input"
                />
              </div>
            </div>

            <div>
              <label
                for="subject"
                class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2"
              >
                Sujet <span class="text-red-500">*</span>
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm"
                data-testid="contact-subject-select"
              >
                <option value="">Choisissez un sujet...</option>
                <option value="adhesion">Adhésion à l'association</option>
                <option value="running">Courses à pied</option>
                <option value="crosstraining">Cross-Training</option>
                <option value="streetworkout">Street Workout</option>
                <option value="tournoi">Tournois de jeux</option>
                <option value="partenariat">Partenariat / Sponsor</option>
                <option value="autre">Autre demande</option>
              </select>
            </div>

            <div>
              <label
                for="message"
                class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2"
              >
                Message <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                class="form-input w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm resize-none"
                placeholder="Votre message..."
                data-testid="contact-message-textarea"
              ></textarea>
            </div>

            <div
              v-if="successText"
              class="p-4 rounded-xl text-sm font-semibold"
              style="background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7;"
              data-testid="form-success-message"
              role="status"
            >
              <i class="fas fa-check-circle mr-2" aria-hidden="true"></i>
              <span>{{ successText }}</span>
            </div>

            <div
              v-if="errorHtml"
              class="p-4 rounded-xl text-sm font-semibold"
              style="background: #ffebee; color: #c62828; border: 1px solid #ffcdd2;"
              data-testid="form-error-message"
              role="alert"
            >
              <i class="fas fa-exclamation-circle mr-2" aria-hidden="true"></i>
              <span v-html="errorHtml"></span>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3"
              data-testid="contact-submit-btn"
            >
              <i
                :class="['fas', loading ? 'fa-spinner fa-spin-anim' : 'fa-paper-plane']"
                aria-hidden="true"
              ></i>
              <span>{{ loading ? 'Envoi en cours…' : 'Envoyer le message' }}</span>
            </button>

            <p class="text-xs text-gray-400 text-center leading-relaxed">
              Vos données sont utilisées uniquement pour répondre à votre
              demande et ne seront jamais partagées.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
