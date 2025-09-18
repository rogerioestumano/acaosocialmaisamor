import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Verify environment variables are configured
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Voluntario {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  idade: number;
  endereco: string;
  area: string;
  experiencia: string;
  disponibilidade: string;
  created_at?: string;
}

export interface Beneficiario {
  id?: string;
  nome: string;
  email?: string;
  telefone: string;
  idade: number;
  endereco: string;
  necessidades: string[];
  observacoes: string;
  responsavel?: string;
  confirmou_presenca: boolean;
  created_at?: string;
}