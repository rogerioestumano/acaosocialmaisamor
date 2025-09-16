import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, Heart, UserCheck, Calendar, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  // Dados simulados - em uma aplicação real, estes viriam do banco de dados
  const stats = {
    totalVoluntarios: 24,
    totalBeneficiarios: 156,
    confirmados: 134,
    areasAtendimento: [
      { nome: "Consulta Médica", total: 45, confirmados: 38 },
      { nome: "Consulta Odontológica", total: 32, confirmados: 28 },
      { nome: "Corte de Cabelo", total: 67, confirmados: 59 },
      { nome: "Orientação Jurídica", total: 18, confirmados: 15 },
      { nome: "Atividades Infantis", total: 23, confirmados: 21 },
      { nome: "Doação de Alimentos", total: 89, confirmados: 76 },
    ],
    ultimosCadastros: [
      { nome: "Maria Silva", tipo: "Beneficiário", data: "16/09/2025" },
      { nome: "João Santos", tipo: "Voluntário", data: "16/09/2025" },
      { nome: "Ana Costa", tipo: "Beneficiário", data: "15/09/2025" },
      { nome: "Pedro Lima", tipo: "Voluntário", data: "15/09/2025" },
    ]
  };

  const taxaConfirmacao = Math.round((stats.confirmados / stats.totalBeneficiarios) * 100);

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
              <div className="text-2xl font-bold text-primary">{stats.totalVoluntarios}</div>
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
              <div className="text-2xl font-bold text-love-green">{stats.totalBeneficiarios}</div>
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
              <div className="text-2xl font-bold text-love-gold">{stats.confirmados}</div>
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
              {stats.areasAtendimento.map((area) => {
                const porcentagem = Math.round((area.confirmados / area.total) * 100);
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
              })}
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
                {stats.ultimosCadastros.map((cadastro, index) => (
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
                ))}
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
                  {stats.totalVoluntarios + stats.totalBeneficiarios}
                </div>
                <div className="text-sm text-love-blue">
                  Total de Pessoas Envolvidas
                </div>
              </div>
              
              <div className="text-center p-6 bg-secondary rounded-lg">
                <div className="text-3xl font-bold text-secondary-foreground mb-2">
                  {stats.areasAtendimento.length}
                </div>
                <div className="text-sm text-secondary-foreground">
                  Áreas de Atendimento
                </div>
              </div>
              
              <div className="text-center p-6 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-accent-foreground mb-2">
                  {Math.round(stats.confirmados / stats.areasAtendimento.length)}
                </div>
                <div className="text-sm text-accent-foreground">
                  Média por Área
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">🎯 Meta de Atendimento</h4>
              <p className="text-sm text-muted-foreground">
                Com {stats.totalVoluntarios} voluntários cadastrados e {stats.confirmados} pessoas confirmadas, 
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