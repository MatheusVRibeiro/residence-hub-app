import React, { useState, useMemo } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, Search, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";

// --- Tipos e Dados Mockados ---
type Priority = 'alta' | 'media' | 'baixa';
type NotificationType = 'urgent' | 'warning' | 'info' | 'success';

interface Notification {
  id: number;
  title: string;
  message: string;
  fullMessage: string;
  date: string;
  time: string;
  type: NotificationType;
  read: boolean;
  priority: Priority;
  location?: string;
  startTime?: string;
  endTime?: string;
}

const initialNotifications: Notification[] = [
  { id: 1, title: "Assembleia Geral Convocada", message: "Pauta: aprovação do orçamento anual...", fullMessage: "Convocamos todos os moradores para a assembleia geral obrigatória que acontecerá no Salão de Festas. A pauta principal será a discussão e aprovação do orçamento para o próximo ano.", date: "2025-08-15", time: "19:30", type: 'urgent', read: false, priority: 'alta', location: "Salão de Festas" },
  { id: 2, title: "Manutenção - Elevador A", message: "O elevador A passará por manutenção preventiva...", fullMessage: "Para garantir a segurança de todos, o elevador do Bloco A passará por uma manutenção preventiva agendada. Por favor, utilizem o elevador do Bloco B ou as escadas durante este período.", date: "2025-08-12", time: "08:00", type: 'warning', read: false, priority: 'media', location: "Elevador - Bloco A", startTime: "08:00", endTime: "17:00" },
  { id: 3, title: "Nova Regra para Pets", message: "A partir de 01/09, será obrigatório o uso de coleira...", fullMessage: "A partir de 01/09/2025, será obrigatório o uso de coleira para todos os pets nas áreas comuns do condomínio, visando a segurança e bem-estar de todos.", date: "2025-07-28", time: "16:45", type: 'info', read: true, priority: 'media', location: "Áreas Comuns" },
  { id: 4, title: "Dedetização Concluída", message: "As áreas comuns foram dedetizadas com sucesso.", fullMessage: "Informamos que a dedetização programada para as áreas comuns foi concluída com sucesso. Agradecemos a colaboração de todos.", date: "2025-07-27", time: "11:20", type: 'success', read: true, priority: 'baixa' }
];

// --- Tela Principal ---
export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { toast } = useToast();

  const handleMarkAsRead = (id: number) => {
    setNotifications(current => current.map(n => n.id === id ? { ...n, read: true } : n));
    if (selectedNotification?.id === id) {
      setSelectedNotification(prev => prev ? { ...prev, read: true } : null);
    }
  };
  
  const handleCardClick = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notifications, searchTerm]);

  const renderNotificationList = (priority?: Priority) => {
    const list = priority ? filteredNotifications.filter(n => n.priority === priority) : filteredNotifications;
    if (list.length === 0) return <p className="text-center text-muted-foreground py-8">Nenhum aviso encontrado.</p>;
    
    return list.map(notification => (
      <NotificationCard key={notification.id} notification={notification} onClick={() => handleCardClick(notification)} />
    ));
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2 pt-4">
            <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Bell className="h-6 w-6 text-primary" /> Avisos e Notificações
            </h1>
            {unreadCount > 0 && <p className="text-muted-foreground text-sm">Você tem {unreadCount} {unreadCount === 1 ? 'aviso não lido' : 'avisos não lidos'}</p>}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por palavra-chave..." className="app-input pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

      {/* Drawer para Detalhes da Notificação */}
      <Drawer open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-lg">{selectedNotification?.title}</DrawerTitle>
              <DrawerDescription>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1.5" />
                  {selectedNotification && new Date(selectedNotification.date).toLocaleDateString('pt-BR')} às {selectedNotification?.time}
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{selectedNotification?.fullMessage}</p>
              
              {selectedNotification?.location && (
                 <div className="flex items-start gap-3 text-sm pt-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="font-medium text-foreground">Local</p>
                        <p className="text-xs text-muted-foreground">{selectedNotification.location}</p>
                    </div>
                </div>
              )}

              {selectedNotification?.startTime && (
                 <div className="flex items-start gap-3 text-sm">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="font-medium text-foreground">Horário</p>
                        <p className="text-xs text-muted-foreground">Das {selectedNotification.startTime} às {selectedNotification.endTime}</p>
                    </div>
                </div>
              )}
              
              {!selectedNotification?.read && (
                <Button className="w-full mt-4" onClick={() => {
                  handleMarkAsRead(selectedNotification.id);
                  toast({ title: "Aviso marcado como lido." });
                }}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Marcar como lido
                </Button>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// --- Componente do Card de Notificação ---
const NotificationCard = ({ notification, onClick }) => {
  const priorityInfo = {
    alta: { variant: "destructive", label: "Alta" },
    media: { variant: "default", label: "Média" },
    baixa: { variant: "secondary", label: "Baixa" }
  };
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card 
      onClick={onClick}
      className={`app-card transition-all duration-300 cursor-pointer hover:bg-primary/10 ${!notification.read ? 'bg-primary/5 border-l-4 border-primary' : 'bg-card'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-foreground leading-tight">{notification.title}</h3>
              <Badge variant={priorityInfo[notification.priority].variant as any}>{priorityInfo[notification.priority].label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};