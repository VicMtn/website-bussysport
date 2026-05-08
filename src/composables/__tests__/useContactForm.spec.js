import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useContactForm } from '../useContactForm'

function fillForm(form, overrides = {}) {
  form.name = 'Jean Dupont'
  form.email = 'jean@example.com'
  form.subject = 'adhesion'
  form.message = 'Bonjour, je souhaite rejoindre.'
  form.website = ''
  Object.assign(form, overrides)
}

function jsonResponse(body, ok = true) {
  return {
    ok,
    text: async () => JSON.stringify(body),
    json: async () => body,
  }
}

function rawResponse(text, ok = true) {
  return {
    ok,
    text: async () => text,
    json: async () => {
      throw new SyntaxError('not json')
    },
  }
}

describe('useContactForm', () => {
  beforeEach(() => {
    window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('validation', () => {
    it('rejects empty submissions without firing a request', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch')
      const { errorHtml, submit } = useContactForm()

      await submit()

      expect(errorHtml.value).toContain('Veuillez remplir tous les champs')
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('rejects malformed email addresses', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch')
      const { form, errorHtml, submit } = useContactForm()
      fillForm(form, { email: 'not-an-email' })

      await submit()

      expect(errorHtml.value).toContain('email valide')
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('clears previous success/error state on a new submission', async () => {
      const { form, errorHtml, successText, submit } = useContactForm()
      // 1st submit: empty form → error
      await submit()
      expect(errorHtml.value).not.toBe('')

      // 2nd submit with PHP fallback success → error cleared, success set
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        jsonResponse({ success: true, message: 'OK' }),
      )
      fillForm(form)
      await submit()

      expect(errorHtml.value).toBe('')
      expect(successText.value).toBe('OK')
    })
  })

  describe('honeypot', () => {
    it('with a Web3Forms key, fakes success and never calls the API', async () => {
      window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY = 'test-key'
      const fetchSpy = vi.spyOn(globalThis, 'fetch')
      const { form, successText, submit } = useContactForm()
      fillForm(form, { website: 'i-am-a-bot' })

      await submit()

      expect(successText.value).toContain('Votre message a bien été envoyé')
      expect(fetchSpy).not.toHaveBeenCalled()
      // Form is reset so the bot can't tell what happened by inspecting state
      expect(form.name).toBe('')
      expect(form.website).toBe('')
    })
  })

  describe('Web3Forms backend', () => {
    beforeEach(() => {
      window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY = 'test-key'
    })

    it('posts a JSON payload to api.web3forms.com on success', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(jsonResponse({ success: true }))
      const { form, successText, errorHtml, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(fetchSpy).toHaveBeenCalledOnce()
      const [url, init] = fetchSpy.mock.calls[0]
      expect(url).toBe('https://api.web3forms.com/submit')
      expect(init.method).toBe('POST')
      const body = JSON.parse(init.body)
      expect(body.access_key).toBe('test-key')
      expect(body.email).toBe('jean@example.com')
      expect(body.replyto).toBe('jean@example.com')
      expect(body.subject).toBe(
        "[BussySport] Adhésion à l'association — Jean Dupont",
      )
      expect(body.message).toContain("Sujet : Adhésion à l'association")
      expect(successText.value).not.toBe('')
      expect(errorHtml.value).toBe('')
      // form reset
      expect(form.name).toBe('')
    })

    it('shows the API error message when success === false', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        jsonResponse({ success: false, message: 'Quota exceeded' }),
      )
      const { form, errorHtml, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(errorHtml.value).toContain('Quota exceeded')
      // form is NOT reset on failure so the user can retry
      expect(form.name).toBe('Jean Dupont')
    })

    it('escapes HTML in API error messages to prevent injection', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        jsonResponse({ success: false, message: '<script>alert(1)</script>' }),
      )
      const { form, errorHtml, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(errorHtml.value).not.toContain('<script>')
      expect(errorHtml.value).toContain('&lt;script&gt;')
    })

    it('handles invalid JSON responses gracefully', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        rawResponse('<html>500</html>'),
      )
      const { form, errorHtml, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(errorHtml.value).toContain('Réponse du service')
      expect(errorHtml.value).toContain('mailto:info@bussysport.ch')
    })

    it('handles network errors gracefully', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))
      const { form, errorHtml, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(errorHtml.value).toContain('Connexion impossible')
    })
  })

  describe('PHP fallback backend', () => {
    it('posts FormData to /contact.php when no Web3Forms key is set', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(jsonResponse({ success: true, message: 'Envoyé' }))
      const { form, successText, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(fetchSpy).toHaveBeenCalledOnce()
      const [url, init] = fetchSpy.mock.calls[0]
      expect(url).toBe('/contact.php')
      expect(init.method).toBe('POST')
      expect(init.body).toBeInstanceOf(FormData)
      expect(init.body.get('email')).toBe('jean@example.com')
      expect(init.body.get('subject')).toBe('adhesion')
      expect(successText.value).toBe('Envoyé')
    })

    it('relays a server-supplied error message verbatim', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        jsonResponse({ success: false, message: 'Trop de tentatives' }),
      )
      const { form, errorHtml, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(errorHtml.value).toContain('Trop de tentatives')
    })

    it('shows a fallback error when contact.php returns invalid JSON', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        rawResponse('<html>500</html>'),
      )
      const { form, errorHtml, submit } = useContactForm()
      fillForm(form)

      await submit()

      expect(errorHtml.value).toContain('Réponse du serveur invalide')
    })
  })

  describe('loading state', () => {
    it('toggles loading around the request and clears it on error', async () => {
      let resolveFetch
      const pending = new Promise((resolve) => {
        resolveFetch = resolve
      })
      vi.spyOn(globalThis, 'fetch').mockReturnValue(pending)

      const { form, loading, submit } = useContactForm()
      fillForm(form)

      const submission = submit()
      expect(loading.value).toBe(true)

      resolveFetch(jsonResponse({ success: false, message: 'nope' }))
      await submission

      expect(loading.value).toBe(false)
    })
  })

  describe('subject mapping', () => {
    const cases = [
      ['adhesion', "Adhésion à l'association"],
      ['running', 'Courses à pied'],
      ['crosstraining', 'Cross-Training'],
      ['streetworkout', 'Street Workout'],
      ['tournoi', 'Tournois de jeux'],
      ['partenariat', 'Partenariat / Sponsor'],
      ['autre', 'Autre demande'],
    ]

    it.each(cases)('translates "%s" to %s in the email subject', async (slug, label) => {
      window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY = 'test-key'
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(jsonResponse({ success: true }))
      const { form, submit } = useContactForm()
      fillForm(form, { subject: slug })

      await submit()

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body)
      expect(body.subject).toContain(label)
      expect(body.message).toContain(`Sujet : ${label}`)
    })
  })
})
