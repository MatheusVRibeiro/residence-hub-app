import React, { useState, useMemo } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, MapPin, CheckCheck, Hand, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Tipos e Dados Mockados ---
type Priority = 'alta' | 'media' | 'baixa';
type NotificationType = 'urgent' | 'warning' | 'info' | 'success' | 'delivery';
interface Action {
  label: string;
  action: () => void;
  icon: React.ElementType;
}
interface Notification {
  id: number;
  title: string;
  message: string;
  fullMessage: string;
  date: string; // Formato "YYYY-MM-DD"
  time: string;
  type: NotificationType;
  read: boolean;
  priority: Priority;
  location?: string;
  startTime?: string;
  endTime?: string;
  action?: Action;
}

const initialNotifications: Notification[] = [
    { id: 1, title: "Assembleia Geral Convocada", message: "Pauta: aprovação do orçamento anual...", fullMessage: "Convocamos todos os moradores para a assembleia geral obrigatória que acontecerá no Salão de Festas.", date: new Date().toISOString().split('T')[0], time: "19:30", type: 'urgent', read: false, priority: 'alta', location: "Salão de Festas", action: { label: "Confirmar Presença", icon: Hand, action: () => toast.success("Presença confirmada!") } },
    { id: 5, title: "Encomenda na Portaria", message: "Um pacote da Amazon chegou para você.", fullMessage: "Olá! Um pacote da loja Amazon foi recebido na portaria e está aguardando sua retirada.", date: new Date().toISOString().split('T')[0], time: "11:15", type: 'delivery', read: false, priority: 'media', action: { label: "Ver Minhas Encomendas", icon: Package, action: () => alert('Navegando para encomendas...') }},
    { id: 2, title: "Manutenção - Elevador Bloco A", message: "O elevador passará por manutenção preventiva...", fullMessage: "Para garantir a segurança de todos, o elevador do Bloco A passará por uma manutenção preventiva agendada.", date: "2025-08-12", time: "08:00", type: 'warning', read: false, priority: 'media', location: "Elevador - Bloco A", startTime: "08:00", endTime: "17:00" },
    { id: 3, title: "Nova Regra para Pets", message: "A partir de 01/09, será obrigatório o uso de coleira...", fullMessage: "A partir de 01/09/2025, será obrigatório o uso de coleira para todos os pets nas áreas comuns do condomínio.", date: "2025-07-28", time: "16:45", type: 'info', read: true, priority: 'media', location: "Áreas Comuns" },
    { id: 4, title: "Dedetização Concluída", message: "As áreas comuns foram dedetizadas com sucesso.", fullMessage: "Informamos que a dedetização programada para as áreas comuns foi concluída com sucesso no dia 27/07.", date: "2025-07-27", time: "11:20", type: 'success', read: true, priority: 'baixa' }
];

// --- Funções Utilitárias ---
const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDateLabel = (date: Date) => {
        if (date.toDateString() === today.toDateString()) return "Hoje";
        if (date.toDateString() === yesterday.toDateString()) return "Ontem";
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    };
    
    // Ordena as notificações da mais nova para a mais antiga antes de agrupar
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

    sortedNotifications.forEach(notification => {
        const notificationDate = new Date(notification.date + 'T00:00:00');
        const label = formatDateLabel(notificationDate);
        if (!groups[label]) {
            groups[label] = [];
        }
        groups[label].push(notification);
    });
    return groups;
};


// --- Tela Principal ---
export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleMarkAsRead = (id: number) => {
    setNotifications(current => current.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleCardClick = (notification: Notification) => {
    if (!notification.read) {
        handleMarkAsRead(notification.id);
        toast.success("Aviso marcado como lido.");
    }
    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(current => current.map(n => ({ ...n, read: true })));
    toast.success("Todos os avisos foram marcados como lidos.");
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const renderNotificationList = (priority?: Priority) => {
    const filtered = priority ? notifications.filter(n => n.priority === priority) : notifications;
    const grouped = groupNotificationsByDate(filtered);

    if (Object.keys(grouped).length === 0) {
      return <p className="text-center text-muted-foreground py-8">Nenhum aviso encontrado.</p>;
    }

    return Object.entries(grouped).map(([dateLabel, notifs]) => (
        <div key={dateLabel} className="space-y-4 animate-in fade-in">
            <h3 className="font-semibold text-sm text-muted-foreground">{dateLabel}</h3>
            {notifs.map(notification => (
                <NotificationCard key={notification.id} notification={notification} onClick={() => handleCardClick(notification)} />
            ))}
        </div>
    ));
  };

  const ActionButton = selectedNotification?.action ? (
    <Button className="w-full" onClick={selectedNotification.action.action}>
        {React.createElement(selectedNotification.action.icon, { className: "h-4 w-4 mr-2" })}
        {selectedNotification.action.label}
    </Button>
  ) : null;


  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center space-y-2 pt-4">
            <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Bell className="h-6 w-6 text-primary" /> Avisos e Notificações
            </h1>
            <div className="flex items-center justify-center gap-4">
                {unreadCount > 0 ? (
                    <p className="text-muted-foreground text-sm">Você tem {unreadCount} {unreadCount === 1 ? 'aviso não lido' : 'avisos não lidos'}</p>
                ) : (
                    <p className="text-muted-foreground text-sm">Você está em dia com os avisos!</p>
                )}
                {unreadCount > 0 && (
                    <Button onClick={handleMarkAllAsRead} size="sm" variant="link" className="p-0 h-auto text-primary">
                        Marcar todas como lidas
                    </Button>
                )}
            </div>
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="alta">Alta</TabsTrigger>
              <TabsTrigger value="media">Média</TabsTrigger>
              <TabsTrigger value="baixa">Baixa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="todos" className="mt-6 space-y-4">{renderNotificationList()}</TabsContent>
            <TabsContent value="alta" className="mt-6 space-y-4">{renderNotificationList('alta')}</TabsContent>
            <TabsContent value="media" className="mt-6 space-y-4">{renderNotificationList('media')}</TabsContent>
            <TabsContent value="baixa" className="mt-6 space-y-4">{renderNotificationList('baixa')}</TabsContent>
          </Tabs>
        </div>
      </div>

      <Drawer open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-lg">{selectedNotification?.title}</DrawerTitle>
              <DrawerDescription>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1.5" />
                  {selectedNotification && new Date(selectedNotification.date + 'T' + selectedNotification.time).toLocaleString('pt-BR', {dateStyle: 'long', timeStyle: 'short'})}
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{selectedNotification?.fullMessage}</p>
              
              {selectedNotification?.location && (<div className="flex items-start gap-3 text-sm pt-2"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><p className="font-medium text-foreground">Local</p><p className="text-xs text-muted-foreground">{selectedNotification.location}</p></div></div>)}
              {selectedNotification?.startTime && (<div className="flex items-start gap-3 text-sm"><Clock className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><p className="font-medium text-foreground">Horário</p><p className="text-xs text-muted-foreground">Das {selectedNotification.startTime} às {selectedNotification.endTime}</p></div></div>)}
            </div>
            <DrawerFooter>
              {ActionButton}
               <DrawerClose asChild><Button variant="outline">Fechar</Button></DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// --- Componente do Card de Notificação ---
const NotificationCard = ({ notification, onClick }: { notification: Notification, onClick: () => void }) => {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'delivery': return <Package className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card 
      onClick={onClick}
      className="app-card transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 relative"
      aria-label={`Aviso: ${notification.title}`}
    >
      {!notification.read && (
          <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-foreground text-base leading-tight pr-4">{notification.title}</h3>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};