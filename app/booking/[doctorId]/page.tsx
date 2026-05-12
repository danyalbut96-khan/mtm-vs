'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

interface Doctor {
  id: string
  name: string
  specialization: string
  city: string
  consultation_type: string
  is_available?: boolean
}

export default function BookingPage() {
  const { doctorId } = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  const [form, setForm] = useState({
    type: 'Online',
    date: '',
    time_slot: '',
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    problem_description: '',
  })

  useEffect(() => {
    fetch(`/api/doctors/${doctorId}`)
      .then(r => r.json())
      .then(d => setDoctor(d.doctor))
  }, [doctorId])

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleBook = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id: doctorId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBooked(true)
    } catch (e) {
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Type', 'Schedule', 'Details', 'Confirm']

  if (booked) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-gutter">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-md">
            <span className="material-symbols-outlined text-secondary text-[48px]">check_circle</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Appointment Booked!</h2>
          <p className="text-on-surface-variant text-body-lg mb-md">
            Your appointment with Dr. {doctor?.name} on {form.date} at {form.time_slot} is confirmed.
            A confirmation email has been sent.
          </p>
          <div className="flex gap-sm justify-center">
            <button onClick={() => router.push('/dashboard/patient')} className="bg-primary-container text-on-primary-container px-lg py-sm rounded-xl font-label-sm hover:brightness-110 transition-all">
              View My Appointments
            </button>
            <button onClick={() => router.push('/search')} className="border border-outline-variant text-on-surface-variant px-lg py-sm rounded-xl font-label-sm hover:bg-surface-container transition-all">
              Find More Doctors
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto px-gutter py-lg w-full">
        <div className="mb-lg">
          <button onClick={() => router.back()} className="flex items-center gap-xs text-on-surface-variant hover:text-primary mb-sm transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Book an Appointment</h1>
          {doctor && <p className="text-on-surface-variant">with Dr. {doctor.name} — {doctor.specialization}</p>}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-xs mb-lg overflow-x-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-xs">
              <div className={`flex items-center gap-xs px-sm py-xs rounded-full text-label-sm font-medium whitespace-nowrap ${
                i + 1 === step ? 'bg-primary-container text-on-primary-container' :
                i + 1 < step ? 'bg-secondary-container text-on-secondary-container' :
                'bg-surface-container text-on-surface-variant'
              }`}>
                {i + 1 < step ? <span className="material-symbols-outlined text-[14px]">check</span> : <span>{i + 1}</span>}
                {s}
              </div>
              {i < steps.length - 1 && <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-lg">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md">
              {step === 1 && (
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Appointment Type</h2>
                  <div className="grid sm:grid-cols-2 gap-md">
                    {(['Online', 'Physical'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => update('type', t)}
                        className={`p-md rounded-xl border-2 text-left transition-all ${
                          form.type === t ? 'border-primary-container bg-primary-fixed' : 'border-outline-variant hover:border-primary/30'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[32px] mb-sm block ${form.type === t ? 'text-primary' : 'text-outline'}`}>
                          {t === 'Online' ? 'video_call' : 'local_hospital'}
                        </span>
                        <h3 className="font-headline-md text-on-surface">{t}</h3>
                        <p className="text-on-surface-variant text-body-md mt-xs">
                          {t === 'Online' ? 'Video consultation from anywhere' : 'Visit the clinic in person'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Select Date & Time</h2>
                  <div className="flex flex-col gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-sm text-on-surface-variant">Date</label>
                      <input
                        type="date"
                        value={form.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => update('date', e.target.value)}
                        className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none"
                      />
                    </div>
                    {form.date && (
                      <div>
                        <label className="text-label-sm text-on-surface-variant mb-sm block">Available Time Slots</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-sm">
                          {TIME_SLOTS.map(slot => (
                            <button
                              key={slot}
                              onClick={() => update('time_slot', slot)}
                              className={`py-sm rounded-lg text-label-sm font-medium border transition-all ${
                                form.time_slot === slot
                                  ? 'bg-primary-container text-on-primary-container border-primary-container'
                                  : 'border-outline-variant text-on-surface hover:border-primary/30'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Your Details</h2>
                  <div className="flex flex-col gap-md">
                    {[
                      { label: 'Full Name', field: 'patient_name', type: 'text', placeholder: 'Your name' },
                      { label: 'Email', field: 'patient_email', type: 'email', placeholder: 'your@email.com' },
                      { label: 'Phone', field: 'patient_phone', type: 'tel', placeholder: '+92 300 1234567' },
                    ].map(({ label, field, type, placeholder }) => (
                      <div key={field} className="flex flex-col gap-xs">
                        <label className="text-label-sm text-on-surface-variant">{label}</label>
                        <input
                          type={type}
                          value={form[field as keyof typeof form]}
                          onChange={e => update(field, e.target.value)}
                          placeholder={placeholder}
                          className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none"
                        />
                      </div>
                    ))}
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-sm text-on-surface-variant">Describe Your Problem</label>
                      <textarea
                        value={form.problem_description}
                        onChange={e => update('problem_description', e.target.value)}
                        placeholder="Describe your symptoms or reason for visit..."
                        rows={4}
                        className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Confirm Booking</h2>
                  <div className="bg-surface-container p-md rounded-xl flex flex-col gap-sm mb-md">
                    {doctor && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Doctor</span>
                        <span className="text-on-surface font-medium">Dr. {doctor.name}</span>
                      </div>
                    )}
                    {[
                      { label: 'Type', value: form.type },
                      { label: 'Date', value: form.date },
                      { label: 'Time', value: form.time_slot },
                      { label: 'Patient', value: form.patient_name },
                      { label: 'Email', value: form.patient_email },
                    ].map(({ label, value }) => value ? (
                      <div key={label} className="flex justify-between">
                        <span className="text-on-surface-variant">{label}</span>
                        <span className="text-on-surface font-medium">{value}</span>
                      </div>
                    ) : null)}
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={loading}
                    className="w-full bg-primary-container text-on-primary-container py-md rounded-xl font-headline-md hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-xs"
                  >
                    {loading && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                    Confirm Appointment
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-md">
              <button
                onClick={() => step > 1 && setStep(s => s - 1)}
                disabled={step === 1}
                className="px-lg py-sm border border-outline-variant text-on-surface-variant rounded-xl font-label-sm hover:bg-surface-container transition-all disabled:opacity-40"
              >
                Previous
              </button>
              {step < 4 && (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={(step === 2 && (!form.date || !form.time_slot)) || (step === 3 && (!form.patient_name || !form.patient_email))}
                  className="px-lg py-sm bg-primary-container text-on-primary-container rounded-xl font-label-sm hover:brightness-110 transition-all disabled:opacity-40"
                >
                  Continue
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          {doctor && (
            <div className="lg:col-span-1">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md sticky top-24">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Summary</h3>
                <div className="flex items-center gap-sm mb-md">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <p className="font-medium text-on-surface">Dr. {doctor.name}</p>
                    <p className="text-label-sm text-primary">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-xs text-body-md">
                  {form.type && <div className="flex items-center gap-xs text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">video_call</span>{form.type}</div>}
                  {form.date && <div className="flex items-center gap-xs text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">calendar_month</span>{form.date}</div>}
                  {form.time_slot && <div className="flex items-center gap-xs text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">schedule</span>{form.time_slot}</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
