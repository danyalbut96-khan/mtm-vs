import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, password, specialization, experience, city, location, consultation_type, bio, availability } = body

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role: 'doctor' } },
    })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

    const { data: doctor, error: dbError } = await supabase
      .from('doctors')
      .insert({
        name,
        email,
        phone,
        specialization,
        experience: experience ? parseInt(experience) : null,
        city,
        location,
        consultation_type,
        bio,
        is_available: true,
        rating: 0,
      })
      .select()
      .single()

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 400 })

    if (availability && doctor) {
      const slots = availability
        .filter((d: { enabled: boolean }) => d.enabled)
        .map((d: { day: string; start: string; end: string }) => ({
          doctor_id: doctor.id,
          day_of_week: d.day,
          start_time: d.start,
          end_time: d.end,
        }))
      if (slots.length > 0) await supabase.from('availability_slots').insert(slots)
    }

    return NextResponse.json({ doctor, user: authData.user })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
