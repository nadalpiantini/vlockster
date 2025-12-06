import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: creatorId } = await params
    const supabase = await createClient()

    // Get projects by creator
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title, description, goal_amount, current_amount, backers_count, deadline, status, video_id, thumbnail_url')
      .eq('creator_id', creatorId)
      .eq('status', 'active') // Only show active fundraising projects
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching creator projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Unexpected error in creator projects API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}