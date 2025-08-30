import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Admin client with service role - bypasses RLS
// Will return empty data if environment variables are not set
export const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : null as any

// Test function to check if RLS is blocking access
export async function testWithServiceRole() {
  try {
    console.log('🔧 Testing with service role (bypasses RLS)...')
    
    const { data, error, count } = await supabaseAdmin
      .from('content_dashboard')
      .select('*', { count: 'exact' })
      .limit(5)
    
    console.log('Service role query result:', { data, error, count })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { 
      success: true, 
      data, 
      count,
      message: (count && count > 0) ? 'RLS is likely blocking anonymous access' : 'No data in table'
    }
  } catch (err) {
    console.error('Service role test error:', err)
    return { success: false, error: err }
  }
}