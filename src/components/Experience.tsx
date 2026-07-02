'use client'

import { useState } from 'react'
import { Tent } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { experiences } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import RevealPanel from '@/components/ui/RevealPanel'

export default function Experience() {
  const [activeTab, setActiveTab] = useState(0)
  const reducedMotion = useReducedMotion()

  return (
    <section id="experience" className="h-screen flex items-center" aria-label="Work Experience">
      <RevealPanel className="max-w-6xl mx-auto px-6 rounded-3xl bg-parchment/85 backdrop-blur-md ring-1 ring-[var(--line)] py-10 max-h-[88vh] overflow-y-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-bark mb-12"
          initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          <span className="text-sage">#</span> Experience
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row gap-8"
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.2 }}
        >
          <div
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-l border-[var(--line)]"
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
                    ? 'text-sage bg-sage/10 md:border-l-2 md:-ml-[1px] border-sage'
                    : 'text-muted hover:text-bark hover:bg-sage/10'
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
                          className="w-12 h-12 relative rounded-lg overflow-hidden bg-sage/12 flex-shrink-0 flex items-center justify-center"
                          whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                        >
                          {exp.logo ? (
                            <Image
                              src={exp.logo}
                              alt={`${exp.company} company logo`}
                              fill
                              sizes="48px"
                              className="object-contain p-2"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-sage" aria-hidden="true">
                              {exp.company.charAt(0)}
                            </span>
                          )}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-bark">{exp.role}</h3>
                          <p className="text-sage font-medium">{exp.company}</p>
                          <p className="text-muted text-sm">
                            <time>{exp.period}</time>
                          </p>
                          <p className="text-muted text-sm">{exp.location}</p>
                          <span className="inline-flex items-center gap-1.5 mt-1 text-xs text-sage/80">
                            <Tent size={14} aria-hidden="true" />
                            Campamento {String(1200 + index * 400)} m
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3" aria-label={`Responsibilities at ${exp.company}`}>
                        {exp.description.map((item, i) => (
                          <motion.li
                            key={i}
                            className="flex gap-3 text-muted"
                            initial={{
                              opacity: reducedMotion ? 1 : 0,
                              x: reducedMotion ? 0 : 10,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reducedMotion ? 0 : i * 0.1 }}
                          >
                            <span className="text-sage mt-1.5" aria-hidden="true">
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
      </RevealPanel>
    </section>
  )
}
