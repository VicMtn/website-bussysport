import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import WomensWorkoutSection from '../WomensWorkoutSection.vue'

const global = {
  directives: { reveal: { mounted() {} } },
  stubs: { RouterLink: RouterLinkStub },
}

describe('WomensWorkoutSection.vue', () => {
  it('exposes an anchor and both CTAs', () => {
    const wrapper = mount(WomensWorkoutSection, { global })

    expect(wrapper.find('section#womens-workout').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toContain('Workout')

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links.map((l) => l.props('to'))).toEqual([
      { path: '/adhesion', query: { activite: 'womens-workout' }, hash: '#formulaire' },
      { query: { sujet: 'womensworkout' }, hash: '#contact' },
    ])
  })

  it('renders the four highlights', () => {
    const wrapper = mount(WomensWorkoutSection, { global })
    expect(wrapper.findAll('h3')).toHaveLength(4)
  })
})
