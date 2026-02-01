'use client'

import { motion } from 'framer-motion'
import { skills } from '@/lib/data'

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text mb-12"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary">#</span> About Me
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-text-muted leading-relaxed">
              Whether I&apos;m designing intuitive, responsive user interfaces or implementing
              robust server-side logic, I am dedicated to delivering high-quality solutions that
              meet user needs and exceed expectations.
            </p>
            <p className="text-text-muted leading-relaxed">
              I enjoy working with modern technologies and I&apos;m always eager to learn new tools
              and frameworks that can help me build better software. My approach combines technical
              expertise with a focus on clean, maintainable code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-text mb-6">Technologies I work with</h3>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={skillVariants}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(142, 68, 173, 0.2)' }}
                  className="px-4 py-2 bg-secondary/20 text-text-muted rounded-lg text-sm hover:text-primary transition-colors cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
