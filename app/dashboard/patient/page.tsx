'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'

interface Appointment {
  id: string
  date: string
  time_slot: string
  type: string
  status: string
  problem_description?: string
  doctors: { name: string; specialization: string; city: string }
}

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard/patient' },
  { icon: 'calendar_month', label: 'Appointments', href: '/dashboard/patient' },
  { icon: 'chat', label: 'Messages', href: '/chat' },
  { icon: 'search', label: 'Find Doctor', href: '/search' },
  { icon: 'settings', label: 'Settings', href: '#' },
]

export default function PatientDashboard() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      setUser({ email: data.user.email!, name: data.user.user_metadata?.full_name || 'Patient' })

      fetch(`/api/appointments?patientEmail=${data.user.email}`)
        .then(r => r.json())
        .then(d => { setAppointments(d.appointments || []); setLoading(false) })
        .catch(() => setLoading(false))
    })
  }, [router])

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled')
  const past = appointments.filter(a => new Date(a.date) < new Date() || a.status === 'cancelled')

  const statusColor = (status: string) => ({
    confirmed: 'bg-secondary-container text-on-secondary-container',
    pending: 'bg-primary-fixed text-on-primary-fixed-variant',
    cancelled: 'bg-error-container text-on-error-container',
  }[status] || 'bg-surface-container text-on-surface-variant')

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <div className="flex-grow max-w-container-max mx-auto px-gutter py-lg w-full flex flex-col md:flex-row gap-lg">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-sm">
            <div className="p-sm mb-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-xs">
                <span className="material-symbols-outlined text-primary text-[28px]">person</span>
              </div>
              <p className="font-medium text-on-surface">{user?.name}</p>
              <p className="text-label-sm text-on-surface-variant">{user?.email}</p>
            </div>
            <nav className="flex flex-col gap-xs">
              {NAV_ITEMS.map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-sm px-sm py-xs rounded-lg text-body-md text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  {label}
                </Link>
              ))}
              <button
                onClick={async () => { await createClient().auth.signOut(); router.push('/') }}
                className="flex items-center gap-sm px-sm py-xs rounded-lg text-body-md text-error hover:bg-error-container transition-all mt-sm"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-lg">
          {/* Welcome */}
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-on-surface-variant">You have {upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Quick Search */}
          <div className="bg-primary-fixed rounded-xl p-md flex items-center justify-between gap-md flex-wrap">
            <div>
              <h3 className="font-headline-md text-on-primary-fixed-variant mb-xs">Need a Doctor?</h3>
              <p className="text-on-surface-variant text-body-md">Search by symptoms, specialization, or city</p>
            </div>
            <button
              onClick={() => router.push('/search')}
              className="bg-primary-container text-on-primary-container px-lg py-sm rounded-xl font-label-sm hover:brightness-110 transition-all flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Find Doctor
            </button>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Upcoming Appointments</h2>
            {loading ? (
              <div className="flex items-center justify-center py-lg">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
              </div>
            ) : upcoming.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md text-center">
                <span className="material-symbols-outlined text-outline text-[48px]">calendar_today</span>
                <p className="text-on-surface-variant mt-sm">No upcoming appointments</p>
                <button onClick={() => router.push('/search')} className="text-primary text-label-sm hover:underline mt-xs">Book one now →</button>
              </div>
            ) : (
              <div className="flex flex-col gap-sm">
                {upcoming.map(apt => (
                  <div key={apt.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md flex items-start gap-md">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary">{apt.type === 'Online' ? 'video_call' : 'local_hospital'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-sm flex-wrap">
                        <div>
                          <p className="font-medium text-on-surface">Dr. {apt.doctors?.name}</p>
                          <p className="text-label-sm text-primary">{apt.doctors?.specialization}</p>
                        </div>
                        <span className={`px-xs py-[2px] rounded-full text-[11px] font-bold ${statusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-md mt-sm text-label-sm text-on-surface-variant">
                        <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">calendar_month</span>{apt.date}</span>
                        <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">schedule</span>{apt.time_slot}</span>
                        <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">video_call</span>{apt.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments */}
          {past.length > 0 && (
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Past Appointments</h2>
              <div className="flex flex-col gap-sm">
                {past.slice(0, 3).map(apt => (
                  <div key={apt.id} className="bg-surface-container rounded-xl border border-outline-variant p-md flex items-center gap-md opacity-70">
                    <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">history</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-on-surface text-body-md">Dr. {apt.doctors?.name}</p>
                      <p className="text-label-sm text-on-surface-variant">{apt.date} • {apt.type}</p>
                    </div>
                    <span className={`px-xs py-[2px] rounded-full text-[11px] font-bold ${statusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
