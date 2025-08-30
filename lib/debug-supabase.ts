// Debug utility to test Supabase connection and data retrieval
import { supabase } from './supabase'

export async function debugSupabaseConnection() {
  console.log('🔍 Debugging Supabase connection...')
  
  // Test 1: Check environment variables
  console.log('Environment variables:')
  console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('- SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  try {
    // Test 2: Test basic connection
    console.log('\n📡 Testing Supabase connection...')
    const { data, error, status, statusText } = await supabase
      .from('content_dashboard')
      .select('*')
      .limit(1)
    
    console.log('Response status:', status)
    console.log('Response statusText:', statusText)
    console.log('Response data:', data)
    console.log('Response error:', error)
    
    if (error) {
      console.error('❌ Supabase query error:', error)
      return { success: false, error }
    }
    
    // Test 3: Count total records
    const { count, error: countError } = await supabase
      .from('content_dashboard')
      .select('*', { count: 'exact', head: true })
    
    console.log('Total records in table:', count)
    if (countError) console.error('Count error:', countError)
    
    // Test 4: Get all records with specific columns
    const { data: allData, error: allError } = await supabase
      .from('content_dashboard')
      .select(`
        content_id,
        content_title,
        posting_date,
        thumbnail_url,
        platforms,
        tags
      `)
      .order('posting_date', { ascending: true })
    
    console.log('\n📊 All records:', allData)
    if (allError) console.error('All records error:', allError)
    
    return { 
      success: true, 
      recordCount: count,
      sampleData: allData 
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return { success: false, error }
  }
}