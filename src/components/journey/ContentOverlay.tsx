'use client'

import { Scroll } from '@react-three/drei'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

export default function ContentOverlay() {
  return (
    <Scroll html>
      <div className="w-screen">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </Scroll>
  )
}
