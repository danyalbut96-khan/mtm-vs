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
  patient_name?: string
  patient_email?: string
}

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard/doctor' },
  { icon: 'calendar_month', label: 'Appointments', href: '/dashboard/doctor' },
  { icon: 'chat', label: 'Messages', href: '/chat' },
  { icon: 'person', label: 'My Profile', href: '#' },
  { icon: 'settings', label: 'Settings', href: '#' },
]

export default function DoctorDashboard() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctorData, setDoctorData] = useState<{ name: string; is_available: boolean; id: string } | null>(null)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [togglingAvailability, setTogglingAvailability] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/auth?role=doctor'); return }
      setUser({ email: data.user.email! })

      const res = await fetch(`/api/doctors/me?email=${data.user.email}`)
      const d = await res.json()
      if (d.doctor) {
        setDoctorData(d.doctor)
        const apptRes = await fetch(`/api/appointments?doctorId=${d.doctor.id}`)
        const apptData = await apptRes.json()
        setAppointments(apptData.appointments || [])
      }
      setLoading(false)
    })
  }, [router])

  const toggleAvailability = async () => {
    if (!doctorData) return
    setTogglingAvailability(true)
    try {
      const res = await fetch(`/api/doctors/${doctorData.id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !doctorData.is_available }),
      })
      const data = await res.json()
      if (data.doctor) setDoctorData(prev => prev ? { ...prev, is_available: data.doctor.is_available } : null)
    } finally {
      setTogglingAvailability(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(a => a.date === today)
  const upcoming = appointments.filter(a => a.date >= today && a.status !== 'cancelled')

  const stats = [
    { icon: 'calendar_today', label: "Today's Appointments", value: todayAppointments.length, color: 'text-primary' },
    { icon: 'group', label: 'Total Patients', value: appointments.length, color: 'text-secondary' },
    { icon: 'star', label: 'Rating', value: '4.8', color: 'text-tertiary' },
    { icon: 'check_circle', label: 'Completed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'text-secondary' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow max-w-container-max mx-auto px-gutter py-lg w-full flex flex-col md:flex-row gap-lg">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-sm">
            <div className="p-sm mb-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-xs">
                <span className="material-symbols-outlined text-primary text-[28px]">medical_services</span>
              </div>
              <p className="font-medium text-on-surface">Dr. {doctorData?.name || 'Doctor'}</p>
              <p className="text-label-sm text-on-surface-variant">{user?.email}</p>
              <div className="mt-xs">
                <button
                  onClick={toggleAvailability}
                  disabled={togglingAvailability}
                  className={`px-sm py-[2px] rounded-full text-[11px] font-bold transition-all ${
                    doctorData?.is_available ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {togglingAvailability ? '...' : doctorData?.is_available ? '● Available' : '● Unavailable'}
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-xs">
              {NAV_ITEMS.map(({ icon, label, href }) => (
                <Link key={label} href={href} className="flex items-center gap-sm px-sm py-xs rounded-lg text-body-md text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">
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

        {/* Main */}
        <div className="flex-1 flex flex-col gap-lg">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-md">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Welcome back, Dr. {doctorData?.name?.split(' ')[0] || ''}</h1>
              <p className="text-on-surface-variant">You have {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} today</p>
            </div>
            <button
              onClick={toggleAvailability}
              disabled={togglingAvailability}
              className={`px-md py-xs rounded-xl text-label-sm font-medium transition-all flex items-center gap-xs ${
                doctorData?.is_available
                  ? 'bg-secondary-container text-on-secondary-container hover:brightness-95'
                  : 'bg-error-container text-on-error-container hover:brightness-95'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{doctorData?.is_available ? 'toggle_on' : 'toggle_off'}</span>
              {doctorData?.is_available ? 'Set Unavailable' : 'Set Available'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {stats.map(({ icon, label, value, color }) => (
              <div key={label} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md">
                <span className={`material-symbols-outlined text-[28px] ${color} mb-xs block`}>{icon}</span>
                <p className="font-headline-md text-headline-md text-on-surface">{value}</p>
                <p className="text-label-sm text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Today's Schedule</h2>
            {loading ? (
              <div className="flex items-center justify-center py-lg">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md text-center">
                <span className="material-symbols-outlined text-outline text-[48px]">event_available</span>
                <p className="text-on-surface-variant mt-sm">No appointments today</p>
              </div>
            ) : (
              <div className="flex flex-col gap-sm">
                {todayAppointments.sort((a, b) => a.time_slot.localeCompare(b.time_slot)).map(apt => (
                  <div key={apt.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-md flex items-center gap-md">
                    <div className="text-center w-16 flex-shrink-0">
                      <p className="font-bold text-primary text-body-md">{apt.time_slot}</p>
                      <p className="text-[11px] text-on-surface-variant">{apt.type}</p>
                    </div>
                    <div className="w-[2px] h-12 bg-outline-variant flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-on-surface">{apt.patient_name || 'Patient'}</p>
                      <p className="text-label-sm text-on-surface-variant line-clamp-1">{apt.problem_description || 'General consultation'}</p>
                    </div>
                    <span className={`px-xs py-[2px] rounded-full text-[11px] font-bold flex-shrink-0 ${
                      apt.type === 'Online' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                    }`}>
                      {apt.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          {upcoming.length > 0 && upcoming.some(a => a.date !== today) && (
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Upcoming</h2>
              <div className="flex flex-col gap-sm">
                {upcoming.filter(a => a.date !== today).slice(0, 5).map(apt => (
                  <div key={apt.id} className="bg-surface-container rounded-xl border border-outline-variant p-md flex items-center gap-md">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-on-surface text-body-md">{apt.patient_name || 'Patient'}</p>
                      <p className="text-label-sm text-on-surface-variant">{apt.date} • {apt.time_slot} • {apt.type}</p>
                    </div>
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
