import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { is_available } = await req.json()
    const supabase = createClient()
    const { data, error } = await supabase
      .from('doctors')
      .update({ is_available })
      .eq('id', params.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ doctor: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
