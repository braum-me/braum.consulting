import type { Metadata } from 'next'
import Hero          from '@/components/sections/Hero'
import SzenarienStrip from '@/components/sections/SzenarienStrip'
import Problem       from '@/components/sections/Problem'
import Services      from '@/components/sections/Services'
import Process       from '@/components/sections/Process'
import WerkzeugeTeaser from '@/components/sections/WerkzeugeTeaser'
import CasesFeatured from '@/components/sections/CasesFeatured'
import Testimonials  from '@/components/sections/Testimonials'
import OperatorStory from '@/components/sections/OperatorStory'
import Werkstatt     from '@/components/sections/Werkstatt'
import Faq           from '@/components/sections/Faq'

// Mainpage-OG (temporär — Sub-Pages bekommen später eigene).
// Twitter Card erbt automatisch aus openGraph.images, wenn nicht eigens gesetzt.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    images: [
      {
        url: '/og/main.webp',
        width: 1600,
        height: 800,
        alt: 'Braum Consulting · Digitales Handwerk für den Industriemittelstand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/main.webp'],
  },
}

/**
 * Homepage, Lagebild-Bogen: Orientierung → Lagebild → Kurs setzen → Übergabe.
 *
 *  01. Hero          Wer, was, klarer Kurs
 *  --. SzenarienStrip Was hier passiert (über alle vier Felder)
 *  02. Problem       Warum Orientierung fehlt
 *  03. Services      Vier Felder, eine Hand
 *  04. Lotsenprinzip Timeline + Lagebild links + Klarheit-vorab rechts
 *  05. Cases         Was im Engagement passiert
 *  06. Operator      Glaubwürdigkeit
 *  07. Werkstatt     Blog
 *  08. FAQ           Häufige Fragen
 *
 * Final-CTA „Reden wir. Ohne Folien." lebt im Footer (auf jeder Page).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SzenarienStrip />
      <Problem />
      <Services />
      <Process />
      <WerkzeugeTeaser />
      <CasesFeatured />
      <Testimonials />
      <OperatorStory />
      <Werkstatt />
      <Faq />
    </>
  )
}
