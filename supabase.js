import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'https://dmfqjjdzncjfcgswywgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZnFqamR6bmNqZmNnc3d5d2djIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODUxOCwiZXhwIjoyMDYzMDc0NTE4fQ.uzly75HCU7Va-7F3EtMK1-XAD71KB5YrH4vCHcS7Rxc'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase