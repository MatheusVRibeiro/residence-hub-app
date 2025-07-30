import { Bell, Calendar, AlertCircle, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardProps {
  userEmail: string;
}

export const Dashboard = ({ userEmail }: DashboardProps) => {
  // Mock data - em produção, viria da API
  const notifications = [
    {
      id: 1,
      title: "Reunião de condomínio",
      message: "Assembleia geral marcada para o dia 15/02",
      date: "Hoje",
      icon: Bell,
      type: "info"
    },
    {
      id: 2,
      title: "Manutenção do elevador",
      message: "Elevador A em manutenção das 9h às 17h",
      date: "Ontem",
      icon: AlertCircle,
      type: "warning"
    },
    {
      id: 3,
      title: "Nova taxa aprovada",
      message: "Taxa de limpeza adicional aprovada",
      date: "2 dias atrás",
      icon: Bell,
      type: "info"
    }
  ];

  const reservations = [
    {
      id: 1,
      environment: "Salão de Festas",
      date: "15/02/2024",
      time: "19:00 - 23:00",
      status: "confirmada"
    },
    {
      id: 2,
      environment: "Churrasqueira",
      date: "22/02/2024", 
      time: "12:00 - 18:00",
      status: "pendente"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "Horário da piscina alterado",
      message: "A partir de segunda-feira, a piscina funcionará das 6h às 22h",
      date: "10/02/2024",
      priority: "alta"
    },
    {
      id: 2,
      title: "Coleta seletiva",
      message: "Lembrete: terças e quintas são os dias da coleta seletiva",
      date: "08/02/2024",
      priority: "normal"
    }
  ];

  const userName = userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">Bem-vindo ao seu condomínio</p>
        </div>

        {/* Notificações Recentes */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                  <IconComponent className={`h-5 w-5 mt-0.5 ${
                    notification.type === 'warning' ? 'text-destructive' : 'text-primary'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.date}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Próximas Reservas */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Reservas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{reservation.environment}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {reservation.date} • {reservation.time}
                    </div>
                  </div>
                  <Badge variant={reservation.status === 'confirmada' ? 'default' : 'secondary'}>
                    {reservation.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma reserva próxima
              </p>
            )}
          </CardContent>
        </Card>

        {/* Avisos Importantes */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Avisos Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-3 rounded-lg bg-background border border-border space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-foreground">{announcement.title}</p>
                  <Badge variant={announcement.priority === 'alta' ? 'destructive' : 'secondary'} className="text-xs">
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{announcement.message}</p>
                <p className="text-xs text-muted-foreground">{announcement.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};