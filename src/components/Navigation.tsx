import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Users, BarChart3, UserPlus, LogOut, LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logoImage from "@/assets/mais-amor-logo.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin, isBeneficiario } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  // Define navigation items based on user type
  const getNavigationItems = () => {
    const baseItems = [
      { name: "Início", href: "/", icon: Heart }
    ];

    if (!user) {
      return baseItems;
    }

    if (isAdmin) {
      return [
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Voluntários", href: "/voluntarios", icon: Users },
        { name: "Beneficiários", href: "/beneficiarios", icon: UserPlus },
      ];
    }

    if (isBeneficiario) {
      return [
        ...baseItems,
        { name: "Meu Cadastro", href: "/beneficiarios", icon: UserPlus },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Mais Amor - Atendimento Comunitário" 
              className="w-10 h-10 object-contain rounded-lg shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">Mais Amor</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Atendimento Comunitário</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-gentle"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Auth section */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    Olá, {profile?.nome}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-gentle"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile auth section */}
              <div className="pt-4 mt-4 border-t">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Olá, {profile?.nome}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;