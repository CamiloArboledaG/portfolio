'use client'

import { motion } from 'framer-motion'
import { Mail, Flag, Phone, MapPin } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'
import RevealPanel from '@/components/ui/RevealPanel'

export default function Contact() {
  return (
    <section id="contact" className="min-h-screen md:h-screen flex items-center px-4 py-24 md:py-0 scroll-mt-20">
      <RevealPanel className="w-full max-w-3xl mx-auto px-6 text-center rounded-3xl bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)] py-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-bark mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2">
            <Flag className="text-sage" size={28} aria-hidden="true" /> Get In Touch
          </span>
        </motion.h2>

        <motion.p
          className="text-muted mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          I&apos;m currently open to new opportunities and collaborations. Whether you have a
          question, a project idea, or just want to say hi, feel free to reach out. I&apos;ll do my
          best to get back to you!
        </motion.p>

        <motion.a
          href={`mailto:${SOCIAL_LINKS.email}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-parchment rounded-lg font-medium shadow-lg shadow-[rgba(51,67,46,0.18)] hover:shadow-xl hover:shadow-[rgba(107,138,82,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Mail size={20} />
          Say Hello
        </motion.a>

        <motion.p
          className="mt-6 text-muted text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {SOCIAL_LINKS.email}
        </motion.p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2 text-muted text-sm">
          <a href={`tel:${SOCIAL_LINKS.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-sage transition-colors">
            <Phone size={16} aria-hidden="true" /> {SOCIAL_LINKS.phone}
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} aria-hidden="true" /> {SOCIAL_LINKS.location}
          </span>
        </div>
      </RevealPanel>
    </section>
  )
}
