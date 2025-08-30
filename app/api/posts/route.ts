// API route to fetch posts using service role (bypasses RLS)
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { transformDbPostToPost } from '@/lib/data-mapper'

export async function GET() {
  try {
    console.log('🚀 API: Fetching posts with service role...')
    
    const { data, error } = await supabaseAdmin
      .from('content_dashboard')
      .select(`
        content_id,
        content_title,
        posting_date,
        content_description,
        social_media_text,
        thumbnail_url,
        tags,
        platforms,
        created_at,
        updated_at
      `)
      .order('posting_date', { ascending: true })
    
    if (error) {
      console.error('❌ API: Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!data) {
      console.log('⚠️ API: No data returned')
      return NextResponse.json([])
    }
    
    console.log('✅ API: Raw data from Supabase:', data.length, 'posts')
    
    // Transform data
    const posts = data.map(transformDbPostToPost)
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('❌ API: Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const { error } = await supabaseAdmin
      .from('content_dashboard')
      .delete()
      .eq('content_id', id)
    
    if (error) {
      console.error('❌ API: Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ API: Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json()
    const { id, ...data } = updates
    
    console.log('🔄 API: Update request - ID:', id)
    console.log('🔄 API: Update data:', data)
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const { data: updatedData, error } = await supabaseAdmin
      .from('content_dashboard')
      .update(data)
      .eq('content_id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ API: Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    const transformedPost = transformDbPostToPost(updatedData)
    return NextResponse.json(transformedPost)
  } catch (error) {
    console.error('❌ API: Update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}