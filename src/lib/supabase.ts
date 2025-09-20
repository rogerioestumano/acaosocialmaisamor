import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a fallback client even if env variables are not set
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)

// Check if properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== 'your-supabase-project-url' && 
         supabaseAnonKey !== 'your-supabase-anon-key'
}

// Database types
export interface Voluntario {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  idade: number;
  endereco: string;
  area: string;
  experiencia?: string;
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
  observacoes?: string;
  responsavel?: string;
  confirmou_presenca: boolean;
  created_at?: string;
}