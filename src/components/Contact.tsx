'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-secondary/5">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary">#</span> Get In Touch
        </motion.h2>

        <motion.p
          className="text-text-muted mb-8 leading-relaxed"
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
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-text rounded-lg font-medium shadow-[6px_6px_0px_#2D1F33] hover:shadow-[8px_8px_0px_#2D1F33] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
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
          className="mt-6 text-text-muted text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {SOCIAL_LINKS.email}
        </motion.p>
      </div>
    </section>
  )
}
