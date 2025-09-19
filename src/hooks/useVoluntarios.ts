import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface Voluntario {
  id: string;
  user_id?: string;
  nome: string;
  email: string;
  telefone: string;
  idade: number;
  endereco: string;
  area: string;
  experiencia?: string;
  disponibilidade: string;
  created_at: string;
  updated_at: string;
}

export const useVoluntarios = () => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch voluntarios from database
  const fetchVoluntarios = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('voluntarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setVoluntarios(data || [])
    } catch (error) {
      console.error('Error fetching voluntarios:', error)
      toast({
        title: "Erro ao carregar voluntários",
        description: "Não foi possível carregar a lista de voluntários.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Add new voluntario
  const addVoluntario = async (voluntario: Omit<Voluntario, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('voluntarios')
        .insert([{
          ...voluntario,
          user_id: user?.id
        }])
        .select()
        .single()

      if (error) throw error

      setVoluntarios(prev => [data, ...prev])
      toast({
        title: "Voluntário cadastrado!",
        description: "Obrigado por se voluntariar para a ação Mais Amor.",
      })

      return data
    } catch (error) {
      console.error('Error adding voluntario:', error)
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível cadastrar o voluntário. Tente novamente.",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      fetchVoluntarios()
    }
  }, [user])

  return {
    voluntarios,
    loading,
    addVoluntario,
    refetch: fetchVoluntarios
  }
}