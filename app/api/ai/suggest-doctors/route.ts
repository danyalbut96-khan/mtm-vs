import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { anthropic, keywordMatchSpecialization } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  try {
    const { symptoms, city } = await req.json()

    let suggestedSpecialization = keywordMatchSpecialization(symptoms)
    let explanation = ''

    if (!suggestedSpecialization) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 200,
          system: 'You are a medical triage assistant. Given patient symptoms, respond ONLY with a JSON object: {"specialization": "...", "explanation": "..."}. Use one of these specializations: Cardiology, Dermatology, Orthopedics, Neurology, Pediatrics, Psychiatry, Gynecology, Dentistry, Ophthalmology, ENT, Gastroenterology, Endocrinology, Pulmonology, Urology, Oncology, Nephrology, General Medicine. Keep explanation under 20 words.',
          messages: [{ role: 'user', content: `Patient symptoms: ${symptoms}` }],
        })

        const text = response.content[0].type === 'text' ? response.content[0].text : ''
        const jsonMatch = text.match(/\{[^}]+\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          suggestedSpecialization = parsed.specialization
          explanation = parsed.explanation
        }
      } catch {}
    }

    if (!suggestedSpecialization) {
      return NextResponse.json({ suggested_specialization: null, explanation: '', doctors: [] })
    }

    explanation = explanation || `Based on your symptoms, we recommend seeing a ${suggestedSpecialization} specialist.`

    const supabase = createClient()
    let query = supabase.from('doctors').select('*').ilike('specialization', `%${suggestedSpecialization}%`)
    if (city) query = query.ilike('city', `%${city}%`)
    query = query.order('rating', { ascending: false }).limit(3)

    const { data: doctors } = await query

    return NextResponse.json({ suggested_specialization: suggestedSpecialization, explanation, doctors: doctors || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
