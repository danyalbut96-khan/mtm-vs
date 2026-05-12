import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const SYMPTOM_TO_SPECIALIZATION: Record<string, string> = {
  'heart': 'Cardiology',
  'chest pain': 'Cardiology',
  'cardiac': 'Cardiology',
  'skin': 'Dermatology',
  'rash': 'Dermatology',
  'acne': 'Dermatology',
  'back pain': 'Orthopedics',
  'joint': 'Orthopedics',
  'bone': 'Orthopedics',
  'fracture': 'Orthopedics',
  'teeth': 'Dentistry',
  'dental': 'Dentistry',
  'tooth': 'Dentistry',
  'eye': 'Ophthalmology',
  'vision': 'Ophthalmology',
  'ear': 'ENT',
  'nose': 'ENT',
  'throat': 'ENT',
  'child': 'Pediatrics',
  'pediatric': 'Pediatrics',
  'baby': 'Pediatrics',
  'mental': 'Psychiatry',
  'anxiety': 'Psychiatry',
  'depression': 'Psychiatry',
  'neuro': 'Neurology',
  'headache': 'Neurology',
  'migraine': 'Neurology',
  'stomach': 'Gastroenterology',
  'digestion': 'Gastroenterology',
  'liver': 'Gastroenterology',
  'kidney': 'Nephrology',
  'urine': 'Urology',
  'diabetes': 'Endocrinology',
  'thyroid': 'Endocrinology',
  'hormone': 'Endocrinology',
  'cancer': 'Oncology',
  'lung': 'Pulmonology',
  'breathing': 'Pulmonology',
  'asthma': 'Pulmonology',
  'blood': 'Hematology',
  'allergy': 'Allergy & Immunology',
  'immune': 'Allergy & Immunology',
  'pregnancy': 'Gynecology',
  'gynec': 'Gynecology',
  'womens': 'Gynecology',
}

export function keywordMatchSpecialization(query: string): string | null {
  const lower = query.toLowerCase()
  for (const [keyword, specialization] of Object.entries(SYMPTOM_TO_SPECIALIZATION)) {
    if (lower.includes(keyword)) return specialization
  }
  return null
}
