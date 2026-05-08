import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ContactSection from '../ContactSection.vue'

const stubs = {
  // v-reveal directive isn't auto-installed in test mounts.
  directives: {
    reveal: { mounted() {} },
  },
}

function jsonResponse(body) {
  return {
    text: async () => JSON.stringify(body),
    json: async () => body,
  }
}

describe('ContactSection.vue', () => {
  beforeEach(() => {
    window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY = ''
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders all required form fields', () => {
    const wrapper = mount(ContactSection, { global: stubs })

    expect(wrapper.find('input[data-testid="contact-name-input"]').exists()).toBe(true)
    expect(wrapper.find('input[data-testid="contact-email-input"]').exists()).toBe(true)
    expect(wrapper.find('select[data-testid="contact-subject-select"]').exists()).toBe(true)
    expect(wrapper.find('textarea[data-testid="contact-message-textarea"]').exists()).toBe(true)
    expect(wrapper.find('button[data-testid="contact-submit-btn"]').exists()).toBe(true)

    // Honeypot is in the DOM but visually hidden.
    const honeypot = wrapper.find('input#website')
    expect(honeypot.exists()).toBe(true)
    expect(honeypot.attributes('tabindex')).toBe('-1')
  })

  it('shows a validation error when submitting an empty form and never calls fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const wrapper = mount(ContactSection, { global: stubs })

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(fetchSpy).not.toHaveBeenCalled()
    const error = wrapper.find('[data-testid="form-error-message"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toContain('Veuillez remplir tous les champs')
  })

  it('shows a validation error for an invalid email and never calls fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const wrapper = mount(ContactSection, { global: stubs })

    await wrapper.find('[data-testid="contact-name-input"]').setValue('Jean')
    await wrapper.find('[data-testid="contact-email-input"]').setValue('not-an-email')
    await wrapper.find('[data-testid="contact-subject-select"]').setValue('adhesion')
    await wrapper.find('[data-testid="contact-message-textarea"]').setValue('Hello')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="form-error-message"]').text()).toContain('email valide')
  })

  it('submits a valid form, shows the success banner, and resets the inputs', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ success: true, message: 'Bien reçu' }),
    )
    const wrapper = mount(ContactSection, { global: stubs })

    await wrapper.find('[data-testid="contact-name-input"]').setValue('Jean')
    await wrapper.find('[data-testid="contact-email-input"]').setValue('jean@example.com')
    await wrapper.find('[data-testid="contact-subject-select"]').setValue('adhesion')
    await wrapper.find('[data-testid="contact-message-textarea"]').setValue('Hello')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const success = wrapper.find('[data-testid="form-success-message"]')
    expect(success.exists()).toBe(true)
    expect(success.text()).toContain('Bien reçu')
    expect(wrapper.find('[data-testid="form-error-message"]').exists()).toBe(false)

    // Inputs are cleared after success.
    expect(wrapper.find('[data-testid="contact-name-input"]').element.value).toBe('')
    expect(wrapper.find('[data-testid="contact-message-textarea"]').element.value).toBe('')
  })

  it('disables the submit button while a request is in flight', async () => {
    let resolveFetch
    vi.spyOn(globalThis, 'fetch').mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      }),
    )

    const wrapper = mount(ContactSection, { global: stubs })

    await wrapper.find('[data-testid="contact-name-input"]').setValue('Jean')
    await wrapper.find('[data-testid="contact-email-input"]').setValue('jean@example.com')
    await wrapper.find('[data-testid="contact-subject-select"]').setValue('adhesion')
    await wrapper.find('[data-testid="contact-message-textarea"]').setValue('Hello')

    const submission = wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const button = wrapper.find('[data-testid="contact-submit-btn"]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toContain('Envoi en cours')

    resolveFetch(jsonResponse({ success: true, message: 'OK' }))
    await submission
    await flushPromises()

    // After completion the button stays disabled — but now it's the cooldown
    // countdown (post-submit throttle), no longer the in-flight spinner.
    expect(button.text()).not.toContain('Envoi en cours')
    expect(button.text()).toMatch(/Patientez \d+ s/)
  })

  it('blocks an immediate second submit and shows the cooldown countdown', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ success: true, message: 'OK' }),
    )
    const wrapper = mount(ContactSection, { global: stubs })

    await wrapper.find('[data-testid="contact-name-input"]').setValue('Jean')
    await wrapper.find('[data-testid="contact-email-input"]').setValue('jean@example.com')
    await wrapper.find('[data-testid="contact-subject-select"]').setValue('adhesion')
    await wrapper.find('[data-testid="contact-message-textarea"]').setValue('Hello')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const button = wrapper.find('[data-testid="contact-submit-btn"]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="contact-cooldown"]').text()).toMatch(
      /Patientez \d+ s/,
    )
  })
})
