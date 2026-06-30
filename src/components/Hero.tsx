'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, MapPin, Download } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Hero() {
  const [transform, setTransform] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10
    setTransform({ x, y })
  }

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15,
        delayChildren: reducedMotion ? 0 : 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.5, ease: 'easeOut' as const },
    },
  }

  const avatarVariants = {
    hidden: { opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 0.8, rotate: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: reducedMotion ? 0 : 0.6, ease: 'easeOut' as const },
    },
  }

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16" aria-label="Introduction">
      <div className="max-w-6xl mx-auto px-6 w-full rounded-3xl bg-canopy/72 backdrop-blur-md ring-1 ring-moss/25 py-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            className="relative group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            variants={avatarVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber to-moss rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
            <div
              className="relative w-64 h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden border border-moss/30 shadow-2xl shadow-pine/40"
              style={
                mounted && !reducedMotion
                  ? {
                      transform: `perspective(1000px) rotateX(${transform.y}deg) rotateY(${transform.x}deg)`,
                      transition: 'transform 0.1s ease-out',
                    }
                  : undefined
              }
            >
              <Image
                src="/images/avatar.svg"
                alt="Illustrated avatar of Camilo Arboleda, Full Stack Developer based in Cali, Colombia"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 256px, 320px"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-2 text-stone mb-4"
            >
              <MapPin size={16} aria-hidden="true" />
              <span className="text-sm">Cali, Colombia</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-mist mb-4"
            >
              CAMILO ARBOLEDA
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl font-semibold text-amber mb-6"
            >
              Full Stack Developer
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-stone max-w-xl mb-8 leading-relaxed"
            >
              I&apos;m passionate about taking on meaningful challenges that allow me to deepen my
              knowledge and enhance my skills. With a strong enthusiasm for both frontend and
              backend development, I find great satisfaction in crafting seamless and efficient
              applications from concept to completion.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="/files/CamiloArboleda.pdf"
                download="CamiloArboleda_CV.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-canopy rounded-lg font-medium shadow-lg shadow-pine/40 hover:shadow-xl hover:shadow-amber/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                aria-label="Download Camilo Arboleda's CV as PDF"
              >
                <Download size={20} aria-hidden="true" />
                Download CV
              </a>

              <div className="flex items-center gap-3" role="list" aria-label="Social media links">
                <motion.a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-moss/20 rounded-lg hover:bg-amber/20 hover:text-amber transition-colors"
                  aria-label="Visit Camilo's GitHub profile"
                  whileHover={reducedMotion ? {} : { scale: 1.1 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                >
                  <Github size={24} aria-hidden="true" />
                </motion.a>
                <motion.a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-moss/20 rounded-lg hover:bg-amber/20 hover:text-amber transition-colors"
                  aria-label="Visit Camilo's LinkedIn profile"
                  whileHover={reducedMotion ? {} : { scale: 1.1 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                >
                  <Linkedin size={24} aria-hidden="true" />
                </motion.a>
                <motion.a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-moss/20 rounded-lg hover:bg-amber/20 hover:text-amber transition-colors"
                  aria-label="Visit Camilo's Twitter/X profile"
                  whileHover={reducedMotion ? {} : { scale: 1.1 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                >
                  <Twitter size={24} aria-hidden="true" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
