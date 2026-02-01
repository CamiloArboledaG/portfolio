'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { experiences } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Experience() {
  const [activeTab, setActiveTab] = useState(0)
  const reducedMotion = useReducedMotion()

  return (
    <section id="experience" className="py-20 bg-secondary/5" aria-label="Work Experience">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text mb-12"
          initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          <span className="text-primary">#</span> Experience
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row gap-8"
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.2 }}
        >
          <div
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-l border-secondary/30"
            role="tablist"
            aria-label="Companies"
          >
            {experiences.map((exp, index) => (
              <motion.button
                key={exp.company}
                onClick={() => setActiveTab(index)}
                role="tab"
                aria-selected={activeTab === index}
                aria-controls={`panel-${index}`}
                id={`tab-${index}`}
                className={`px-4 py-3 text-left text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === index
                    ? 'text-primary bg-primary/10 md:border-l-2 md:-ml-[1px] border-primary'
                    : 'text-text-muted hover:text-text hover:bg-secondary/10'
                }`}
                whileHover={reducedMotion ? {} : { x: 4 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
              >
                {exp.company}
              </motion.button>
            ))}
          </div>

          <div className="flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              {experiences.map(
                (exp, index) =>
                  activeTab === index && (
                    <motion.div
                      key={exp.company}
                      role="tabpanel"
                      id={`panel-${index}`}
                      aria-labelledby={`tab-${index}`}
                      initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -20 }}
                      transition={{ duration: reducedMotion ? 0 : 0.3 }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <motion.div
                          className="w-12 h-12 relative rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0"
                          whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                        >
                          <Image
                            src={exp.logo}
                            alt={`${exp.company} company logo`}
                            fill
                            sizes="48px"
                            className="object-contain p-2"
                          />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-text">{exp.role}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                          <p className="text-text-muted text-sm">
                            <time>{exp.period}</time>
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-3" aria-label={`Responsibilities at ${exp.company}`}>
                        {exp.description.map((item, i) => (
                          <motion.li
                            key={i}
                            className="flex gap-3 text-text-muted"
                            initial={{
                              opacity: reducedMotion ? 1 : 0,
                              x: reducedMotion ? 0 : 10,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reducedMotion ? 0 : i * 0.1 }}
                          >
                            <span className="text-primary mt-1.5" aria-hidden="true">
                              ▹
                            </span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
