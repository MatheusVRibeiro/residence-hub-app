import { useState } from "react";
import { Calendar, Clock, Users, X, Building, ListChecks, Info, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface Environment {
  id: number; name: string; capacity: number; description: string; available: boolean; rules: string[];
}
interface Reservation {
  id: number; environmentName: string; date: string; time: string; confirmationCode: string;
}

export const ReservationsScreen = () => {
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const [environments] = useState<Environment[]>([
    { id: 1, name: "Salão de Festas", capacity: 50, description: "Espaço amplo para eventos.", available: true, rules: ["Limpeza obrigatória após o uso.", "Som permitido até as 22h."] },
    { id: 2, name: "Churrasqueira", capacity: 20, description: "Área gourmet com churrasqueira.", available: true, rules: ["Levar próprio carvão.", "Não deixar restos de comida."] },
    { id: 3, name: "Quadra de Tênis", capacity: 4, description: "Quadra oficial para esportes.", available: false, rules: ["Uso de calçado apropriado.", "Máximo de 1h por reserva."] },
  ]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([
    { id: 1, environmentName: "Salão de Festas", date: "2025-08-15", time: "19:00", confirmationCode: "FESTA-A7B2" },
    { id: 2, environmentName: "Churrasqueira", date: "2025-08-22", time: "12:00", confirmationCode: "CHURRAS-C3D9" }
  ]);

  const handleOpenDrawer = (environment: Environment) => {
    setSelectedEnvironment(environment); setIsDrawerOpen(true);
  };
  
  const handleConfirmReservation = async () => {
    if (!selectedEnvironment || !reservationDate || !reservationTime) {
      toast({ title: "Erro", description: "Por favor, preencha data e horário.", variant: "destructive" }); return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newReservation: Reservation = {
      id: Date.now(),
      environmentName: selectedEnvironment.name,
      date: reservationDate,
      time: reservationTime,
      confirmationCode: `${selectedEnvironment.name.substring(0,4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    };
    setMyReservations(prev => [...prev, newReservation].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    toast({ title: "Reserva confirmada!", description: `${selectedEnvironment.name} reservado.` });
    setIsDrawerOpen(false); setReservationDate(""); setReservationTime(""); setIsLoading(false);
  };

  const handleCancelReservation = (reservationId: number) => {
    setMyReservations(prev => prev.filter(r => r.id !== reservationId));
    toast({ title: "Reserva cancelada", variant: "destructive" });
  };

  const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-4">
            <h1 className="text-2xl font-bold text-foreground">Reservas de Ambientes</h1>
            <p className="text-muted-foreground text-sm mt-1">Escolha um espaço ou gerencie suas reservas.</p>
          </div>

          <Tabs defaultValue="reservar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reservar"><Building className="h-4 w-4 mr-2"/> Reservar</TabsTrigger>
              <TabsTrigger value="minhas-reservas"><ListChecks className="h-4 w-4 mr-2"/> Minhas Reservas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reservar" className="mt-6 space-y-4">
              {environments.map((env) => (
                <Card key={env.id} className="app-card flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start text-base">{env.name}<Badge variant={env.available ? "default" : "secondary"}>{env.available ? "Disponível" : "Indisponível"}</Badge></CardTitle>
                    <CardDescription className="text-xs">{env.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow"><div className="flex items-center text-xs text-muted-foreground"><Users className="h-4 w-4 mr-2" />Capacidade para {env.capacity} pessoas</div></CardContent>
                  <CardFooter><Button className="w-full app-button" disabled={!env.available} onClick={() => handleOpenDrawer(env)}>Fazer Reserva</Button></CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="minhas-reservas" className="mt-6">
              {myReservations.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {myReservations.map((res) => (
                    <AccordionItem key={res.id} value={`item-${res.id}`} className="app-card rounded-xl border">
                      <AccordionTrigger className="p-4 text-left hover:no-underline">
                        <div>
                          <p className="font-semibold text-foreground text-base">{res.environmentName}</p>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar size={14} /> {formatDate(res.date)}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="border-t pt-4 space-y-3">
                          <h4 className="font-semibold text-sm">Detalhes da Reserva:</h4>
                          <div className="text-sm text-muted-foreground flex items-center gap-2"><Clock size={14} /> Horário: {res.time}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2"><Copy size={14} /> Cód: {res.confirmationCode}</div>
                          <div className="text-sm text-muted-foreground flex items-start gap-2"><Info size={14} className="mt-0.5"/> Regras: {environments.find(e => e.name === res.environmentName)?.rules.join(' ')}</div>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="w-full mt-2">
                                <X className="h-4 w-4 mr-2" /> Cancelar Reserva
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. A sua reserva para o espaço <strong>{res.environmentName}</strong> será permanentemente cancelada.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Voltar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleCancelReservation(res.id)}>
                                  Sim, cancelar reserva
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center text-muted-foreground py-12 px-4">
                  <ListChecks className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma reserva ativa</h3>
                  <p className="mt-1 text-sm text-gray-500">Vá para a aba "Reservar" para agendar um espaço.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-left">
              <DrawerTitle>Reservar {selectedEnvironment?.name}</DrawerTitle>
              <DrawerDescription>Preencha os dados para agendar o espaço.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data da Reserva</Label>
                <Input id="date" type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="app-input" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário de Início</Label>
                <Input id="time" type="time" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} className="app-input" />
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleConfirmReservation} className="app-button" disabled={isLoading}>
                {isLoading ? "Confirmando..." : "Confirmar Reserva"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};