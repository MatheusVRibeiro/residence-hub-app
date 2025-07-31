import { useState, useEffect } from "react";
import { Bell, Calendar, AlertCircle, Package, UserCheck, MessageSquarePlus, Megaphone, Home, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  userEmail: string;
  onNavigate: (tab: 'dashboard' | 'reservations' | 'notifications' | 'profile') => void;
}

export const Dashboard = ({ userEmail, onNavigate }: DashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simula o carregamento de dados da API (tempo reduzido)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Tempo de carregamento reduzido para 0.3 segundos
    return () => clearTimeout(timer);
  }, []);

  // Mock data para a nova dashboard
  const userInfo = {
    name: "João Silva", // Nome completo viria da API
    apartment: "Apto 502",
    block: "Bloco A",
    condominiumName: "Residencial Jardins"
  };

  const smartHighlight = {
    type: 'urgent',
    icon: AlertCircle,
    title: "AVISO URGENTE: Manutenção da Caixa D'água",
    message: "Faltará água amanhã, das 9h às 14h.",
  };

  const quickActions = [
    { id: 1, label: "Reservar Espaço", icon: Calendar, action: () => onNavigate('reservations') },
    { id: 2, label: "Minhas Encomendas", icon: Package, action: () => {} },
    { id: 3, label: "Liberar Visitante", icon: UserCheck, action: () => {} },
    { id: 4, label: "Abrir Ocorrência", icon: MessageSquarePlus, action: () => {} },
  ];

  const activityFeed = [
    { id: 1, type: 'announcement', icon: Megaphone, message: "Horário da piscina foi estendido até as 22h.", time: "Hoje, 14:30" },
    { id: 2, type: 'package', icon: Package, message: "Sua encomenda da Amazon chegou na portaria.", time: "Hoje, 11:15" },
    { id: 3, type: 'reservation', icon: Calendar, message: "Sua reserva da Churrasqueira foi confirmada.", time: "Ontem, 18:45" },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-destructive';
      case 'package': return 'text-yellow-600';
      case 'reservation': return 'text-green-600';
      default: return 'text-primary';
    }
  };

  // Componente de Loading com Skeletons
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-between items-center pt-4">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Real
  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Cabeçalho Personalizado */}
        <div className="flex justify-between items-center pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Olá, {userInfo.name}! 👋
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{userInfo.condominiumName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Home className="h-4 w-4" />
              <span>{userInfo.apartment} - {userInfo.block}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-6 w-6" />
          </Button>
        </div>

        {/* Card de Destaque Inteligente */}
        <Card className="app-card bg-destructive/10 border-destructive/50">
          <CardContent className="p-4 flex items-start gap-4">
            <smartHighlight.icon className={`h-6 w-6 mt-1 ${getIconColor(smartHighlight.type)}`} />
            <div>
              <h3 className="font-bold text-foreground">{smartHighlight.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{smartHighlight.message}</p>
            </div>
          </CardContent>
        </Card>

        {/* Menu de Ações Rápidas */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 px-1">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id} 
                  onClick={action.action}
                  className="app-card p-4 flex flex-col items-center justify-center text-center gap-2 h-full hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Feed de Atividades Recentes */}
        <div>
           <h2 className="text-lg font-semibold text-foreground mb-3 px-1">Últimas Atualizações</h2>
          <Card className="app-card">
            <CardContent className="p-4 space-y-4">
              {activityFeed.map((item) => {
                const Icon = item.icon;
                return(
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full border border-border">
                      <Icon className={`h-5 w-5 ${getIconColor(item.type)}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.message}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};