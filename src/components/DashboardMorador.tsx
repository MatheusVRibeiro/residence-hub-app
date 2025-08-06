import React from 'react';
import { Bell, Calendar, Box, UserPlus, AlertTriangle, MessageSquareWarning, Home, Edit, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import styles from '../styles/DashboardMorador.module.css';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

// --- Tipos e Interfaces ---
type Tab = 'dashboard' | 'reservations' | 'notifications' | 'profile' | 'packages' | 'issues';
interface DashboardMoradorProps {
  onNavigate: (tab: Tab) => void;
}

// --- Dados Mockados ---
const morador = {
  nome: "Ana Clara",
  fotoUrl: "https://i.pravatar.cc/150?u=ana",
  condominio: "CondoWay Residence",
  notificacoesNaoLidas: 3,
};
const avisosImportantes = [
  {
    id: 1,
    titulo: "Manutenção programada do elevador",
    texto: "O elevador de serviço estará em manutenção na próxima sexta-feira, das 09:00 às 12:00.",
  },
  {
    id: 2,
    titulo: "Interrupção no Fornecimento de Água",
    texto: "Haverá uma interrupção no fornecimento de água amanhã para reparos na caixa d'água.",
  },
  {
    id: 3,
    titulo: "Dedetização nas Garagens",
    texto: "Favor não deixar veículos na garagem G1 no próximo sábado pela manhã.",
  }
];
const encomendas = { quantidade: 2 };
const ultimasAtualizacoes = {
  "Hoje": [
    { id: 1, tipo: 'reservations', icone: Calendar, texto: "Sua reserva do Salão de Festas foi confirmada.", hora: "14:30" },
    { id: 2, tipo: 'packages', icone: Box, texto: "Nova encomenda registrada na portaria.", hora: "11:15" },
  ],
  "Ontem": [
    { id: 3, tipo: 'notifications', icone: AlertTriangle, texto: "Aviso geral: Reunião do conselho amanhã.", hora: "18:00" },
    { id: 4, tipo: 'profile', icone: CheckCircle, texto: "Boleto do condomínio foi pago com sucesso.", hora: "09:10" },
  ]
};

// --- Componente Principal da Dashboard ---
export const DashboardMorador: React.FC<DashboardMoradorProps> = ({ onNavigate }) => {

  return (
    <div className={`${styles.dashboardContainer} pb-20`}>
      <div className="max-w-md mx-auto p-4 space-y-6">
        <header className="flex justify-between items-center pt-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Boa noite, {morador.nome}! 👋</h1>
            <p className="text-sm text-gray-500">{morador.condominio}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => onNavigate('notifications')}>
              <Bell className="h-6 w-6 text-gray-600" />
              {morador.notificacoesNaoLidas > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] items-center justify-center">{morador.notificacoesNaoLidas}</span>
                </span>
              )}
            </Button>
            <Avatar className="h-10 w-10">
              <img src={morador.fotoUrl} alt="Foto do perfil" className="object-cover" />
              <AvatarFallback>{morador.nome.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Carrossel de Avisos Importantes */}
        <Carousel className="w-full" opts={{ loop: true }} showDots={true} showArrows={false}>
          <CarouselContent>
            {avisosImportantes.map((aviso) => (
              <CarouselItem key={aviso.id}>
                <div className="bg-red-50 text-red-900 rounded-xl p-4 border-l-4 border-red-500 shadow-sm">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h2 className="font-bold">{aviso.titulo}</h2>
                      <p className="text-sm mt-1">{aviso.texto}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Ações Rápidas */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <AcaoCard icon={Calendar} title="Reservar Espaço" onClick={() => onNavigate('reservations')} />
            <AcaoCard icon={Box} title="Minhas Encomendas" badgeCount={encomendas.quantidade} onClick={() => onNavigate('packages')} />
            <AcaoCard icon={UserPlus} title="Liberar Visitante" />
            <AcaoCard icon={MessageSquareWarning} title="Abrir Ocorrência" onClick={() => onNavigate('issues')} />
          </div>
        </section>

        {/* Últimas Atualizações */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Últimas Atualizações</h2>
          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
            {Object.entries(ultimasAtualizacoes).map(([data, itens]) => (
              <div key={data}>
                <p className="text-xs font-bold text-gray-400 uppercase pb-2">{data}</p>
                <ul className="space-y-3">
                  {itens.map(item => {
                    const Icone = item.icone;
                    const isClickable = ['reservations', 'packages', 'notifications', 'issues', 'profile'].includes(item.tipo);
                     return (
                      <li key={item.id}>
                        <button disabled={!isClickable} onClick={() => isClickable && onNavigate(item.tipo as Tab)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 disabled:pointer-events-none transition-colors">
                            <div className="bg-gray-100 p-2 rounded-full"><Icone className="h-5 w-5 text-gray-600" /></div>
                            <div className="flex-1 text-left"><p className="text-sm text-gray-800">{item.texto}</p></div>
                            <p className="text-xs text-gray-400">{item.hora}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Componente Reutilizável para Ações
const AcaoCard = ({ icon: Icon, title, badgeCount = 0, onClick = () => {} }) => (
  <button onClick={onClick} className="relative text-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-full h-full flex flex-col items-center justify-center min-h-[110px]">
    {badgeCount > 0 && (
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{badgeCount}</span>
    )}
    <Icon className="h-8 w-8 text-blue-600 mb-2" />
    <span className="font-semibold text-gray-700 text-sm">{title}</span>
  </button>
);