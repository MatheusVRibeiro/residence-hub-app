import { Bell, AlertCircle, Info, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const NotificationsScreen = () => {
  // Mock data
  const notifications = [
    { id: 1, title: "Assembleia Geral Convocada", message: "Você está convocado para a assembleia geral que acontecerá no dia 15/02/2024 às 19h no salão de festas.", date: "2024-02-10", time: "09:30", type: 'urgent', read: false, priority: 'alta' },
    { id: 2, title: "Manutenção - Elevador A", message: "O elevador A passará por manutenção no dia 12/02/2024 das 08h às 17h.", date: "2024-02-09", time: "14:15", type: 'warning', read: false, priority: 'media' },
    { id: 3, title: "Nova Taxa Aprovada", message: "Foi aprovada a taxa adicional de R$ 50,00 para manutenção da piscina.", date: "2024-02-08", time: "16:45", type: 'info', read: true, priority: 'media' },
    { id: 4, title: "Sistema de Portaria Atualizado", message: "O sistema de controle de acesso foi atualizado com sucesso.", date: "2024-02-07", time: "11:20", type: 'success', read: true, priority: 'baixa' }
  ];

  const getNotificationIcon = (type: string) => ({'urgent': AlertCircle, 'warning': AlertCircle, 'success': CheckCircle})[type] || Info;
  const getNotificationColor = (type: string) => ({'urgent': 'text-destructive', 'warning': 'text-yellow-600', 'success': 'text-green-600'})[type] || 'text-primary';
  
  // --- FUNÇÃO CORRIGIDA AQUI ---
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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Avisos e Notificações
          </h1>
          {unreadCount > 0 && <p className="text-muted-foreground text-sm">Você tem {unreadCount} {unreadCount === 1 ? 'aviso não lido' : 'avisos não lidos'}</p>}
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            return (
              <Card key={notification.id} className={`app-card transition-all duration-200 ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : 'bg-card'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${getNotificationColor(notification.type)}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-tight text-foreground">{notification.title}</h3>
                        <Badge variant={getPriorityVariant(notification.priority)} className="text-xs">{notification.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{notification.message}</p>
                      <div className="flex items-center text-xs text-muted-foreground pt-1">
                        <Clock className="h-3 w-3 mr-1" /> {formatDate(notification.date)} • {notification.time}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};