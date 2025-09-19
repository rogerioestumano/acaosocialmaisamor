import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface Beneficiario {
  id: string;
  user_id?: string;
  nome: string;
  email?: string;
  telefone: string;
  idade: number;
  endereco: string;
  necessidades: string[];
  observacoes?: string;
  responsavel?: string;
  confirmou_presenca: boolean;
  created_at: string;
  updated_at: string;
}

export const useBeneficiarios = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user, isAdmin, isBeneficiario } = useAuth()

  // Fetch beneficiarios from database
  const fetchBeneficiarios = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('beneficiarios')
        .select('*')

      // If user is beneficiario, only show their own records
      if (isBeneficiario) {
        query = query.eq('user_id', user?.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      setBeneficiarios(data || [])
    } catch (error) {
      console.error('Error fetching beneficiarios:', error)
      toast({
        title: "Erro ao carregar beneficiários",
        description: "Não foi possível carregar a lista de beneficiários.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Add new beneficiario
  const addBeneficiario = async (beneficiario: Omit<Beneficiario, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('beneficiarios')
        .insert([{
          ...beneficiario,
          user_id: user?.id
        }])
        .select()
        .single()

      if (error) throw error

      setBeneficiarios(prev => [data, ...prev])
      toast({
        title: "Beneficiário cadastrado!",
        description: "Registro realizado com sucesso. Aguardamos você na ação social!",
      })

      return data
    } catch (error) {
      console.error('Error adding beneficiario:', error)
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível cadastrar o beneficiário. Tente novamente.",
        variant: "destructive"
      })
      throw error
    }
  }

  // Update presence status
  const togglePresenca = async (id: string) => {
    try {
      const beneficiario = beneficiarios.find(b => b.id === id)
      if (!beneficiario) return

      const { data, error } = await supabase
        .from('beneficiarios')
        .update({ confirmou_presenca: !beneficiario.confirmou_presenca })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setBeneficiarios(prev => 
        prev.map(b => b.id === id ? data : b)
      )
    } catch (error) {
      console.error('Error updating presence:', error)
      toast({
        title: "Erro ao atualizar presença",
        description: "Não foi possível atualizar o status de presença.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchBeneficiarios()
    }
  }, [user, isAdmin, isBeneficiario])

  return {
    beneficiarios,
    loading,
    addBeneficiario,
    togglePresenca,
    refetch: fetchBeneficiarios
  }
}