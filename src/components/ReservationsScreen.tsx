import { useState } from "react";
import { Calendar, Clock, Users, X, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Environment {
  id: number; name: string; capacity: number; description: string; available: boolean;
}
interface Reservation {
  id: number; environmentName: string; date: string; time: string;
}

export const ReservationsScreen = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const [environments] = useState<Environment[]>([
    { id: 1, name: "Salão de Festas", capacity: 50, description: "Espaço amplo para eventos.", available: true },
    { id: 2, name: "Churrasqueira", capacity: 20, description: "Área gourmet com churrasqueira.", available: true },
    { id: 3, name: "Quadra de Tênis", capacity: 4, description: "Quadra oficial para esportes.", available: false },
    { id: 4, name: "Piscina", capacity: 30, description: "Lazer e recreação aquática.", available: true },
    { id: 5, name: "Academia", capacity: 15, description: "Espaço fitness com equipamentos.", available: true }
  ]);

  const [myReservations, setMyReservations] = useState<Reservation[]>([
    { id: 1, environmentName: "Salão de Festas", date: "2025-08-15", time: "19:00" },
    { id: 2, environmentName: "Churrasqueira", date: "2025-08-22", time: "12:00" }
  ]);

  const handleOpenModal = (environment: Environment) => {
    setSelectedEnvironment(environment);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedEnvironment || !reservationDate || !reservationTime) {
      toast({ title: "Erro", description: "Por favor, preencha data e horário.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newReservation: Reservation = {
      id: Date.now(),
      environmentName: selectedEnvironment.name,
      date: reservationDate,
      time: reservationTime,
    };
    setMyReservations(prev => [...prev, newReservation]);
    toast({ title: "Reserva confirmada!", description: `${selectedEnvironment.name} reservado.` });
    setIsModalOpen(false);
    setReservationDate("");
    setReservationTime("");
    setIsLoading(false);
  };

  const handleCancelReservation = (reservationId: number) => {
    setMyReservations(prev => prev.filter(r => r.id !== reservationId));
    toast({ title: "Reserva cancelada", variant: "destructive" });
  };

  const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-4">
            <h1 className="text-2xl font-bold text-foreground">Reservar Ambientes</h1>
            <p className="text-muted-foreground text-sm mt-1">Veja os espaços e gerencie suas reservas.</p>
          </div>

          {/* Minhas Reservas */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Minhas Reservas
            </h2>
            <Card className="app-card">
              <CardContent className="p-4 space-y-3">
                {myReservations.length > 0 ? (
                  myReservations.map((res) => (
                    <div key={res.id} className="p-3 rounded-lg bg-background border border-border flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{res.environmentName}</p>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar size={12} /> {formatDate(res.date)} <Clock size={12} /> {res.time}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCancelReservation(res.id)}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4 text-sm">Nenhuma reserva ativa.</p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Ambientes Disponíveis */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> Espaços Disponíveis
            </h2>
            <div className="space-y-4">
              {environments.map((env) => (
                <Card key={env.id} className="app-card flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start text-base">
                      {env.name}
                      <Badge variant={env.available ? "default" : "secondary"}>{env.available ? "Disponível" : "Indisponível"}</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">{env.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      Capacidade para {env.capacity} pessoas
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full app-button" disabled={!env.available} onClick={() => handleOpenModal(env)}>
                      Reservar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="app-card max-w-sm mx-auto">
          <DialogHeader><DialogTitle>Reservar {selectedEnvironment?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="date">Data</Label><Input id="date" type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="app-input" min={new Date().toISOString().split('T')[0]} /></div>
            <div className="space-y-2"><Label htmlFor="time">Horário</Label><Input id="time" type="time" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} className="app-input" /></div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1" disabled={isLoading}>Cancelar</Button>
              <Button onClick={handleConfirmReservation} className="flex-1 app-button" disabled={isLoading}>{isLoading ? "Confirmando..." : "Confirmar"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};