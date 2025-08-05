// =================================================================================
// ARQUIVO: src/components/ReservationsScreen.tsx
// OBJETIVO: Tela completa para reserva de ambientes, com fluxo de aprovação,
//           calendário visual, histórico, detalhes do ambiente e lista de convidados.
// =================================================================================

// --- 1. IMPORTAÇÕES ---
import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Users, X, Building, ListChecks, Info, Copy, Hourglass, CheckCircle, Camera, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { toast } from "sonner";

// --- 2. TIPOS E DADOS SIMULADOS ---
type ReservationStatus = 'pendente' | 'confirmada' | 'cancelada';
interface Environment {
  id: number; name: string; capacity: number; description: string; available: boolean; rules: string[]; items: string[]; photos: string[];
}
interface Reservation {
  id: number; environmentName: string; date: string; time: string; confirmationCode: string; status: ReservationStatus; guests?: string[];
}

const environments: Environment[] = [
    { id: 1, name: "Salão de Festas", capacity: 50, description: "Espaço amplo para eventos e confraternizações.", available: true, rules: ["Limpeza obrigatória após o uso.", "Som permitido em volume ambiente até as 22h.", "Proibido uso de confetes ou serpentinas."], items: ["Mesas e Cadeiras", "Freezer", "Microondas"], photos: ["/placeholders/salao1.jpg", "/placeholders/salao2.jpg"] },
    { id: 2, name: "Churrasqueira", capacity: 20, description: "Área gourmet com churrasqueira e forno de pizza.", available: true, rules: ["Morador deve levar próprio carvão e utensílios.", "Não deixar restos de comida na grelha."], items: ["Grelha", "Forno de Pizza", "Bancada com Pia"], photos: ["/placeholders/churrasqueira1.jpg"] },
    { id: 3, name: "Quadra de Tênis", capacity: 4, description: "Quadra oficial para a prática de tênis.", available: false, rules: ["Uso de calçado apropriado é obrigatório.", "Máximo de 1h por reserva em dias de alta demanda."], items: ["Rede Oficial"], photos: [] },
];
const allExistingReservations: Reservation[] = [
    { id: 101, environmentName: "Salão de Festas", date: "2025-08-15", time: "19:00", confirmationCode: "FESTA-A7B2", status: 'confirmada', guests: ["João Silva", "Maria Oliveira"] },
    { id: 102, environmentName: "Churrasqueira", date: "2025-08-22", time: "12:00", confirmationCode: "CHURRAS-C3D9", status: 'pendente' },
    { id: 103, environmentName: "Churrasqueira", date: new Date().toISOString().split('T')[0], time: "14:00", confirmationCode: "CHURRAS-TEST1", status: 'confirmada' },
    { id: 104, environmentName: "Churrasqueira", date: new Date().toISOString().split('T')[0], time: "16:00", confirmationCode: "CHURRAS-TEST2", status: 'confirmada' },
    { id: 105, environmentName: "Salão de Festas", date: "2025-07-20", time: "18:00", confirmationCode: "FESTA-OLD1", status: 'confirmada' }, // Reserva passada
];

