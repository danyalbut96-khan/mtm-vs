'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SPECIALIZATIONS = [
  'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Pediatrics',
  'Psychiatry', 'Gynecology', 'Dentistry', 'Ophthalmology', 'ENT',
  'Gastroenterology', 'Endocrinology', 'Pulmonology', 'Urology',
  'Oncology', 'Nephrology', 'Hematology', 'General Medicine',
]

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function DoctorRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    specialization: '', experience: '', city: '', location: '', consultation_type: 'Online',
    bio: '', profile_pic: '',
    availability: DAYS.map(d => ({ day: d, enabled: false, start: '09:00', end: '17:00' })),
  })

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const toggleDay = (i: number) => setForm(f => {
    const availability = [...f.availability]
    availability[i] = { ...availability[i], enabled: !availability[i].enabled }
    return { ...f, availability }
  })

  const updateDay = (i: number, field: string, value: string) => setForm(f => {
    const availability = [...f.availability]
    availability[i] = { ...availability[i], [field]: value }
    return { ...f, availability }
  })

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/doctors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      router.push('/dashboard/doctor')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Personal Info', 'Professional Details', 'Availability', 'Review']

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-xl px-gutter">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-xl">
            <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">Join Our Network</h1>
            <p className="text-on-surface-variant text-body-lg">Connect with thousands of patients across Pakistan</p>
          </div>

          {/* Progress */}
          <div className="mb-xl">
            <div className="flex justify-between mb-sm">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-xs flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-bold transition-all ${
                    i + 1 < step ? 'bg-secondary text-on-secondary' :
                    i + 1 === step ? 'bg-primary-container text-on-primary-container' :
                    'bg-surface-container text-on-surface-variant'
                  }`}>
                    {i + 1 < step ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
                  </div>
                  <span className="text-[11px] text-on-surface-variant hidden sm:block text-center">{s}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full">
              <div
                className="h-2 bg-primary-container rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md mb-lg">
            {step === 1 && (
              <div className="flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Personal Information</h2>
                {[
                  { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Dr. Ahmed Khan' },
                  { label: 'Email Address', field: 'email', type: 'email', placeholder: 'doctor@example.com' },
                  { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+92 300 1234567' },
                  { label: 'Password', field: 'password', type: 'password', placeholder: 'Create a strong password' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} className="flex flex-col gap-xs">
                    <label className="text-label-sm text-on-surface-variant">{label}</label>
                    <input
                      type={type}
                      value={form[field as keyof typeof form] as string}
                      onChange={e => update(field, e.target.value)}
                      placeholder={placeholder}
                      className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/20 text-body-md outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Professional Details</h2>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant">Specialization</label>
                  <select
                    value={form.specialization}
                    onChange={e => update('specialization', e.target.value)}
                    className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none"
                  >
                    <option value="">Select Specialization</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant">Years of Experience</label>
                  <input
                    type="number"
                    value={form.experience}
                    onChange={e => update('experience', e.target.value)}
                    placeholder="e.g. 10"
                    className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant">City</label>
                  <select
                    value={form.city}
                    onChange={e => update('city', e.target.value)}
                    className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none"
                  >
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant">Clinic/Hospital Address</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => update('location', e.target.value)}
                    placeholder="e.g. 123 Main Street, Gulberg"
                    className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant">Consultation Type</label>
                  <div className="flex gap-sm">
                    {['Online', 'Physical', 'Both'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update('consultation_type', t)}
                        className={`flex-1 py-sm rounded-xl text-label-sm font-medium border transition-all ${
                          form.consultation_type === t
                            ? 'bg-primary-container text-on-primary-container border-primary-container'
                            : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant">Bio / About</label>
                  <textarea
                    value={form.bio}
                    onChange={e => update('bio', e.target.value)}
                    placeholder="Tell patients about your expertise, approach, and experience..."
                    rows={4}
                    className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Set Your Availability</h2>
                <p className="text-on-surface-variant text-body-md">Choose which days and times you are available for appointments.</p>
                {form.availability.map((day, i) => (
                  <div key={day.day} className="flex items-center gap-md">
                    <button
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        day.enabled ? 'bg-primary-container border-primary-container' : 'border-outline-variant'
                      }`}
                    >
                      {day.enabled && <span className="material-symbols-outlined text-on-primary-container text-[14px]">check</span>}
                    </button>
                    <span className="w-24 text-body-md text-on-surface">{day.day}</span>
                    {day.enabled && (
                      <div className="flex items-center gap-xs flex-1">
                        <input
                          type="time"
                          value={day.start}
                          onChange={e => updateDay(i, 'start', e.target.value)}
                          className="py-xs px-sm bg-surface-container rounded-lg border border-outline-variant text-body-md outline-none"
                        />
                        <span className="text-on-surface-variant">to</span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={e => updateDay(i, 'end', e.target.value)}
                          className="py-xs px-sm bg-surface-container rounded-lg border border-outline-variant text-body-md outline-none"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Review Your Profile</h2>
                <div className="flex flex-col gap-sm bg-surface-container p-md rounded-xl">
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                    { label: 'Specialization', value: form.specialization },
                    { label: 'Experience', value: form.experience ? `${form.experience} years` : '' },
                    { label: 'City', value: form.city },
                    { label: 'Consultation Type', value: form.consultation_type },
                  ].map(({ label, value }) => value ? (
                    <div key={label} className="flex justify-between text-body-md">
                      <span className="text-on-surface-variant">{label}</span>
                      <span className="text-on-surface font-medium">{value}</span>
                    </div>
                  ) : null)}
                </div>
                {error && (
                  <div className="bg-error-container text-on-error-container p-sm rounded-xl text-body-md">{error}</div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => step > 1 && setStep(s => s - 1)}
              disabled={step === 1}
              className="px-lg py-sm border border-outline-variant text-on-surface-variant rounded-xl font-label-sm hover:bg-surface-container transition-all disabled:opacity-40"
            >
              Previous
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-lg py-sm bg-primary-container text-on-primary-container rounded-xl font-label-sm hover:brightness-110 transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-lg py-sm bg-primary-container text-on-primary-container rounded-xl font-label-sm hover:brightness-110 transition-all disabled:opacity-60 flex items-center gap-xs"
              >
                {loading && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                Complete Registration
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
