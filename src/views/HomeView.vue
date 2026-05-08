<script setup>
import { useHead } from '@unhead/vue'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import ActivitiesSection from '@/components/home/ActivitiesSection.vue'
import CtaBand from '@/components/home/CtaBand.vue'
import ContactSection from '@/components/home/ContactSection.vue'

const description =
  'Association BussySport est une association sportive de Bussigny. Courses à pied, cross-training, street workout et tournois de jeux. Rejoignez notre communauté sportive au cœur du canton de Vaud.'

useHead({
  title: '',
  meta: [
    { name: 'title', content: 'Association BussySport' },
    { name: 'description', content: description },
    {
      name: 'keywords',
      content:
        'BussySport, sport Bussigny, association sportive Bussigny, course à pied Bussigny, cross-training Vaud, street workout Bussigny, tournoi sportif Bussigny, sport communautaire Vaud, fitness Bussigny, musculation extérieur Bussigny',
    },
    {
      name: 'robots',
      content:
        'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://bussysport.ch/' },
    { property: 'og:title', content: 'BussySport – Le Sport au Cœur de Bussigny' },
    {
      property: 'og:description',
      content:
        'Association sportive dédiée à la promotion du sport et du bien-être pour tous les habitants de Bussigny, Vaud. Courses à pied, cross-training, street workout et tournois.',
    },
    { property: 'og:image', content: 'https://bussysport.ch/images/logo.jpeg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:url', content: 'https://bussysport.ch/' },
    { name: 'twitter:title', content: 'BussySport – Le Sport au Cœur de Bussigny' },
    {
      name: 'twitter:description',
      content:
        'Association sportive dédiée à la promotion du sport et du bien-être à Bussigny, Vaud, Suisse.',
    },
    { name: 'twitter:image', content: 'https://bussysport.ch/images/logo.jpeg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://bussysport.ch/' },
    { rel: 'alternate', hreflang: 'fr', href: 'https://bussysport.ch/' },
    { rel: 'alternate', hreflang: 'fr-ch', href: 'https://bussysport.ch/' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://bussysport.ch/' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SportsClub',
            '@id': 'https://bussysport.ch/#organization',
            name: 'BussySport',
            alternateName: 'Bussy Sport',
            description:
              "Association sportive de Bussigny dédiée à la promotion du sport, de la santé et du bien-être communautaire pour tous les habitants de Bussigny-près-Lausanne.",
            url: 'https://bussysport.ch',
            logo: {
              '@type': 'ImageObject',
              url: 'https://bussysport.ch/images/logo.jpeg',
              width: 512,
              height: 512,
            },
            email: 'info@bussysport.ch',
            foundingDate: '2025',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Bussigny',
              addressLocality: 'Bussigny-près-Lausanne',
              postalCode: '1030',
              addressRegion: 'Vaud',
              addressCountry: 'CH',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 46.5522,
              longitude: 6.5558,
            },
            areaServed: {
              '@type': 'City',
              name: 'Bussigny-près-Lausanne',
              sameAs: 'https://www.wikidata.org/wiki/Q70568',
            },
            sameAs: [
              'https://www.instagram.com/bussysport',
              'https://www.facebook.com/bussysport',
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Activités sportives',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Courses à pied',
                    description: 'Sorties running pour tous niveaux à Bussigny',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Cross-Training',
                    description: 'Entraînement fonctionnel en extérieur',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Street Workout',
                    description: 'Musculation en plein air et calisthenics',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Tournois de jeux',
                    description: 'Organisation de tournois sportifs conviviaux',
                  },
                },
              ],
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              email: 'info@bussysport.ch',
              availableLanguage: ['French'],
            },
            nonprofit: true,
          },
          {
            '@type': 'WebSite',
            '@id': 'https://bussysport.ch/#website',
            url: 'https://bussysport.ch',
            name: 'BussySport',
            description:
              "Site officiel de l'association BussySport à Bussigny, Vaud, Suisse",
            inLanguage: 'fr-CH',
            publisher: { '@id': 'https://bussysport.ch/#organization' },
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <HeroSection />
  <AboutSection />
  <ActivitiesSection />
  <CtaBand />
  <ContactSection />
</template>
