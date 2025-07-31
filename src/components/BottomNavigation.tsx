import { Home, Calendar, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tab } from "@/pages/Index"; // 1. IMPORTE O TIPO COMPARTILHADO

// 2. REMOVA A DEFINIÇÃO ANTIGA QUE ESTAVA AQUI

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  // Apenas as abas visíveis na barra de navegação
  const navTabs = [
    { id: 'dashboard' as const, label: 'Início', icon: Home },
    { id: 'reservations' as const, label: 'Reservas', icon: Calendar },
    { id: 'notifications' as const, label: 'Avisos', icon: Bell },
    { id: 'profile' as const, label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <IconComponent className={`h-5 w-5`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};