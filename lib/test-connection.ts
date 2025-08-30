// Simple test to verify Supabase connection works
import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('content_dashboard')
      .select('content_id, content_title, posting_date')
      .limit(5)
    
    if (error) {
      console.error('Connection failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Connection successful! Sample data:', data)
    return { success: true, data }
    
  } catch (err) {
    console.error('Connection test error:', err)
    return { success: false, error: err }
  }
}