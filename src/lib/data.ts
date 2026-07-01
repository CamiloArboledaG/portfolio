export interface Experience {
  company: string
  role: string
  period: string
  location: string
  description: string[]
  logo: string
}

export interface Project {
  title: string
  description: string
  image: string
  link: string
  tags: string[]
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  location: string
}

export interface Certification {
  name: string
}

export const experiences: Experience[] = [
  {
    company: 'Simón Movilidad',
    role: 'Full Stack Developer',
    period: 'Sep 2025 — Present',
    location: 'Bogotá, Colombia',
    description: [
      'Build and maintain urban-mobility web apps with React and Go, taking features from design to production and improving system performance.',
      'Lead full projects as sole developer using C#, React, Vite and Next.js, owning frontend and backend end to end.',
      'Adopted React Native to extend products to mobile platforms.',
      'Deploy from the command line across servers, orchestrating environments with Docker.',
      'Boost productivity and code quality leveraging AI tools like Claude Code.',
    ],
    logo: '/images/simon.png',
  },
  {
    company: 'Globe Software',
    role: 'Full Stack Developer',
    period: 'Jun 2022 — Sep 2025',
    location: 'Montevideo, Uruguay (remote)',
    description: [
      'Developed and maintained web and mobile products alongside cross-functional teams, covering the full stack.',
      'Delivered interfaces in React and Angular, and cross-platform apps with Flutter.',
      'Implemented backend services in Node.js and Java, ensuring reliable APIs and maintainable, tested code.',
      'Took part in code reviews and agile ceremonies, contributing to clean architecture and consistent quality standards.',
    ],
    logo: '/images/globe-software.svg',
  },
  {
    company: 'DomicilioExpress.com',
    role: 'Full Stack Developer',
    period: 'Oct 2021 — Jun 2022',
    location: 'Cali, Colombia',
    description: [
      'Built features for e-commerce and delivery platforms, improving the end-to-end user experience.',
      'Optimized system efficiency and view performance, reducing load times under real traffic.',
      'Collaborated on frontend and backend tasks to ship customer-facing features.',
    ],
    logo: '/images/botmeni.svg',
  },
]

export const projects: Project[] = [
  {
    title: 'Guess What',
    description:
      'An interactive guessing game built with modern web technologies. Features real-time gameplay and an engaging, responsive interface.',
    image: '/images/guess-what.svg',
    link: 'https://guess-what-henna.vercel.app/',
    tags: ['React', 'Vercel', 'Game'],
  },
]

export const skillGroups: SkillGroup[] = [
  { label: 'Frontend', items: ['React', 'Next.js', 'Vite', 'Angular', 'TypeScript', 'HTML / CSS'] },
  { label: 'Backend', items: ['Node.js', 'Go', 'C#', 'Java', 'Python'] },
  { label: 'Mobile · Design · Tools', items: ['Flutter', 'React Native', 'Figma', 'Docker', 'Git / GitHub', 'Linux'] },
]

export const education: Education = {
  degree: 'Multimedia Engineering',
  school: 'Universidad Autónoma de Occidente',
  period: '2018 — 2023',
  location: 'Cali, Colombia',
}

export const certifications: Certification[] = [
  { name: 'Docker' },
  { name: 'Go (Golang)' },
]
