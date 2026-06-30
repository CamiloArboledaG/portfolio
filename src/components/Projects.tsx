'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink, Mountain } from 'lucide-react'
import { projects } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Projects() {
  const reducedMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: reducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.5, ease: 'easeOut' as const },
    },
  }

  return (
    <section id="projects" className="py-20 min-h-screen flex items-center" aria-label="Featured Projects">
      <div className="max-w-6xl mx-auto px-6 rounded-3xl bg-canopy/72 backdrop-blur-md ring-1 ring-moss/25 py-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-mist mb-12"
          initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          <span className="text-amber">#</span> Projects
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          role="list"
          aria-label="Project cards"
        >
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-pine/30 rounded-2xl overflow-hidden border border-moss/20 hover:border-amber/50 transition-colors shadow-lg shadow-pine/30"
              variants={cardVariants}
              whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.2 } }}
              role="listitem"
              aria-label={`${project.title} - ${project.description}`}
            >
              <div className="relative h-48 bg-moss/15 overflow-hidden">
                <motion.div
                  className="w-full h-full"
                  whileHover={reducedMotion ? {} : { scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={project.image}
                    alt={`Screenshot of ${project.title} project - ${project.description.slice(0, 50)}...`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-8"
                  />
                </motion.div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-amber/80 mb-2">
                  <Mountain size={14} aria-hidden="true" />
                  <span>Cumbre {String(2400 + index * 300)} m</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-mist group-hover:text-amber transition-colors">
                    {project.title}
                  </h3>
                  <motion.div
                    whileHover={reducedMotion ? {} : { scale: 1.2, rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExternalLink
                      size={18}
                      className="text-stone group-hover:text-amber transition-colors"
                      aria-hidden="true"
                    />
                  </motion.div>
                </div>

                <p className="text-stone text-sm mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-2" aria-label="Technologies used">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-moss/15 text-stone rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
