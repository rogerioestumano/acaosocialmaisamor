import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useBeneficiarios } from "@/hooks/useBeneficiarios";
import { UserPlus, Users, Phone, Mail, MapPin, Heart, FileSpreadsheet, FileText } from "lucide-react";
import { exportBeneficiariosToExcel, exportBeneficiariosToPDF } from "@/lib/export";
import Navigation from "@/components/Navigation";

const Beneficiarios = () => {
  const { beneficiarios, loading, addBeneficiario, togglePresenca } = useBeneficiarios();
  const [showForm, setShowForm] = useState(false);

  const areasAtendimento = [
    "Consulta Médica",
    "Consulta Odontológica",
    "Aferição de Pressão",
    "Teste de Glicemia",
    "Corte de Cabelo",
    "Manicure/Pedicure",
    "Orientação Jurídica",
    "Atividades Infantis",
    "Orientação Nutricional",
    "Doação de Roupas",
    "Doação de Alimentos"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const necessidadesSelecionadas = areasAtendimento.filter(area => 
      formData.get(area.toLowerCase().replace(/\s+/g, '-')) === 'on'
    );

    try {
      await addBeneficiario({
        nome: formData.get("nome") as string,
        email: formData.get("email") as string || undefined,
        telefone: formData.get("telefone") as string,
        idade: parseInt(formData.get("idade") as string),
        endereco: formData.get("endereco") as string,
        necessidades: necessidadesSelecionadas,
        observacoes: formData.get("observacoes") as string,
        responsavel: formData.get("responsavel") as string || undefined,
        confirmou_presenca: false,
      });

      setShowForm(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="w-8 h-8 text-love-green" />
              Beneficiários
            </h1>
            <p className="text-muted-foreground mt-2">
              Cadastro da população atendida na ação social
            </p>
          </div>
          
          <div className="flex gap-2">
            {beneficiarios.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => exportBeneficiariosToExcel(beneficiarios)}
                  className="shadow-gentle"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportBeneficiariosToPDF(beneficiarios)}
                  className="shadow-gentle"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-love-green hover:bg-love-green/90 text-white shadow-gentle"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {showForm ? "Cancelar" : "Nova Inscrição"}
            </Button>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        {showForm && (
          <Card className="mb-8 shadow-gentle">
            <CardHeader>
              <CardTitle className="text-love-green">Cadastro de Beneficiário</CardTitle>
              <CardDescription>
                Cadastre-se para participar da ação social Mais Amor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail (opcional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade *</Label>
                    <Input
                      id="idade"
                      name="idade"
                      type="number"
                      placeholder="Idade"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    placeholder="Endereço completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável (se menor de idade)</Label>
                  <Input
                    id="responsavel"
                    name="responsavel"
                    placeholder="Nome do responsável"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Serviços de Interesse *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {areasAtendimento.map((area) => {
                      const id = area.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <div key={area} className="flex items-center space-x-2">
                          <Checkbox 
                            id={id} 
                            name={id}
                            className="border-love-green data-[state=checked]:bg-love-green"
                          />
                          <Label htmlFor={id} className="text-sm font-normal">
                            {area}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    placeholder="Informações adicionais, necessidades especiais, medicamentos em uso, etc."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-love">
                  Realizar Inscrição
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Beneficiários */}
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Inscrições Realizadas ({beneficiarios.length})
            </h2>
            <div className="text-sm text-muted-foreground">
              Presentes: {beneficiarios.filter(b => b.confirmou_presenca).length}
            </div>
          </div>
          
          {loading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-love-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando beneficiários...</p>
            </Card>
          ) : beneficiarios.length === 0 ? (
            <Card className="p-8 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma inscrição realizada ainda. Seja o primeiro a se cadastrar!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beneficiarios.map((beneficiario) => (
                <Card key={beneficiario.id} className="shadow-gentle hover:shadow-love transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-love-green">{beneficiario.nome}</CardTitle>
                        <CardDescription>
                          {beneficiario.idade} anos
                          {beneficiario.responsavel && ` • Resp: ${beneficiario.responsavel}`}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePresenca(beneficiario.id!)}
                        className={`${
                          beneficiario.confirmou_presenca 
                            ? 'text-love-green hover:text-love-green/80' 
                            : 'text-muted-foreground hover:text-love-green'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${beneficiario.confirmou_presenca ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {beneficiario.telefone}
                      </div>
                      {beneficiario.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {beneficiario.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {beneficiario.endereco}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Serviços de interesse:</div>
                      <div className="flex flex-wrap gap-1">
                        {beneficiario.necessidades.map((necessidade) => (
                          <span 
                            key={necessidade} 
                            className="text-xs bg-love-light text-love-green px-2 py-1 rounded-full"
                          >
                            {necessidade}
                          </span>
                        ))}
                      </div>
                    </div>

                    {beneficiario.observacoes && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {beneficiario.observacoes}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                      <span>Cadastrado em: {new Date(beneficiario.created_at || '').toLocaleDateString('pt-BR')}</span>
                      <span className={`font-medium ${
                        beneficiario.confirmou_presenca ? 'text-love-green' : 'text-muted-foreground'
                      }`}>
                        {beneficiario.confirmou_presenca ? 'Presente' : 'Aguardando'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Beneficiarios;