import { reactive, ref } from 'vue'

const SUBJECT_LABELS = {
  adhesion: "Adhésion à l'association",
  running: 'Courses à pied',
  crosstraining: 'Cross-Training',
  streetworkout: 'Street Workout',
  tournoi: 'Tournois de jeux',
  partenariat: 'Partenariat / Sponsor',
  autre: 'Autre demande',
}

const MAIL_FALLBACK_HTML =
  'Si le problème persiste, écrivez-nous à <a href="mailto:info@bussysport.ch" class="underline font-bold">info@bussysport.ch</a>.'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function useContactForm() {
  const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // honeypot
  })

  const loading = ref(false)
  const successText = ref('')
  const errorHtml = ref('')

  function reset() {
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    form.website = ''
  }

  function showSuccess(text) {
    successText.value = text || 'Votre message a bien été envoyé. Merci !'
    errorHtml.value = ''
    setTimeout(() => {
      successText.value = ''
    }, 8000)
  }

  function showError(html) {
    errorHtml.value = html
    successText.value = ''
  }

  function showErrorPlain(msg) {
    errorHtml.value = escapeHtml(msg)
    successText.value = ''
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  async function submit() {
    successText.value = ''
    errorHtml.value = ''

    const name = form.name.trim()
    const email = form.email.trim()
    const subject = form.subject
    const message = form.message.trim()

    if (!name || !email || !subject || !message) {
      showErrorPlain('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (!isValidEmail(email)) {
      showErrorPlain('Veuillez saisir une adresse email valide.')
      return
    }

    loading.value = true
    const subjectLabel = SUBJECT_LABELS[subject] || subject
    const web3Key = (window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY || '').trim()

    try {
      if (web3Key) {
        // Honeypot trip — pretend success without sending.
        if (form.website.trim()) {
          showSuccess(
            'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais !',
          )
          reset()
          return
        }

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `[BussySport] ${subjectLabel} — ${name}`,
            name,
            email,
            replyto: email,
            message: `Sujet : ${subjectLabel}\n\n${message}`,
          }),
        })

        let data
        try {
          data = await res.json()
        } catch {
          showError(`Réponse du service d’envoi invalide. ${MAIL_FALLBACK_HTML}`)
          return
        }

        if (data?.success === true) {
          showSuccess(
            'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais !',
          )
          reset()
        } else if (data?.message) {
          showErrorPlain(data.message)
        } else {
          showError(`Envoi impossible via le service d’email. ${MAIL_FALLBACK_HTML}`)
        }
        return
      }

      // PHP fallback (FTP/Apache deployment).
      const body = new FormData()
      body.append('name', name)
      body.append('email', email)
      body.append('subject', subject)
      body.append('message', message)
      body.append('website', form.website)

      const res = await fetch('/contact.php', {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })

      const raw = await res.text()
      let data
      try {
        data = JSON.parse(raw)
      } catch {
        showError(`Réponse du serveur invalide. ${MAIL_FALLBACK_HTML}`)
        return
      }

      if (data?.success === true) {
        showSuccess(data.message)
        reset()
      } else if (data?.message) {
        showErrorPlain(data.message)
      } else {
        showError(
          `L'envoi du message a échoué. Envisagez Web3Forms (contact-config.js). ${MAIL_FALLBACK_HTML}`,
        )
      }
    } catch {
      showError(`Connexion impossible. ${MAIL_FALLBACK_HTML}`)
    } finally {
      loading.value = false
    }
  }

  return { form, loading, successText, errorHtml, submit }
}
