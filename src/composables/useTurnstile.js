import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  TURNSTILE_EXPIRED_ERROR,
  TURNSTILE_LOAD_ERROR,
  turnstileUserMessage,
} from "@/utils/turnstileErrors";

// Rendu explicite pour SPA — cf. onload + render() (pas ready() après chargement).
// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
const SCRIPT_BASE =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const ONLOAD_CALLBACK = "__bussysportTurnstileOnLoad";

let scriptPromise = null;

function getSiteKey() {
  return (window.BUSSYSPORT_TURNSTILE_SITE_KEY || "").trim();
}

function isTurnstileEnabled() {
  return !!getSiteKey();
}

function isTurnstileReady() {
  return typeof window.turnstile?.render === "function";
}

function removeWidget(widgetId, container) {
  if (widgetId != null && window.turnstile) {
    try {
      window.turnstile.remove(widgetId);
    } catch {
      // Widget déjà retiré (ex. remontage Vue en dev).
    }
  }
  if (container) {
    container.replaceChildren();
  }
}

/**
 * Charge api.js puis signale que l'API est prête via le paramètre onload Cloudflare.
 */
function loadTurnstileScript() {
  if (isTurnstileReady()) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    window[ONLOAD_CALLBACK] = () => {
      delete window[ONLOAD_CALLBACK];
      resolve();
    };

    const script = document.createElement("script");
    script.src = `${SCRIPT_BASE}&onload=${ONLOAD_CALLBACK}`;
    script.defer = true;
    script.onerror = () => {
      delete window[ONLOAD_CALLBACK];
      scriptPromise = null;
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

function renderWidget(container, siteKey, handlers) {
  if (!isTurnstileReady()) {
    throw new Error("Turnstile unavailable");
  }

  // Un seul widget par conteneur (évite les doublons en mode strict / HMR).
  container.replaceChildren();

  return window.turnstile.render(container, {
    sitekey: siteKey,
    language: "fr",
    theme: "light",
    size: "normal",
    action: "adhesion",
    retry: "auto",
    callback: handlers.onSuccess,
    "error-callback": handlers.onError,
    "expired-callback": handlers.onExpired,
  });
}

/**
 * Cloudflare Turnstile (rendu explicite) pour le formulaire d'adhésion.
 * Clé de site : public/contact-config.js — clé secrète : public/adhesion-config.php
 */
export function useTurnstile() {
  const containerRef = ref(null);
  const enabled = ref(isTurnstileEnabled());
  const ready = ref(!enabled.value);
  const errorMessage = ref("");
  const token = ref("");
  let widgetId = null;
  let mountCancelled = false;

  function clearError() {
    errorMessage.value = "";
  }

  function onSuccess(value) {
    token.value = value;
    ready.value = true;
    clearError();
  }

  function onError(errorCode) {
    token.value = "";
    ready.value = false;
    errorMessage.value = turnstileUserMessage(errorCode);
  }

  function onExpired() {
    token.value = "";
    ready.value = false;
    errorMessage.value = TURNSTILE_EXPIRED_ERROR;
  }

  onMounted(async () => {
    if (!enabled.value) return;

    mountCancelled = false;
    const siteKey = getSiteKey();

    try {
      await loadTurnstileScript();
      await nextTick();

      if (mountCancelled || !containerRef.value || widgetId != null) return;

      widgetId = renderWidget(containerRef.value, siteKey, {
        onSuccess,
        onError,
        onExpired,
      });
    } catch {
      if (!mountCancelled) {
        errorMessage.value = TURNSTILE_LOAD_ERROR;
        ready.value = false;
      }
    }
  });

  onUnmounted(() => {
    mountCancelled = true;
    removeWidget(widgetId, containerRef.value);
    widgetId = null;
    token.value = "";
    ready.value = !enabled.value;
  });

  function getToken() {
    if (token.value) return token.value;
    if (widgetId != null && window.turnstile) {
      return window.turnstile.getResponse(widgetId) || "";
    }
    return "";
  }

  function reset() {
    token.value = "";
    ready.value = false;
    clearError();
    if (widgetId != null && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }

  return {
    containerRef,
    enabled,
    ready,
    errorMessage,
    getToken,
    reset,
  };
}
