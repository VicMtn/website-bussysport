/**
 * Single source of truth for the four BussySport activities.
 * Used by the home grid, the cross-link block at the bottom of every
 * activity sub-page, and the navigation/footer.
 */
export const activities = [
  {
    slug: 'courses-a-pied',
    label: 'Courses à pied',
    shortLabel: 'Courses à pied',
    icon: 'fa-person-running',
    breadcrumb: 'COURSES À PIED',
    title: 'Courses à Pied',
    homeBlurb:
      "Du jogging matinal aux sorties nature, nos séances running rassemblent débutants et confirmés dans une ambiance conviviale. Courez à votre rythme, progressez ensemble.",
    heroSubtitle:
      "Courez ensemble, avancez plus loin. Des sorties running hebdomadaires pour tous les niveaux, dans la bonne humeur et au grand air de Bussigny.",
    heroBadges: ['Tous niveaux', 'Cardio', 'Plein air', 'Hebdomadaire'],
    cta: 'Rejoindre le groupe',
    image:
      'https://images.pexels.com/photos/3638093/pexels-photo-3638093.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=600&w=800',
    heroImage:
      'https://images.pexels.com/photos/3638093/pexels-photo-3638093.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
  {
    slug: 'cross-training',
    label: 'Cross-Training',
    shortLabel: 'Cross-Training',
    icon: 'fa-dumbbell',
    breadcrumb: 'CROSS-TRAINING',
    title: 'Cross-Training',
    homeBlurb:
      "Cardio, force et endurance mêlés en séances intenses en extérieur. Le cross-training BussySport est accessible à tous les niveaux pour se dépasser au grand air.",
    heroSubtitle:
      "Puissance, explosivité, résistance. Des séances complètes qui combinent force et cardio pour des résultats visibles, en plein air à Bussigny.",
    heroBadges: ['Tous niveaux', 'Force & Cardio', 'Extérieur', 'Intensif'],
    cta: 'Rejoindre le groupe',
    image:
      'https://images.pexels.com/photos/6150627/pexels-photo-6150627.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=600&w=800',
    heroImage:
      'https://images.pexels.com/photos/6150627/pexels-photo-6150627.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
  {
    slug: 'street-workout',
    label: 'Street Workout',
    shortLabel: 'Street Workout',
    icon: 'fa-child-reaching',
    breadcrumb: 'STREET WORKOUT',
    title: 'Street Workout',
    homeBlurb:
      "Musculation en plein air au poids du corps. Tractions, dips, handstands — le street workout développe force et agilité. Rejoignez nos sessions urbaines à Bussigny.",
    heroSubtitle:
      "Votre corps est votre machine. La calisthenics en plein air développe une force réelle et fonctionnelle — sans salle, sans machine, juste vous et les barres.",
    heroBadges: ['Corps libre', 'Calisthenics', 'Plein air', 'Progressif'],
    cta: 'Rejoindre le groupe',
    image:
      'https://images.pexels.com/photos/10021277/pexels-photo-10021277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=600&w=800',
    heroImage:
      'https://images.pexels.com/photos/10021277/pexels-photo-10021277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
  {
    slug: 'tournois',
    label: 'Tournois de jeux',
    shortLabel: 'Tournois',
    icon: 'fa-trophy',
    breadcrumb: 'TOURNOIS DE JEUX',
    title: 'Tournois de Jeux',
    homeBlurb:
      "Pétanque, football, volleyball — BussySport organise des tournois conviviaux pour animer Bussigny et créer des moments de fête et de partage entre habitants.",
    heroSubtitle:
      "Le sport, l'ambiance, le village. BussySport organise des tournois conviviaux pour créer des moments de fête et de partage à Bussigny.",
    heroBadges: ['Tous âges', 'Fair-play', 'Convivial', 'Événements'],
    cta: "S'inscrire à un tournoi",
    image:
      'https://images.unsplash.com/photo-1770155590999-be95c70ca378?crop=entropy&cs=srgb&fm=jpg&q=85&w=800&h=600&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1770155590999-be95c70ca378?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920&h=1080&fit=crop',
  },
]

export function getActivity(slug) {
  return activities.find((a) => a.slug === slug)
}

export function getOtherActivities(slug) {
  return activities.filter((a) => a.slug !== slug)
}
