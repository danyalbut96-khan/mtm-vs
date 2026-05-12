import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get('doctorId')
    const patientEmail = searchParams.get('patientEmail')

    const supabase = createClient()

    if (doctorId) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('date', { ascending: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ appointments: data || [] })
    }

    if (patientEmail) {
      const { data: patient } = await supabase.from('patients').select('id').eq('email', patientEmail).single()
      if (!patient) return NextResponse.json({ appointments: [] })

      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(name, specialization, city)')
        .eq('patient_id', patient.id)
        .order('date', { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ appointments: data || [] })
    }

    return NextResponse.json({ appointments: [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
