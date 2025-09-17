import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoluntarios } from "@/hooks/useVoluntarios";
import { UserPlus, Users, Phone, Mail, MapPin, FileSpreadsheet, FileText, Download } from "lucide-react";
import { exportVoluntariosToExcel, exportVoluntariosToPDF } from "@/lib/export";
import Navigation from "@/components/Navigation";

const Voluntarios = () => {
  const { voluntarios, loading, addVoluntario } = useVoluntarios();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await addVoluntario({
        nome: formData.get("nome") as string,
        email: formData.get("email") as string,
        telefone: formData.get("telefone") as string,
        idade: parseInt(formData.get("idade") as string),
        endereco: formData.get("endereco") as string,
        area: formData.get("area") as string,
        experiencia: formData.get("experiencia") as string,
        disponibilidade: formData.get("disponibilidade") as string,
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
              <Users className="w-8 h-8 text-primary" />
              Voluntários
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os voluntários da ação social Mais Amor
            </p>
          </div>
          
          <div className="flex gap-2">
            {voluntarios.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => exportVoluntariosToExcel(voluntarios)}
                  className="shadow-gentle"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportVoluntariosToPDF(voluntarios)}
                  className="shadow-gentle"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 shadow-gentle"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {showForm ? "Cancelar" : "Novo Voluntário"}
            </Button>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        {showForm && (
          <Card className="mb-8 shadow-gentle">
            <CardHeader>
              <CardTitle className="text-primary">Cadastro de Voluntário</CardTitle>
              <CardDescription>
                Preencha os dados para se cadastrar como voluntário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      name="idade"
                      type="number"
                      placeholder="Sua idade"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    placeholder="Seu endereço completo"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Área de Atuação</Label>
                    <Select name="area" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="juridico">Jurídico</SelectItem>
                        <SelectItem value="beleza">Beleza</SelectItem>
                        <SelectItem value="organizacao">Organização</SelectItem>
                        <SelectItem value="musica">Música</SelectItem>
                        <SelectItem value="infantil">Atividades Infantis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="disponibilidade">Disponibilidade</Label>
                    <Select name="disponibilidade" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua disponibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manha">Manhã</SelectItem>
                        <SelectItem value="tarde">Tarde</SelectItem>
                        <SelectItem value="dia-todo">Dia Todo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experiencia">Experiência/Qualificações</Label>
                  <Textarea
                    id="experiencia"
                    name="experiencia"
                    placeholder="Descreva sua experiência ou qualificações na área escolhida"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-love">
                  Cadastrar Voluntário
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Voluntários */}
        <div className="grid gap-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Voluntários Cadastrados ({voluntarios.length})
          </h2>
          
          {loading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando voluntários...</p>
            </Card>
          ) : voluntarios.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum voluntário cadastrado ainda. Que tal cadastrar o primeiro?
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voluntarios.map((voluntario) => (
                <Card key={voluntario.id} className="shadow-gentle hover:shadow-love transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">{voluntario.nome}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <span className="font-medium">{voluntario.area}</span> • {voluntario.disponibilidade}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {voluntario.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {voluntario.telefone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      Idade: {voluntario.idade} anos
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Cadastrado em: {new Date(voluntario.created_at || '').toLocaleDateString("pt-BR")}
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

export default Voluntarios;