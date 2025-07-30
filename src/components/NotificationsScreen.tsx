import { Bell, AlertCircle, Info, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  read: boolean;
  priority: 'alta' | 'media' | 'baixa';
}

export const NotificationsScreen = () => {
  // Mock data - em produção, viria da API
  const notifications: Notification[] = [
    {
      id: 1,
      title: "Assembleia Geral Convocada",
      message: "Você está convocado para a assembleia geral que acontecerá no dia 15/02/2024 às 19h no salão de festas. Pauta: aprovação do orçamento anual.",
      date: "2024-02-10",
      time: "09:30",
      type: 'urgent',
      read: false,
      priority: 'alta'
    },
    {
      id: 2,
      title: "Manutenção Programada - Elevador A",
      message: "O elevador A passará por manutenção preventiva no dia 12/02/2024 das 08h às 17h. Utilize o elevador B durante este período.",
      date: "2024-02-09",
      time: "14:15",
      type: 'warning',
      read: false,
      priority: 'media'
    },
    {
      id: 3,
      title: "Nova Taxa Aprovada",
      message: "Foi aprovada em assembleia a taxa adicional de R$ 50,00 para manutenção da piscina. Valor será cobrado a partir de março/2024.",
      date: "2024-02-08",
      time: "16:45",
      type: 'info',
      read: true,
      priority: 'media'
    },
    {
      id: 4,
      title: "Sistema de Portaria Atualizado",
      message: "O sistema de controle de acesso foi atualizado com sucesso. Novos recursos disponíveis no aplicativo do porteiro.",
      date: "2024-02-07",
      time: "11:20",
      type: 'success',
      read: true,
      priority: 'baixa'
    },
    {
      id: 5,
      title: "Horário da Piscina Alterado",
      message: "A partir de segunda-feira (12/02), a piscina funcionará das 06h às 22h. Aproveitem o horário estendido!",
      date: "2024-02-06",
      time: "13:30",
      type: 'info',
      read: true,
      priority: 'media'
    },
    {
      id: 6,
      title: "Coleta Seletiva - Lembrete",
      message: "Lembrete: terças e quintas-feiras são os dias da coleta seletiva. Separe seus materiais recicláveis corretamente.",
      date: "2024-02-05",
      time: "08:00",
      type: 'info',
      read: true,
      priority: 'baixa'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return AlertCircle;
      case 'warning':
        return AlertCircle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-destructive';
      case 'warning':
        return 'text-yellow-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-primary';
    }
  };

  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" => {
    switch (priority) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Avisos e Notificações
          </h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground">
              Você tem {unreadCount} {unreadCount === 1 ? 'aviso não lido' : 'avisos não lidos'}
            </p>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="default" size="sm" className="whitespace-nowrap">
            Todos
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Não Lidos
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Urgentes
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Avisos
          </Button>
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`app-card transition-all duration-200 ${
                  !notification.read 
                    ? 'border-l-4 border-l-primary bg-primary/5' 
                    : 'bg-card'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${iconColor}`} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </h3>
                        <Badge variant={getPriorityVariant(notification.priority)} className="text-xs">
                          {notification.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(notification.date)} • {notification.time}
                        </div>
                        
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Marcar todas como lidas */}
        {unreadCount > 0 && (
          <div className="text-center">
            <Button variant="outline" size="sm">
              Marcar todas como lidas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};