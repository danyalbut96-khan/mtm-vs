import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { anthropic } from '@/lib/anthropic'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { doctor_id, message, patient_name, patient_phone, is_doctor_available, conversation_history } = await req.json()

    const supabase = createClient()

    let doctorContext = ''
    let doctorEmail = ''
    let doctorName = ''

    if (doctor_id) {
      const { data: doctor } = await supabase.from('doctors').select('*').eq('id', doctor_id).single()
      if (doctor) {
        doctorContext = `You are the AI assistant for Dr. ${doctor.name}, a ${doctor.specialization} specialist based in ${doctor.city}, Pakistan.`
        doctorEmail = doctor.email
        doctorName = doctor.name
      }
    }

    const systemPrompt = doctor_id
      ? `${doctorContext} The doctor is currently ${is_doctor_available ? 'available' : 'unavailable'}.
${is_doctor_available
  ? 'Help the patient with their query. You can answer general health questions and assist with appointment scheduling.'
  : `Since the doctor is unavailable, collect the patient's: 1) Full name 2) Contact number 3) Problem description.
     Be empathetic and professional. Once you have all three, confirm you'll notify Dr. ${doctorName} and they'll follow up.
     Keep responses concise and helpful.`
}
Always be professional, empathetic, and NEVER provide specific medical diagnoses. Suggest seeing a doctor for serious concerns.`
      : `You are SmartDoc AI, a healthcare assistant for patients in Pakistan.
Help patients understand their symptoms and suggest what type of doctor they should see.
NEVER diagnose medical conditions. Always recommend consulting a qualified doctor.
Be concise, empathetic, and helpful. If asked about specific doctors, mention they can search on our platform.`

    const history = (conversation_history || []).slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.content,
    }))

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: systemPrompt,
      messages: [...history, { role: 'user', content: message }],
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : 'I apologize, I could not process your message.'

    if (doctor_id) {
      await supabase.from('messages').insert({
        doctor_id,
        sender_type: 'patient',
        content: message,
        patient_name,
        patient_phone,
      }).catch(() => {})

      await supabase.from('messages').insert({
        doctor_id,
        sender_type: 'ai',
        content: reply,
      }).catch(() => {})

      const hasName = patient_name && patient_name.length > 0
      const hasPhone = patient_phone && patient_phone.length > 0
      const mightHaveInfo = message.match(/(\+?[\d\s-]{10,})/g)

      if (!is_doctor_available && doctorEmail && (hasName || hasPhone || mightHaveInfo)) {
        await resend.emails.send({
          from: 'SmartDoc AI <noreply@smartdocai.com>',
          to: doctorEmail,
          subject: `New Patient Message - ${patient_name || 'Unknown Patient'}`,
          html: `
            <h2>New Patient Message</h2>
            <p><strong>Patient:</strong> ${patient_name || 'Unknown'}</p>
            <p><strong>Phone:</strong> ${patient_phone || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><em>Responded via AI Assistant</em></p>
          `,
        }).catch(() => {})
      }
    }

    const needsInfo = !is_doctor_available && doctor_id && (!patient_name || !patient_phone)

    return NextResponse.json({ reply, collect_info: needsInfo })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
