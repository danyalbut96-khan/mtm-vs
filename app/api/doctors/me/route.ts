import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = createClient()
  const { data, error } = await supabase.from('doctors').select('*').eq('email', email).single()
  if (error) return NextResponse.json({ doctor: null })
  return NextResponse.json({ doctor: data })
}
