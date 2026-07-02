'use client'

import { motion } from 'framer-motion'
import { GraduationCap, BadgeCheck } from 'lucide-react'
import { skillGroups, education, certifications } from '@/lib/data'
import RevealPanel from '@/components/ui/RevealPanel'

export default function About() {
  return (
    <section id="about" className="h-screen flex items-center">
      <RevealPanel className="max-w-6xl mx-auto px-6 rounded-3xl bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)] py-10 max-h-[88vh] overflow-y-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-bark mb-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sage">#</span> About Me
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-muted leading-relaxed">
              Full Stack Developer focused on building scalable, high-performance,
              user-centered applications, with solid experience across frontend and
              backend. Committed to clean architecture, code quality and continuous
              improvement, leveraging AI tools such as Claude Code to solve real
              problems and build products with impact.
            </p>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-bark mb-3">
                <GraduationCap size={18} className="text-sage" aria-hidden="true" /> Education
              </h3>
              <p className="text-bark font-medium">{education.degree}</p>
              <p className="text-muted text-sm">{education.school}</p>
              <p className="text-muted text-sm">{education.period} · {education.location}</p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-bark mb-3">
                <BadgeCheck size={18} className="text-sage" aria-hidden="true" /> Certifications
              </h3>
              <ul className="flex flex-wrap gap-2">
                {certifications.map((c) => (
                  <li key={c.name} className="px-3 py-1 bg-sage/12 text-bark ring-1 ring-[var(--line)] rounded-full text-sm">
                    {c.name}
                  </li>
                ))}
              </ul>
              <p className="text-muted text-xs mt-2">Public credentials on LinkedIn</p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h3 className="text-xl font-semibold text-bark">Technologies I work with</h3>
            {skillGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold tracking-widest uppercase text-sage mb-2">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-sage/12 text-bark ring-1 ring-[var(--line)] rounded-full text-sm hover:bg-sage/20 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </RevealPanel>
    </section>
  )
}
