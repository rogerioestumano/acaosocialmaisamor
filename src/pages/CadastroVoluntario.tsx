import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Heart, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CadastroVoluntario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const voluntarioData = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string,
        telefone: formData.get('telefone') as string,
        idade: parseInt(formData.get('idade') as string),
        endereco: formData.get('endereco') as string,
        area: formData.get('area') as string,
        experiencia: formData.get('experiencia') as string || undefined,
        disponibilidade: formData.get('disponibilidade') as string,
      };

      const { error } = await supabase
        .from('voluntarios')
        .insert([voluntarioData]);

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Obrigado por se voluntariar. Entraremos em contato em breve.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Erro ao cadastrar voluntário');
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
              <Users className="w-6 h-6 text-love-coral" />
              Cadastro de Voluntário
            </CardTitle>
            <CardDescription className="text-center">
              Junte-se à nossa missão de espalhar amor e solidariedade
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
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input id="telefone" name="telefone" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade *</Label>
                  <Input id="idade" name="idade" type="number" min="16" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input id="endereco" name="endereco" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área de Interesse *</Label>
                <Input 
                  id="area" 
                  name="area" 
                  placeholder="Ex: Educação, Saúde, Assistência Social..." 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disponibilidade">Disponibilidade *</Label>
                <Input 
                  id="disponibilidade" 
                  name="disponibilidade" 
                  placeholder="Ex: Fins de semana, Manhãs, Tardes..." 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experiencia">Experiência Anterior</Label>
                <Textarea 
                  id="experiencia" 
                  name="experiencia"
                  placeholder="Conte sobre suas experiências anteriores como voluntário (opcional)"
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-love-coral hover:bg-love-coral/90"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar como Voluntário'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroVoluntario;