import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BarChart3, UserPlus, Calendar, MapPin, Clock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-mais-amor.jpg";
import logoImage from "@/assets/mais-amor-logo.jpg";

const Index = () => {
  const { user, isAdmin, isBeneficiario } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-love-blue/90 to-love-green/80" />
        
        <div className="relative container mx-auto px-4 py-24 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <img 
                src={logoImage} 
                alt="Mais Amor - Atendimento Comunitário" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Mais Amor
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Ação Social da Igreja Adventista do Sétimo Dia
            </p>
            <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto">
              Prestando serviços gratuitos para a comunidade com amor, dedicação e esperança. 
              Junte-se a nós nesta missão de transformar vidas através do cuidado e da solidariedade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="bg-white text-love-blue hover:bg-white/90 shadow-love">
                    <Link to="/beneficiarios">
                      <Heart className="w-5 h-5 mr-2" />
                      {isBeneficiario ? 'Meu Cadastro' : 'Ver Beneficiários'}
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-love-blue">
                      <Link to="/voluntarios">
                        <Users className="w-5 h-5 mr-2" />
                        Ver Voluntários
                      </Link>
                    </Button>
                  )}
                </>
              ) : (
                <Button asChild size="lg" className="bg-love-coral hover:bg-love-coral/90 text-white shadow-love">
                  <Link to="/cadastro-beneficiario">
                    <Heart className="w-5 h-5 mr-2" />
                    Cadastro Beneficiário
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Informações do Evento */}
      <section className="py-16 bg-love-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Informações do Evento</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça os detalhes da nossa ação social e como você pode participar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-gentle hover:shadow-love transition-all">
              <CardHeader>
                <Calendar className="w-12 h-12 text-love-blue mx-auto mb-4" />
                <CardTitle className="text-love-blue">Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">1° de Novembro</p>
                <p className="text-muted-foreground">Sábado, 2025</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-gentle hover:shadow-love transition-all">
              <CardHeader>
                <Clock className="w-12 h-12 text-love-green mx-auto mb-4" />
                <CardTitle className="text-love-green">Horário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">15h às 18h</p>
                <p className="text-muted-foreground">Atendimento contínuo</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-gentle hover:shadow-love transition-all">
              <CardHeader>
                <MapPin className="w-12 h-12 text-love-gold mx-auto mb-4" />
                <CardTitle className="text-love-gold">Local</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">IAGP</p>
                <p className="text-muted-foreground">Trav. Barão do Triunfo, 3577 - Marco, Belém/PA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Serviços Oferecidos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Serviços Gratuitos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos diversos serviços para atender as necessidades da comunidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { titulo: "Saúde", descricao: "Consultas médicas, aferição de pressão, teste de glicemia", icon: "🏥" },
              { titulo: "Odontologia", descricao: "Consultas odontológicas e orientações de higiene bucal", icon: "🦷" },
              { titulo: "Beleza", descricao: "Corte de cabelo, manicure e pedicure", icon: "💅" },
              { titulo: "Jurídico", descricao: "Orientação jurídica gratuita", icon: "⚖️" },
              { titulo: "Alimentação", descricao: "Doação de alimentos e orientação nutricional", icon: "🍎" },
              { titulo: "Infantil", descricao: "Atividades recreativas para crianças", icon: "🎈" },
            ].map((servico, index) => (
              <Card key={index} className="shadow-gentle hover:shadow-love transition-all">
                <CardHeader>
                  <div className="text-4xl mb-2">{servico.icon}</div>
                  <CardTitle className="text-lg text-primary">{servico.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{servico.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-6">
              Faça Parte Desta Missão de Amor
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Sua participação é importante para o sucesso desta ação social
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="bg-white text-love-blue hover:bg-white/90 shadow-love">
                    <Link to="/beneficiarios">
                      <UserPlus className="w-5 h-5 mr-2" />
                      {isBeneficiario ? 'Meu Cadastro' : 'Ver Beneficiários'}
                    </Link>
                  </Button>
                  {isAdmin && (
                    <>
                      <Button asChild size="lg" className="bg-white text-love-green hover:bg-white/90 shadow-love">
                        <Link to="/voluntarios">
                          <Users className="w-5 h-5 mr-2" />
                          Ver Voluntários
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-love-blue">
                        <Link to="/dashboard">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <Button asChild size="lg" className="bg-love-coral hover:bg-love-coral/90 text-white shadow-love">
                  <Link to="/cadastro-beneficiario">
                    <Heart className="w-5 h-5 mr-2" />
                    Cadastro Beneficiário
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src={logoImage} 
              alt="Mais Amor" 
              className="w-10 h-10 object-contain rounded-lg"
            />
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold">Mais Amor</span>
              <span className="text-xs text-background/70 uppercase tracking-wider">Atendimento Comunitário</span>
            </div>
          </div>
          <p className="text-background/70">
            Igreja Adventista do Sétimo Dia • Ação Social 2025
          </p>
          <p className="text-background/70 mt-2">
            "Assim brilhe também a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai que está nos céus." - Mateus 5:16
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
