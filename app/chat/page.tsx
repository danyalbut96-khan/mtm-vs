'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Message {
  id: string
  sender_type: 'patient' | 'doctor' | 'ai'
  content: string
  created_at: string
}

interface Doctor {
  id: string
  name: string
  specialization: string
  is_available: boolean
}

function ChatContent() {
  const searchParams = useSearchParams()
  const doctorId = searchParams.get('doctorId')
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [patientInfo, setPatientInfo] = useState({ name: '', phone: '' })
  const [infoCollected, setInfoCollected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (doctorId) {
      fetch(`/api/doctors/${doctorId}`)
        .then(r => r.json())
        .then(d => {
          if (d.doctor) {
            setDoctor(d.doctor)
            setMessages([{
              id: 'welcome',
              sender_type: 'ai',
              content: d.doctor.is_available
                ? `Hello! I'm the AI assistant for Dr. ${d.doctor.name}. The doctor is currently available. How can I help you today?`
                : `Hello! Dr. ${d.doctor.name} is currently unavailable. I'm the AI assistant and I'm here to help. I'll collect your information and notify the doctor. Please share your name and contact number to get started.`,
              created_at: new Date().toISOString(),
            }])
          }
        })
    } else {
      setMessages([{
        id: 'welcome',
        sender_type: 'ai',
        content: "Hello! I'm SmartDoc AI, your health assistant. Tell me your symptoms and I'll help find the right doctor for you.",
        created_at: new Date().toISOString(),
      }])
    }
  }, [doctorId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      sender_type: 'patient',
      content: input,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    const msgContent = input
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctorId,
          message: msgContent,
          patient_name: patientInfo.name,
          patient_phone: patientInfo.phone,
          is_doctor_available: doctor?.is_available ?? false,
          conversation_history: messages.map(m => ({ role: m.sender_type === 'patient' ? 'user' : 'assistant', content: m.content })),
        }),
      })
      const data = await res.json()

      if (data.collect_info && !infoCollected) {
        const nameMatch = msgContent.match(/(?:my name is|i'm|i am)\s+([A-Za-z\s]+)/i)
        const phoneMatch = msgContent.match(/(\+?[\d\s-]{10,})/g)
        if (nameMatch) setPatientInfo(p => ({ ...p, name: nameMatch[1].trim() }))
        if (phoneMatch) { setPatientInfo(p => ({ ...p, phone: phoneMatch[0] })); setInfoCollected(true) }
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_ai',
        sender_type: 'ai',
        content: data.reply,
        created_at: new Date().toISOString(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_err',
        sender_type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const senderStyle = (type: string) => ({
    patient: 'bg-primary-container text-on-primary-container ml-auto',
    ai: 'bg-surface-container-lowest border border-outline-variant text-on-surface mr-auto',
    doctor: 'bg-secondary-container text-on-secondary-container mr-auto',
  }[type] || 'bg-surface-container text-on-surface')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-container-max mx-auto w-full flex overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>
        {/* Conversations Sidebar */}
        <div className="hidden md:flex w-80 flex-col border-r border-outline-variant bg-surface-container-lowest">
          <div className="p-md border-b border-outline-variant">
            <h2 className="font-headline-md text-headline-md text-on-surface">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-sm flex flex-col gap-xs">
            <div className={`p-sm rounded-xl cursor-pointer flex items-center gap-sm ${doctorId ? 'hover:bg-surface-container' : 'bg-surface-container border border-primary/20'}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-on-surface text-body-md">SmartDoc AI</p>
                <p className="text-label-sm text-on-surface-variant truncate">General health assistant</p>
              </div>
            </div>
            {doctor && (
              <div className="p-sm rounded-xl bg-surface-container border border-primary/20 flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface text-body-md">Dr. {doctor.name}</p>
                  <p className="text-label-sm text-primary truncate">{doctor.specialization}</p>
                </div>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${doctor.is_available ? 'bg-secondary' : 'bg-outline'}`}></span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Main */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-md border-b border-outline-variant bg-surface-container-lowest flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">{doctor ? 'person' : 'smart_toy'}</span>
            </div>
            <div>
              <p className="font-medium text-on-surface">{doctor ? `Dr. ${doctor.name}` : 'SmartDoc AI'}</p>
              <div className="flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-label-sm text-on-surface-variant">
                  {doctor ? (doctor.is_available ? 'Doctor Available' : 'AI Assistant Active') : 'AI Health Assistant'}
                </span>
              </div>
            </div>
            {doctor && !doctor.is_available && (
              <span className="ml-auto px-xs py-[2px] bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold rounded-full flex items-center gap-xs">
                <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                AI Responding
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-md flex flex-col gap-sm">
            {messages.map(msg => (
              <div key={msg.id} className={`max-w-[75%] rounded-xl px-md py-sm text-body-md ${senderStyle(msg.sender_type)}`}>
                {msg.sender_type !== 'patient' && (
                  <p className="text-[11px] font-bold mb-[2px] opacity-70">
                    {msg.sender_type === 'ai' ? '🤖 AI Assistant' : `Dr. ${doctor?.name}`}
                  </p>
                )}
                <p className="leading-relaxed">{msg.content}</p>
                <p className="text-[11px] opacity-50 mt-[2px]">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {loading && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl px-md py-sm max-w-[75%] mr-auto">
                <p className="text-[11px] font-bold mb-[2px] opacity-70">🤖 AI Assistant</p>
                <div className="flex gap-xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-md border-t border-outline-variant bg-surface-container-lowest">
            <div className="flex gap-sm items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Type your message... (Enter to send)"
                rows={1}
                className="flex-1 py-sm px-md bg-surface-container rounded-xl border border-outline-variant text-body-md outline-none resize-none focus:ring-2 focus:ring-primary/20"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center flex-shrink-0"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span></div>}>
      <ChatContent />
    </Suspense>
  )
}
