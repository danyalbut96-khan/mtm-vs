import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { keywordMatchSpecialization } from '@/lib/anthropic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const specialization = searchParams.get('specialization')
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const q = searchParams.get('q')

    const supabase = createClient()
    let query = supabase.from('doctors').select('*')

    if (specialization) {
      query = query.ilike('specialization', `%${specialization}%`)
    } else if (q) {
      const matched = keywordMatchSpecialization(q)
      if (matched) {
        query = query.ilike('specialization', `%${matched}%`)
      } else {
        query = query.or(`name.ilike.%${q}%,specialization.ilike.%${q}%,bio.ilike.%${q}%`)
      }
    }

    if (city && city !== 'All') query = query.ilike('city', `%${city}%`)
    if (type && type !== 'All') query = query.or(`consultation_type.eq.${type},consultation_type.eq.Both`)

    query = query.order('rating', { ascending: false }).limit(50)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ doctors: data || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
