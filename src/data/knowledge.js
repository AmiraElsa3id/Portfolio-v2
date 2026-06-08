import data from './portfolio.json'

function buildKnowledge() {
  const k = []

  k.push({
    category: 'personal',
    keywords: ['who', 'name', 'about', 'yourself', 'are you'],
    text: `My name is ${data.name}. I am a ${data.title}. I am based in ${data.contact.location}, ${data.contact.relocation}.`
  })

  k.push({
    category: 'summary',
    keywords: ['summary', 'profile', 'background', 'overview'],
    text: data.summary
  })

  k.push({
    category: 'contact',
    keywords: ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'social'],
    text: `You can reach me via email at ${data.contact.email}, phone at ${data.contact.phone}, LinkedIn at ${data.contact.linkedin}, or GitHub at ${data.contact.github}.`
  })

  for (const [cat, items] of Object.entries(data.skills)) {
    k.push({
      category: 'skills',
      keywords: ['skill', 'tech', 'technology', 'tool', ...cat.toLowerCase().split(/[\s&/]+/)],
      text: `${cat}: ${items.join(', ')}.`
    })
  }

  for (const job of data.experience) {
    k.push({
      category: 'experience',
      keywords: ['experience', 'work', 'job', ...job.company.toLowerCase().split(/[\s/]+/), ...job.role.toLowerCase().split(/[\s/]+/)],
      text: `I worked as ${job.role} at ${job.company} (${job.period}). Highlights: ${job.highlights.join(' ')}`
    })
  }

  for (const proj of data.projects) {
    k.push({
      category: 'projects',
      keywords: ['project', 'built', 'made', 'create', ...proj.name.toLowerCase().split(/[\s—–-]+/), ...proj.tech.toLowerCase().split(/[\s,/]+/)],
      text: `${proj.name}: ${proj.description}. Tech stack: ${proj.tech}.${proj.links.code ? ` Code: ${proj.links.code}.` : ''}${proj.links.demo ? ` Demo: ${proj.links.demo}.` : ''}`
    })
  }

  for (const edu of data.education) {
    k.push({
      category: 'education',
      keywords: ['education', 'study', 'degree', 'diploma', 'university', 'college', 'school', 'academic', ...edu.degree.toLowerCase().split(/[\s—–-]+/), ...edu.school.toLowerCase().split(/[\s,/]+/)],
      text: `${edu.degree} at ${edu.school} (${edu.period}).${edu.details.length ? ` ${edu.details.join(' ')}` : ''}`
    })
  }

  for (const h of data.honors) {
    k.push({
      category: 'honors',
      keywords: ['honor', 'achievement', 'award', 'medal', 'competition', ...h.toLowerCase().split(/[\s—–-]+/).filter(w => w.length > 3)],
      text: h
    })
  }

  for (const [lang, level] of Object.entries(data.languages)) {
    k.push({
      category: 'languages',
      keywords: ['language', 'speak', 'arabic', 'english', 'italian', lang.toLowerCase()],
      text: `I speak ${lang} at a ${level.toLowerCase()} level.`
    })
  }

  return k
}

const knowledge = buildKnowledge()

export function findAnswer(question) {
  const q = question.toLowerCase().replace(/[^a-z0-9\s]/g, '')

  if (/^(hi|hello|hey|hi there|hello there)\b/.test(q)) {
    return { answer: `Hi! I'm Amera's virtual assistant. Ask me anything about their skills, experience, projects, or background!` }
  }

  const words = q.split(/\s+/).filter(w => w.length > 2)
  const stopWords = new Set(['the', 'and', 'for', 'are', 'you', 'your', 'tell', 'what', 'about', 'can', 'have', 'has', 'with', 'from', 'that', 'this', 'know', 'like', 'would', 'could', 'please', 'some', 'more', 'than'])

  let best = null
  let bestScore = 0

  for (const item of knowledge) {
    let score = 0
    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase()
      if (q.includes(kwLower)) {
        score += kwLower.length
      }
      for (const word of words) {
        if (!stopWords.has(word) && kwLower.includes(word)) {
          score += word.length * 0.5
        }
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }

  if (best && bestScore > 2) {
    return {
      answer: best.text,
      category: best.category,
    }
  }

  const generalKnowledge = knowledge.filter(k => k.category !== 'personal')
  const random = generalKnowledge[Math.floor(Math.random() * generalKnowledge.length)]
  return {
    answer: `I can only answer questions based on Amera's CV. Try asking about skills, experience, projects, education, or languages. For example: "${sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]}"`
  }
}

const sampleQuestions = [
  'What are your skills?',
  'Tell me about your experience',
  'What projects have you built?',
  'Where did you study?',
  'What is your contact information?',
  'Tell me about BlogHub',
  'What technologies do you use?',
]
