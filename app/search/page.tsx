'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DoctorCard from '@/components/DoctorCard'

const SPECIALIZATIONS = [
  'All', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
  'Pediatrics', 'Psychiatry', 'Gynecology', 'Dentistry', 'Ophthalmology',
  'ENT', 'Gastroenterology', 'Endocrinology', 'Pulmonology', 'Urology',
  'Oncology', 'Nephrology', 'Hematology', 'General Medicine',
]

const CITIES = ['All', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

interface Doctor {
  id: string
  name: string
  specialization: string
  city: string
  consultation_type: string
  experience?: number
  rating?: number
  profile_pic?: string
  is_available?: boolean
  bio?: string
}

interface AISuggestion {
  suggested_specialization: string
  explanation: string
  doctors: Doctor[]
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || 'All')
  const [specialization, setSpecialization] = useState('All')
  const [consultationType, setConsultationType] = useState('All')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = async (q: string, c: string, spec: string, type: string) => {
    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      if (spec !== 'All') params.set('specialization', spec)
      if (c !== 'All') params.set('city', c)
      if (type !== 'All') params.set('type', type)
      if (q) params.set('q', q)

      const res = await fetch(`/api/doctors/search?${params.toString()}`)
      const data = await res.json()
      setDoctors(data.doctors || [])

      if (q && q.trim()) {
        const aiRes = await fetch('/api/ai/suggest-doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: q, city: c !== 'All' ? c : undefined }),
        })
        const aiData = await aiRes.json()
        if (aiData.suggested_specialization) setAiSuggestion(aiData)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get('q') || ''
    const c = searchParams.get('city') || 'All'
    if (q || c !== 'All') search(q, c, 'All', 'All')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    search(query, city, specialization, consultationType)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto px-gutter py-lg w-full">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-sm mb-lg flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/20 text-body-md outline-none"
              placeholder="Search symptoms, specialization..."
            />
          </div>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="py-sm px-sm bg-surface-container-lowest rounded-xl border border-outline-variant text-body-md outline-none"
          >
            {CITIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>)}
          </select>
          <button type="submit" className="bg-primary-container text-on-primary-container px-lg py-sm rounded-xl font-label-sm hover:brightness-110 transition-all flex items-center gap-xs">
            <span className="material-symbols-outlined">search</span>
            Search
          </button>
        </form>

        <div className="flex flex-col md:flex-row gap-lg">
          {/* Filters Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-level-1 sticky top-24">
              <h3 className="font-headline-md text-on-surface mb-md">Filters</h3>
              <div className="mb-md">
                <label className="text-label-sm text-on-surface-variant mb-xs block">Specialization</label>
                <select
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className="w-full py-xs px-sm bg-surface-container rounded-lg border border-outline-variant text-body-md outline-none"
                >
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="mb-md">
                <label className="text-label-sm text-on-surface-variant mb-xs block">Consultation Type</label>
                <div className="flex flex-col gap-xs">
                  {['All', 'Online', 'Physical', 'Both'].map(t => (
                    <label key={t} className="flex items-center gap-xs cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={consultationType === t}
                        onChange={() => setConsultationType(t)}
                        className="accent-primary"
                      />
                      <span className="text-body-md text-on-surface">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={() => search(query, city, specialization, consultationType)}
                className="w-full bg-primary-container text-on-primary-container py-sm rounded-lg font-label-sm hover:brightness-110 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* AI Suggestion Banner */}
            {aiSuggestion && (
              <div className="bg-primary-fixed border border-primary/20 rounded-xl p-md mb-md flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-[24px] mt-[2px]">psychology</span>
                <div>
                  <p className="font-label-sm text-on-primary-fixed-variant font-bold">AI Suggestion</p>
                  <p className="text-body-md text-on-surface-variant">{aiSuggestion.explanation}</p>
                  {aiSuggestion.suggested_specialization && (
                    <button
                      onClick={() => setSpecialization(aiSuggestion.suggested_specialization)}
                      className="mt-xs text-primary text-label-sm font-bold hover:underline"
                    >
                      Filter by {aiSuggestion.suggested_specialization} →
                    </button>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-xl">
                <div className="flex flex-col items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span>
                  <p className="text-on-surface-variant">Finding best doctors for you...</p>
                </div>
              </div>
            ) : searched ? (
              <>
                <div className="flex items-center justify-between mb-md">
                  <p className="text-on-surface-variant text-body-md">{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found</p>
                </div>
                {doctors.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
                    {doctors.map(doc => <DoctorCard key={doc.id} doctor={doc} />)}
                  </div>
                ) : (
                  <div className="text-center py-xl">
                    <span className="material-symbols-outlined text-outline text-[64px]">search_off</span>
                    <p className="text-headline-md text-on-surface mt-sm">No doctors found</p>
                    <p className="text-on-surface-variant mt-xs">Try different keywords or remove filters</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-xl">
                <span className="material-symbols-outlined text-primary text-[64px]">medical_services</span>
                <p className="text-headline-md text-on-surface mt-sm">Find Your Doctor</p>
                <p className="text-on-surface-variant mt-xs">Search by symptoms, specialty, or city to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span></div>}>
      <SearchContent />
    </Suspense>
  )
}
