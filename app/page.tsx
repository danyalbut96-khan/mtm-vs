'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LandingPage() {
  const router = useRouter()
  const [symptoms, setSymptoms] = useState('')
  const [city, setCity] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (symptoms) params.set('q', symptoms)
    if (city) params.set('city', city)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-xl pb-lg overflow-hidden">
          <div className="max-w-container-max mx-auto px-gutter grid lg:grid-cols-2 gap-xl items-center">
            <div className="z-10">
              <span className="inline-flex items-center gap-xs px-sm py-xs bg-primary-fixed text-on-primary-fixed-variant rounded-full text-label-sm mb-md">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                Next-Gen Medical Matchmaking
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-md">
                Find the Right Doctor, <span className="text-primary">Instantly</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-xl">
                SmartDoc AI combines advanced clinical data with patient feedback to connect you with the most qualified specialists in seconds. Secure, reliable, and patient-centered.
              </p>
              <form onSubmit={handleSearch} className="bg-surface-container-lowest p-sm rounded-xl shadow-xl border border-outline-variant grid md:grid-cols-3 gap-sm items-end ai-shimmer">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant px-xs">Symptoms or Specialty</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input
                      type="text"
                      value={symptoms}
                      onChange={e => setSymptoms(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-body-md outline-none"
                      placeholder="e.g. Cardiology, back pain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant px-xs">City</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">location_on</span>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-body-md outline-none"
                      placeholder="Lahore, Karachi..."
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary-container text-on-primary-container h-[48px] rounded-lg font-label-sm hover:brightness-110 transition-all flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
              </form>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZkf9ZzF6a5_PUc4TX2drucKnH6QistE5KRQsMR2TOieEU5dVHB24XlgYIqyfkjVB0VQIUzk4e3W0K5vjHuqoMecNH2AxhoDJ94b8gyHUeaHssFfTVAI1DhcKAMpoop8MLZgOHfhvkHpKJSldB_LGpv5FfU_7nWQYF3haRknvPA87YdRZKFwBxfTE2OPyfIZlokLJm91X_DP07GeZpCacPhotAcEgDeGK9n0_bomUyD0Sgxe_DqCuYDwavONOi0zVvZ66bWhMYvSI"
                alt="Doctor"
                className="rounded-xl shadow-2xl relative z-10 w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-md -left-md bg-white p-sm rounded-xl shadow-xl z-20 border border-outline-variant flex items-center gap-sm">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">verified_user</span>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface font-bold">Top Match Found</p>
                  <p className="text-[12px] text-on-surface-variant">Dr. Sarah Chen, Cardiology</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-xl bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Why Choose SmartDoc AI?</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Leveraging clinical-grade artificial intelligence to simplify your healthcare journey.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-md">
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5 transition-all border border-outline-variant/30 flex flex-col items-start gap-sm">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[28px]">psychology</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">AI-Powered Matching</h3>
                <p className="text-on-surface-variant">Our algorithms analyze clinical data points to find doctors who specialize in your exact symptoms.</p>
                <div className="mt-auto pt-sm flex flex-wrap gap-xs">
                  <span className="px-xs py-[2px] bg-primary-fixed text-on-primary-fixed-variant text-[12px] font-bold rounded-full">Precision Matching</span>
                  <span className="px-xs py-[2px] bg-secondary-container text-on-secondary-container text-[12px] font-bold rounded-full">Clinical Data</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-md rounded-xl shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5 transition-all border border-outline-variant/30 flex flex-col items-start gap-sm">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[28px]">event_available</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Instant Appointments</h3>
                <p className="text-on-surface-variant">Skip the phone calls. View real-time availability and book your consultation instantly.</p>
                <div className="mt-auto pt-sm">
                  <span className="inline-flex items-center gap-xs text-secondary font-bold text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    4,200+ Slots Available Today
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-md rounded-xl shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5 transition-all border border-outline-variant/30 border-l-4 border-l-primary flex flex-col items-start gap-sm">
                <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-[28px]">chat_bubble</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">24/7 AI Chat</h3>
                <p className="text-on-surface-variant">Get immediate answers to health queries from our secure medical AI assistant anytime.</p>
                <button
                  onClick={() => router.push('/chat')}
                  className="mt-auto text-primary font-bold text-label-sm flex items-center gap-xs hover:underline"
                >
                  Try AI Assistant
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-xl">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Your Path to Better Health</h2>
              <p className="text-on-surface-variant mt-sm">Three simple steps to connect with the medical care you deserve.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-xl relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-[2px] bg-outline-variant -z-10"></div>
              {[
                { icon: 'search', step: '1. Search', desc: 'Describe your symptoms or select a specialty.' },
                { icon: 'quick_reference_all', step: '2. Match', desc: 'Our AI curates a shortlist of top-rated doctors.' },
                { icon: 'calendar_month', step: '3. Book', desc: 'Choose a time and book your appointment instantly.' },
              ].map(({ icon, step, desc }) => (
                <div key={step} className="flex flex-col items-center text-center max-w-xs group">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center border-4 border-background shadow-lg mb-md group-hover:bg-primary transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary text-[36px] group-hover:text-white transition-colors">{icon}</span>
                  </div>
                  <h4 className="font-headline-md text-on-surface mb-xs">{step}</h4>
                  <p className="text-body-md text-on-surface-variant">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-xl flex justify-center">
              <button
                onClick={() => router.push('/search')}
                className="bg-primary-container text-on-primary-container px-xl py-md rounded-xl font-headline-md shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Start Your Search Now
              </button>
            </div>
          </div>
        </section>

        {/* Doctor CTA */}
        <section className="py-xl bg-primary-container relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-gutter relative z-10 flex flex-col md:flex-row items-center justify-between gap-lg">
            <div className="text-on-primary-container md:max-w-xl">
              <h2 className="font-display-lg text-display-lg mb-sm">Are You a Doctor?</h2>
              <p className="text-body-lg opacity-90 mb-lg">Join the network of medical professionals using SmartDoc AI to streamline their practice.</p>
              <div className="flex flex-wrap gap-md">
                <button
                  onClick={() => router.push('/doctors/register')}
                  className="bg-surface-container-lowest text-primary-container px-lg py-sm rounded-lg font-bold hover:bg-surface-container transition-all"
                >
                  Register Your Practice
                </button>
                <button className="border border-on-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold hover:bg-white/10 transition-all">
                  Learn More
                </button>
              </div>
            </div>
            <div className="w-full md:w-[300px] bg-white p-sm rounded-xl shadow-2xl">
              <div className="aspect-square bg-surface-container rounded-lg overflow-hidden relative flex items-center justify-center flex-col gap-sm">
                <span className="material-symbols-outlined text-primary text-[48px]">map</span>
                <span className="font-label-sm text-on-surface-variant">Doctors Nationwide</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