// --- 3. TELA PRINCIPAL DE RESERVAS ---
export const ReservationsScreen = () => {
  // --- Estados do Componente ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const [reservationDate, setReservationDate] = useState<Date | undefined>(new Date());
  const [reservationTime, setReservationTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [myReservations, setMyReservations] = useState<Reservation[]>(
    allExistingReservations.filter(r => [101, 102, 105].includes(r.id))
  );

  // --- Funções de Manipulação de Eventos ---
  const handleOpenDetails = (environment: Environment) => {
    setSelectedEnvironment(environment);
    setIsDetailsOpen(true);
  }
  const handleOpenDrawer = (environment: Environment) => {
    setSelectedEnvironment(environment);
    setReservationTime(null);
    setIsDrawerOpen(true);
  };
  
  const handleRequestReservation = async () => {
    if (!selectedEnvironment || !reservationDate || !reservationTime) {
      toast.error("Seleção incompleta", { description: "Por favor, selecione uma data e um horário disponível." }); return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReservation: Reservation = {
      id: Date.now(),
      environmentName: selectedEnvironment.name,
      date: reservationDate.toISOString().split('T')[0],
      time: reservationTime,
      confirmationCode: `${selectedEnvironment.name.substring(0,4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'pendente'
    };
    
    setMyReservations(prev => [...prev, newReservation].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    allExistingReservations.push(newReservation);
    // PONTO DE INTEGRAÇÃO: Aqui, a API enviaria uma notificação para o síndico sobre o novo pedido.
    toast.success("Solicitação de reserva enviada!", { description: `Aguarde a aprovação para ${selectedEnvironment.name}.` });
    setIsDrawerOpen(false); setReservationTime(null); setIsLoading(false);
  };

  const handleCancelReservation = (reservationId: number) => {
    setMyReservations(prev => prev.map(r => r.id === reservationId ? {...r, status: 'cancelada'} : r));
    // PONTO DE INTEGRAÇÃO: Aqui, a API enviaria uma notificação para o morador sobre o cancelamento.
    toast.error("Reserva cancelada");
  };

  const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // --- Sub-Componentes da Tela ---

  // Componente para o badge de status da reserva
  const ReservationStatusBadge = ({ status }: { status: ReservationStatus }) => {
    const statusInfo = {
      pendente: { variant: "secondary", label: "Pendente", icon: <Hourglass className="h-3 w-3 mr-1.5" />, color: "" },
      confirmada: { variant: "default", label: "Confirmada", icon: <CheckCircle className="h-3 w-3 mr-1.5" />, color: "bg-green-600 hover:bg-green-700 text-green-50" },
      cancelada: { variant: "destructive", label: "Cancelada", icon: <X className="h-3 w-3 mr-1.5" />, color: "" }
    };
    const info = statusInfo[status];
    return <Badge variant={info.variant as any} className={`flex items-center text-xs ${info.color}`}>{info.icon}{info.label}</Badge>;
  };

  // Componente para a grade de seleção de horários
  const TimeSlotPicker = () => {
    const allSlots = useMemo(() => {
        const slots = [];
        for (let i = 8; i <= 22; i++) { slots.push(`${i.toString().padStart(2, '0')}:00`); }
        return slots;
    }, []);
    const reservedSlots = useMemo(() => {
        if (!reservationDate || !selectedEnvironment) return [];
        const selectedDateStr = reservationDate.toISOString().split('T')[0];
        return allExistingReservations
            .filter(r => r.environmentName === selectedEnvironment.name && r.date === selectedDateStr && r.status !== 'cancelada')
            .map(r => r.time);
    }, [reservationDate, selectedEnvironment]);

    return (
        <div className="space-y-2">
            <Label>Escolha um horário disponível</Label>
            <div className="grid grid-cols-4 gap-2 pt-2">
                {allSlots.map(slot => {
                    const isReserved = reservedSlots.includes(slot);
                    const isSelected = reservationTime === slot;
                    return (
                        <Button key={slot} variant={isReserved ? "secondary" : (isSelected ? "default" : "outline")}
                            disabled={isReserved} onClick={() => setReservationTime(slot)} className="text-xs h-9">
                            {slot}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
  };

  // Componente para exibir o histórico de reservas (passadas e futuras)
  const MyReservationsList = ({ type }: { type: 'upcoming' | 'past' }) => {
      const today = new Date().toISOString().split('T')[0];
      const reservations = myReservations.filter(res => {
          const isUpcoming = res.date >= today && res.status !== 'cancelada';
          return type === 'upcoming' ? isUpcoming : !isUpcoming;
      }).sort((a,b) => type === 'upcoming' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime());

      if (reservations.length === 0) {
          return (
            <div className="text-center text-muted-foreground py-12 px-4">
              <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma reserva encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">{type === 'upcoming' ? 'Vá para a aba "Reservar" para agendar um espaço.' : 'Seu histórico está vazio.'}</p>
            </div>
          );
      }

      return (
        <Accordion type="single" collapsible className="w-full space-y-3">
            {reservations.map((res) => (
            <AccordionItem key={res.id} value={`item-${res.id}`} className="app-card rounded-xl border">
                <AccordionTrigger className="p-4 text-left hover:no-underline">
                <div className="w-full flex justify-between items-center">
                    <div>
                    <p className="font-semibold text-foreground text-base">{res.environmentName}</p>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar size={14} /> {formatDate(res.date)}
                    </div>
                    </div>
                    <ReservationStatusBadge status={res.status} />
                </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold text-sm">Detalhes da Reserva:</h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-2"><Clock size={14} /> Horário: {res.time}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2"><Copy size={14} /> Cód: {res.confirmationCode}</div>
                    <div className="text-sm text-muted-foreground flex items-start gap-2"><Info size={14} className="mt-0.5"/> Regras: {environments.find(e => e.name === res.environmentName)?.rules.join(' ')}</div>
                    
                    {res.status === 'confirmada' && (
                        <div className="border-t pt-3 mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                                <UserPlus className="h-4 w-4 mr-2" /> Gerenciar Lista de Convidados
                            </Button>
                        </div>
                    )}

                    {res.status !== 'cancelada' && type === 'upcoming' && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full mt-2">
                            <X className="h-4 w-4 mr-2" />
                            {res.status === 'pendente' ? 'Cancelar Solicitação' : 'Cancelar Reserva'}
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita. Sua solicitação para <strong>{res.environmentName}</strong> será permanentemente cancelada.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancelReservation(res.id)}>Sim, cancelar</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    )}
                </div>
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
      );
  }

  // --- JSX Principal da Tela ---
  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-6 pt-4">
            <h1 className="text-2xl font-bold text-foreground">Reservas de Ambientes</h1>
            <p className="text-muted-foreground text-sm mt-1">Solicite um espaço ou gerencie suas reservas.</p>
          </div>

          {/* Abas Principais */}
          <Tabs defaultValue="reservar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reservar"><Building className="h-4 w-4 mr-2"/> Reservar</TabsTrigger>
              <TabsTrigger value="minhas-reservas"><ListChecks className="h-4 w-4 mr-2"/> Minhas Reservas</TabsTrigger>
            </TabsList>
            
            {/* Conteúdo da Aba "Reservar" */}
            <TabsContent value="reservar" className="mt-6 space-y-4">
              {environments.map((env) => (
                <Card key={env.id} className="app-card flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start text-base">{env.name}<Badge variant={env.available ? "default" : "secondary"}>{env.available ? "Disponível" : "Indisponível"}</Badge></CardTitle>
                    <CardDescription className="text-xs">{env.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-xs text-muted-foreground"><Users className="h-4 w-4 mr-2" />Capacidade: {env.capacity} pessoas</div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleOpenDetails(env)}>Ver Detalhes</Button>
                    <Button className="flex-1 app-button" disabled={!env.available} onClick={() => handleOpenDrawer(env)}>Solicitar</Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            {/* Conteúdo da Aba "Minhas Reservas" */}
            <TabsContent value="minhas-reservas" className="mt-2">
                 <Tabs defaultValue="proximas" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="proximas">Próximas</TabsTrigger>
                        <TabsTrigger value="anteriores">Histórico</TabsTrigger>
                    </TabsList>
                    <TabsContent value="proximas" className="mt-6"><MyReservationsList type="upcoming" /></TabsContent>
                    <TabsContent value="anteriores" className="mt-6"><MyReservationsList type="past" /></TabsContent>
                 </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Drawer para Solicitar Reserva */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-left">
              <DrawerTitle>Solicitar Reserva para {selectedEnvironment?.name}</DrawerTitle>
              <DrawerDescription>Selecione o dia e depois o horário desejado.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-6">
              <div className="flex justify-center">
                <CalendarPicker mode="single" selected={reservationDate} onSelect={setReservationDate} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} initialFocus />
              </div>
              <TimeSlotPicker />
            </div>
            <DrawerFooter>
              <Button onClick={handleRequestReservation} className="app-button" disabled={isLoading}>{isLoading ? "Enviando Solicitação..." : "Solicitar Reserva"}</Button>
              <DrawerClose asChild><Button variant="outline">Cancelar</Button></DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Dialog para Detalhes do Ambiente */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-sm">
              <DialogHeader>
                  <DialogTitle>{selectedEnvironment?.name}</DialogTitle>
                  <DialogDescription>{selectedEnvironment?.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                  {selectedEnvironment?.photos && selectedEnvironment.photos.length > 0 && (
                      <div className="rounded-lg h-40 bg-gray-200 flex items-center justify-center">
                          <Camera className="h-10 w-10 text-gray-400" />
                          <p className="ml-2 text-gray-500 text-sm">Galeria de fotos (placeholder)</p>
                      </div>
                  )}
                  <div>
                      <h4 className="font-semibold text-sm mb-2">Regras de Utilização:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {selectedEnvironment?.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-semibold text-sm mb-2">Itens Inclusos:</h4>
                       <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {selectedEnvironment?.items.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Fechar</Button></DialogClose>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
};