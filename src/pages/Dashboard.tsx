import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, Heart, UserCheck, Calendar, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useVoluntarios } from "@/hooks/useVoluntarios";
import { useBeneficiarios } from "@/hooks/useBeneficiarios";

const Dashboard = () => {
  const { voluntarios, loading: loadingVoluntarios } = useVoluntarios();
  const { beneficiarios, loading: loadingBeneficiarios } = useBeneficiarios();

  const loading = loadingVoluntarios || loadingBeneficiarios;

  // Calcular estatísticas reais dos dados
  const totalVoluntarios = voluntarios.length;
  const totalBeneficiarios = beneficiarios.length;
  const confirmados = beneficiarios.filter(b => b.confirmou_presenca).length;
  const taxaConfirmacao = totalBeneficiarios > 0 ? Math.round((confirmados / totalBeneficiarios) * 100) : 0;

  // Agrupar beneficiários por necessidades
  const necessidadesCounts = beneficiarios.reduce((acc, beneficiario) => {
    beneficiario.necessidades.forEach(necessidade => {
      if (!acc[necessidade]) {
        acc[necessidade] = { total: 0, confirmados: 0 };
      }
      acc[necessidade].total++;
      if (beneficiario.confirmou_presenca) {
        acc[necessidade].confirmados++;
      }
    });
    return acc;
  }, {} as Record<string, { total: number; confirmados: number }>);

  const areasAtendimento = Object.entries(necessidadesCounts).map(([nome, data]) => ({
    nome,
    total: data.total,
    confirmados: data.confirmados
  }));

  // Últimos cadastros (combinar voluntários e beneficiários)
  const ultimosCadastros = [
    ...voluntarios.slice(0, 2).map(v => ({
      nome: v.nome,
      tipo: "Voluntário" as const,
      data: new Date(v.created_at || '').toLocaleDateString("pt-BR")
    })),
    ...beneficiarios.slice(0, 2).map(b => ({
      nome: b.nome,
      tipo: "Beneficiário" as const,
      data: new Date(b.created_at || '').toLocaleDateString("pt-BR")
    }))
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-love-gold" />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe os dados da ação social Mais Amor
          </p>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-gentle hover:shadow-love transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voluntários</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalVoluntarios}</div>
              <p className="text-xs text-muted-foreground">
                Pessoas dispostas a ajudar
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-gentle hover:shadow-love transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beneficiários</CardTitle>
              <Heart className="h-4 w-4 text-love-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-love-green">{totalBeneficiarios}</div>
              <p className="text-xs text-muted-foreground">
                Inscrições realizadas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-gentle hover:shadow-love transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <UserCheck className="h-4 w-4 text-love-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-love-gold">{confirmados}</div>
              <p className="text-xs text-muted-foreground">
                Presença confirmada
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-gentle hover:shadow-love transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Confirmação</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{taxaConfirmacao}%</div>
              <p className="text-xs text-muted-foreground">
                Pessoas que confirmaram
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Atendimentos por Área */}
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="text-love-green">Atendimentos por Área</CardTitle>
              <CardDescription>
                Distribuição dos serviços solicitados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {areasAtendimento.length > 0 ? areasAtendimento.map((area) => {
                const porcentagem = area.total > 0 ? Math.round((area.confirmados / area.total) * 100) : 0;
                return (
                  <div key={area.nome} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{area.nome}</span>
                      <span className="text-sm text-muted-foreground">
                        {area.confirmados}/{area.total} ({porcentagem}%)
                      </span>
                    </div>
                    <Progress 
                      value={porcentagem} 
                      className="h-2"
                    />
                  </div>
                );
              }) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum atendimento cadastrado ainda
                </p>
              )}
            </CardContent>
          </Card>

          {/* Últimos Cadastros */}
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="text-primary">Últimos Cadastros</CardTitle>
              <CardDescription>
                Registros mais recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ultimosCadastros.length > 0 ? ultimosCadastros.map((cadastro, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      cadastro.tipo === 'Voluntário' ? 'bg-primary' : 'bg-love-green'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {cadastro.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cadastro.tipo}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cadastro.data}
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum cadastro realizado ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo da Ação */}
        <Card className="shadow-gentle">
          <CardHeader>
            <CardTitle className="text-love-gold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Resumo da Ação Social
            </CardTitle>
            <CardDescription>
              Informações gerais sobre o evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-love-light rounded-lg">
                <div className="text-3xl font-bold text-love-blue mb-2">
                  {totalVoluntarios + totalBeneficiarios}
                </div>
                <div className="text-sm text-love-blue">
                  Total de Pessoas Envolvidas
                </div>
              </div>
              
              <div className="text-center p-6 bg-secondary rounded-lg">
                <div className="text-3xl font-bold text-secondary-foreground mb-2">
                  {areasAtendimento.length}
                </div>
                <div className="text-sm text-secondary-foreground">
                  Áreas de Atendimento
                </div>
              </div>
              
              <div className="text-center p-6 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-accent-foreground mb-2">
                  {areasAtendimento.length > 0 ? Math.round(confirmados / areasAtendimento.length) : 0}
                </div>
                <div className="text-sm text-accent-foreground">
                  Média por Área
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">🎯 Meta de Atendimento</h4>
              <p className="text-sm text-muted-foreground">
                Com {totalVoluntarios} voluntários cadastrados e {confirmados} pessoas confirmadas, 
                estamos preparados para realizar uma ação social de grande impacto na comunidade. 
                A taxa de confirmação de {taxaConfirmacao}% demonstra o interesse e necessidade da população pelos serviços oferecidos.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;