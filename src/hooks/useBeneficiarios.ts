import { useState, useEffect } from 'react'
import { supabase, type Beneficiario } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useBeneficiarios = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch beneficiarios from database
  const fetchBeneficiarios = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('beneficiarios')
        .select('*')
        .order('created_at', { ascending: false })

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
  const addBeneficiario = async (beneficiario: Omit<Beneficiario, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('beneficiarios')
        .insert([beneficiario])
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
    fetchBeneficiarios()
  }, [])

  return {
    beneficiarios,
    loading,
    addBeneficiario,
    togglePresenca,
    refetch: fetchBeneficiarios
  }
}