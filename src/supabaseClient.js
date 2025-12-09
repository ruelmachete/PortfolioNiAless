// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udqsiqxgqpgbzqvrxuqt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkcXNpcXhncXBnYnpxdnJ4dXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDg1ODksImV4cCI6MjA4MDc4NDU4OX0.yDAL1dsnFWmiyTtdFijo2lnHYsCpaHjYtXSAqtge1L4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);