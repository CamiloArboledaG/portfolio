'use client'

import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

export default function WebGLFallback() {
  return (
    <main className="bg-gradient-to-b from-[#dfe9f2] via-[#8a8275] to-[#5f7d3a]">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </main>
  )
}
