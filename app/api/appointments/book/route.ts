import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { doctor_id, type, date, time_slot, patient_name, patient_email, patient_phone, problem_description } = body

    const supabase = createClient()

    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctor_id)
      .eq('date', date)
      .eq('time_slot', time_slot)
      .neq('status', 'cancelled')
      .single()

    if (existing) return NextResponse.json({ error: 'This time slot is already booked. Please choose another.' }, { status: 409 })

    let patient_id: string | null = null
    const { data: existingPatient } = await supabase.from('patients').select('id').eq('email', patient_email).single()
    if (existingPatient) {
      patient_id = existingPatient.id
    } else {
      const { data: newPatient } = await supabase
        .from('patients')
        .insert({ name: patient_name, email: patient_email, phone: patient_phone })
        .select()
        .single()
      if (newPatient) patient_id = newPatient.id
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        doctor_id,
        patient_id,
        date,
        time_slot,
        type,
        status: 'confirmed',
        problem_description,
        patient_name,
        patient_email,
        patient_phone,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const { data: doctor } = await supabase.from('doctors').select('name, email').eq('id', doctor_id).single()
    if (doctor?.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'SmartDoc AI <noreply@smartdocai.com>',
        to: doctor.email,
        subject: `New Appointment: ${patient_name} on ${date}`,
        html: `
          <h2>New Appointment Booked</h2>
          <p><strong>Patient:</strong> ${patient_name}</p>
          <p><strong>Email:</strong> ${patient_email}</p>
          <p><strong>Phone:</strong> ${patient_phone || 'N/A'}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time_slot}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Problem:</strong> ${problem_description || 'N/A'}</p>
        `,
      }).catch(() => {})
    }

    return NextResponse.json({ appointment })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
