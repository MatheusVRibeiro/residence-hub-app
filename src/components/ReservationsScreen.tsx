import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Environment {
  id: number;
  name: string;
  capacity: number;
  description: string;
  available: boolean;
}

interface Reservation {
  id: number;
  environmentId: number;
  environmentName: string;
  date: string;
  time: string;
  status: 'ativa' | 'cancelada';
}

export const ReservationsScreen = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - em produção, viria da API
  const [environments] = useState<Environment[]>([
    {
      id: 1,
      name: "Salão de Festas",
      capacity: 50,
      description: "Espaço amplo para eventos e comemorações",
      available: true
    },
    {
      id: 2,
      name: "Churrasqueira",
      capacity: 20,
      description: "Área gourmet com churrasqueira e pia",
      available: true
    },
    {
      id: 3,
      name: "Quadra de Tênis",
      capacity: 4,
      description: "Quadra oficial para práticas esportivas",
      available: false
    },
    {
      id: 4,
      name: "Piscina",
      capacity: 30,
      description: "Área aquática para lazer e recreação",
      available: true
    },
    {
      id: 5,
      name: "Academia",
      capacity: 15,
      description: "Espaço fitness com equipamentos",
      available: true
    }
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      environmentId: 1,
      environmentName: "Salão de Festas",
      date: "2024-02-15",
      time: "19:00",
      status: 'ativa'
    },
    {
      id: 2,
      environmentId: 2,
      environmentName: "Churrasqueira",
      date: "2024-02-22",
      time: "12:00",
      status: 'ativa'
    }
  ]);

  const handleReserve = (environment: Environment) => {
    setSelectedEnvironment(environment);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedEnvironment || !reservationDate || !reservationTime) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada à API
      // await axios.post('/api/reservas', { environmentId: selectedEnvironment.id, date: reservationDate, time: reservationTime })
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReservation: Reservation = {
        id: Date.now(),
        environmentId: selectedEnvironment.id,
        environmentName: selectedEnvironment.name,
        date: reservationDate,
        time: reservationTime,
        status: 'ativa'
      };

      setReservations(prev => [...prev, newReservation]);
      
      toast({
        title: "Reserva confirmada!",
        description: `${selectedEnvironment.name} reservado para ${reservationDate} às ${reservationTime}`,
      });

      setIsModalOpen(false);
      setReservationDate("");
      setReservationTime("");
      setSelectedEnvironment(null);
    } catch (error) {
      toast({
        title: "Erro na reserva",
        description: "Não foi possível realizar a reserva. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));

      setReservations(prev => 
        prev.map(r => r.id === reservationId ? { ...r, status: 'cancelada' as const } : r)
      );

      toast({
        title: "Reserva cancelada",
        description: "Sua reserva foi cancelada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a reserva",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
          <p className="text-muted-foreground">Gerencie suas reservas de ambientes</p>
        </div>

        {/* Ambientes Disponíveis */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Ambientes Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {environments.map((environment) => (
              <div key={environment.id} className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground">{environment.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{environment.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Capacidade: {environment.capacity} pessoas
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={environment.available ? "default" : "secondary"}>
                      {environment.available ? "Disponível" : "Indisponível"}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleReserve(environment)}
                      disabled={!environment.available}
                      className="app-button text-xs px-3 py-1"
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Minhas Reservas */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Minhas Reservas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reservations.filter(r => r.status === 'ativa').length > 0 ? (
              reservations
                .filter(r => r.status === 'ativa')
                .map((reservation) => (
                  <div key={reservation.id} className="p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-foreground">{reservation.environmentName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(reservation.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {reservation.time}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="text-xs px-3 py-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma reserva ativa
              </p>
            )}
          </CardContent>
        </Card>

        {/* Modal de Reserva */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="app-card max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Reservar {selectedEnvironment?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="app-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="app-input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmReservation}
                  className="flex-1 app-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Confirmando..." : "Confirmar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};