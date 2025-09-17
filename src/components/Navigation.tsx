import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Users, BarChart3, UserPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "@/assets/mais-amor-logo.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Início", href: "/", icon: Heart },
    { name: "Voluntários", href: "/voluntarios", icon: Users },
    { name: "Beneficiários", href: "/beneficiarios", icon: UserPlus },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  ];

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
          <nav className="hidden md:flex items-center space-x-6">
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;