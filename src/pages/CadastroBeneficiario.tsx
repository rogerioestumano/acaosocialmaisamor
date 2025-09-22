import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Heart, User, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBeneficiarios } from '@/hooks/useBeneficiarios';

interface Voluntario {
  id: string;
  nome: string;
  area: string;
}

const CadastroBeneficiario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [necessidades, setNecessidades] = useState<string[]>([]);
  const navigate = useNavigate();
  const { addBeneficiario } = useBeneficiarios();

  const necessidadesOptions = [
    'Alimentação',
    'Vestuário', 
    'Medicamentos',
    'Assistência médica',
    'Apoio educacional',
    'Apoio psicológico',
    'Auxílio moradia',
    'Transporte',
    'Documentação',
    'Capacitação profissional'
  ];

  useEffect(() => {
    fetchVoluntarios();
  }, []);

  const fetchVoluntarios = async () => {
    try {
      const { data, error } = await supabase
        .from('voluntarios')
        .select('id, nome, area')
        .order('nome');

      if (error) throw error;
      setVoluntarios(data || []);
    } catch (error) {
      console.error('Error fetching voluntarios:', error);
    }
  };

  const handleNecessidadeChange = (necessidade: string, checked: boolean) => {
    if (checked) {
      setNecessidades(prev => [...prev, necessidade]);
    } else {
      setNecessidades(prev => prev.filter(n => n !== necessidade));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const beneficiarioData = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string || undefined,
        telefone: formData.get('telefone') as string,
        idade: parseInt(formData.get('idade') as string),
        endereco: formData.get('endereco') as string,
        necessidades,
        observacoes: formData.get('observacoes') as string || undefined,
        responsavel: formData.get('responsavel') as string || undefined,
        confirmou_presenca: false,
      };

      await addBeneficiario(beneficiarioData);
      navigate('/');
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Erro ao cadastrar beneficiário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-blue to-love-purple flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-love-coral" />
            <span className="text-2xl font-bold text-white">Mais Amor</span>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <User className="w-6 h-6 text-love-coral" />
              Cadastro de Beneficiário
            </CardTitle>
            <CardDescription className="text-center">
              Cadastre-se para receber apoio da nossa comunidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input id="nome" name="nome" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input id="telefone" name="telefone" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade *</Label>
                  <Input id="idade" name="idade" type="number" min="0" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input id="endereco" name="endereco" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável (se menor de idade)</Label>
                <Input id="responsavel" name="responsavel" />
              </div>

              <div className="space-y-3">
                <Label>Necessidades *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {necessidadesOptions.map((necessidade) => (
                    <div key={necessidade} className="flex items-center space-x-2">
                      <Checkbox
                        id={necessidade}
                        checked={necessidades.includes(necessidade)}
                        onCheckedChange={(checked) => 
                          handleNecessidadeChange(necessidade, checked as boolean)
                        }
                      />
                      <Label htmlFor={necessidade} className="text-sm">
                        {necessidade}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {voluntarios.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="voluntario">Escolher Voluntário (Opcional)</Label>
                  <Select name="voluntario">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um voluntário" />
                    </SelectTrigger>
                    <SelectContent>
                      {voluntarios.map((voluntario) => (
                        <SelectItem key={voluntario.id} value={voluntario.id}>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{voluntario.nome} - {voluntario.area}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea 
                  id="observacoes" 
                  name="observacoes"
                  placeholder="Conte mais sobre sua situação e necessidades específicas"
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-red hover:opacity-90 text-white shadow-love transition-all"
                disabled={loading || necessidades.length === 0}
              >
                {loading ? 'Salvando...' : 'Salvar o cadastro'}
              </Button>

              {necessidades.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Selecione pelo menos uma necessidade para continuar
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroBeneficiario;