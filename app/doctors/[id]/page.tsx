'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Doctor {
  id: string
  name: string
  specialization: string
  city: string
  location?: string
  consultation_type: string
  experience?: number
  rating?: number
  profile_pic?: string
  is_available?: boolean
  bio?: string
}

export default function DoctorProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then(r => r.json())
      .then(data => { setDoctor(data.doctor); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span>
    </div>
  )

  if (!doctor) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center flex-col gap-sm">
        <span className="material-symbols-outlined text-outline text-[64px]">person_off</span>
        <p className="text-headline-md text-on-surface">Doctor not found</p>
        <button onClick={() => router.push('/search')} className="text-primary hover:underline">Back to Search</button>
      </div>
      <Footer />
    </div>
  )

  const rating = doctor.rating ?? 4.5

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto px-gutter py-lg w-full">
        <button onClick={() => router.back()} className="flex items-center gap-xs text-on-surface-variant hover:text-primary mb-md transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-lg">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-md">
            {/* Profile Header */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md">
              <div className="flex flex-col sm:flex-row gap-md items-start">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {doctor.profile_pic ? (
                    <img src={doctor.profile_pic} alt={doctor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-[48px]">person</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-sm flex-wrap mb-xs">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Dr. {doctor.name}</h1>
                    {doctor.is_available ? (
                      <span className="px-sm py-[2px] bg-secondary-container text-on-secondary-container text-label-sm font-bold rounded-full flex items-center gap-xs">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span> Available
                      </span>
                    ) : (
                      <span className="px-sm py-[2px] bg-error-container text-on-error-container text-label-sm font-bold rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-semibold text-body-lg mb-xs">{doctor.specialization}</p>
                  <div className="flex flex-wrap gap-md text-on-surface-variant text-body-md">
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {doctor.city}{doctor.location ? `, ${doctor.location}` : ''}
                    </span>
                    {doctor.experience && (
                      <span className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px]">work</span>
                        {doctor.experience} years experience
                      </span>
                    )}
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">video_call</span>
                      {doctor.consultation_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-xs mt-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`material-symbols-outlined text-[20px] ${i < Math.round(rating) ? 'text-tertiary' : 'text-outline-variant'}`}
                        style={{ fontVariationSettings: i < Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    ))}
                    <span className="text-body-md text-on-surface-variant ml-xs">{rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">About</h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {/* Chat Section */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">chat</span>
                Chat with Doctor
              </h2>
              <p className="text-on-surface-variant text-body-md mb-sm">
                {doctor.is_available ? 'The doctor is available. Start a conversation.' : 'Doctor is busy — our AI assistant will respond and notify the doctor.'}
              </p>
              <button
                onClick={() => router.push(`/chat?doctorId=${doctor.id}`)}
                className="bg-primary-container text-on-primary-container px-md py-sm rounded-xl font-label-sm hover:brightness-110 transition-all flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                {doctor.is_available ? 'Start Chat' : 'Message (AI will respond)'}
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md sticky top-24 flex flex-col gap-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Book Appointment</h2>
              <div className="flex flex-col gap-xs text-body-md text-on-surface-variant">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">video_call</span>
                  {doctor.consultation_type} consultation
                </div>
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                  {doctor.city}
                </div>
              </div>
              <button
                onClick={() => router.push(`/booking/${doctor.id}`)}
                className="w-full bg-primary-container text-on-primary-container py-md rounded-xl font-headline-md hover:brightness-110 transition-all hover:shadow-lg flex items-center justify-center gap-xs"
              >
                <span className="material-symbols-outlined">calendar_month</span>
                Book Appointment
              </button>
              <button
                onClick={() => router.push(`/chat?doctorId=${doctor.id}`)}
                className="w-full border border-primary text-primary py-sm rounded-xl font-label-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-xs"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
