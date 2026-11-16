import { describe, expect, it } from 'vitest'
import { sanitizeActivities, useAdhesionForm } from '../useAdhesionForm'

describe('useAdhesionForm — activités présélectionnées', () => {
  it("propose le Women's Workout en plus des activités", () => {
    const { activityLabels } = useAdhesionForm()
    expect(activityLabels.map((a) => a.slug)).toContain('womens-workout')
  })

  it("coche l'activité passée en initialActivities", () => {
    const { form } = useAdhesionForm({ initialActivities: 'womens-workout' })
    expect(form.activities).toEqual(['womens-workout'])
  })

  it('ignore les slugs inconnus et les doublons', () => {
    expect(sanitizeActivities(['womens-workout', 'pirate', 'womens-workout'])).toEqual([
      'womens-workout',
    ])
    expect(sanitizeActivities(undefined)).toEqual([])
  })
})
