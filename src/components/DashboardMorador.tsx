import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Box, UserPlus, AlertTriangle, MessageSquareWarning, Megaphone, Home, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import styles from '../styles/DashboardMorador.module.css';

// --- Interface de Props (para TypeScript) ---
interface DashboardMoradorProps {
  onNavigate: (tab: 'dashboard' | 'reservations' | 'notifications' | 'profile' | 'packages' | 'issues') => void;
}

// --- Componentes Reutilizáveis ---
const AcaoCard = ({ icon: Icon, title, badgeCount = 0, onClick = () => {} }) => (
  <button onClick={onClick} className="relative text-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-full h-full flex flex-col items-center justify-center">
    {badgeCount > 0 && (
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {badgeCount}
      </span>
    )}
    <Icon className="h-8 w-8 text-blue-600 mb-2" />
    <span className="font-semibold text-gray-700 text-sm">{title}</span>
  </button>
);

// --- Componente Principal ---
export const DashboardMorador: React.FC<DashboardMoradorProps> = ({ onNavigate }) => {
  const [saudacao, setSaudacao] = useState('');

  // Mock de Dados
  const morador = {
    nome: "Ana Clara", fotoUrl: "https://i.pravatar.cc/150?u=ana", condominio: "CondoWay Residence", bloco: "Bloco B", apartamento: "72", notificacoesNaoLidas: 3,
  };
  const avisoImportante = {
    titulo: "Manutenção programada do elevador", texto: "O elevador de serviço estará em manutenção na próxima sexta-feira, das 09:00 às 12:00.",
  };
  const encomendas = { quantidade: 2 };
  const ultimasAtualizacoes = [
    { id: 1, tipo: 'reserva', icone: Calendar, texto: "Sua reserva do Salão de Festas foi confirmada.", data: "Hoje, 14:30" },
    { id: 2, tipo: 'encomenda', icone: Box, texto: "Nova encomenda registrada na portaria.", data: "Hoje, 11:15" },
    { id: 3, tipo: 'aviso', icone: Megaphone, texto: "Aviso geral: Reunião do conselho amanhã.", data: "Ontem, 18:00" },
  ];

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');
  }, []);

  return (
    <div className={`${styles.dashboardContainer} pb-20`}>
      <div className="max-w-md mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{saudacao}, {morador.nome}! 👋</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
              <Building className="h-4 w-4" /> <span>{morador.condominio}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => onNavigate('notifications')}>
              <Bell className="h-6 w-6 text-gray-600" />
              {morador.notificacoesNaoLidas > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">{morador.notificacoesNaoLidas}</span>
              )}
            </Button>
            <img src={morador.fotoUrl} alt="Foto do perfil" className="h-10 w-10 rounded-full object-cover"/>
          </div>
        </header>
        <div className="bg-red-100 border border-red-200 text-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 text-red-600" />
            <div className="flex-1">
              <h2 className="font-bold">{avisoImportante.titulo}</h2>
              <p className="text-sm mt-1">{avisoImportante.texto}</p>
            </div>
          </div>
        </div>
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <AcaoCard icon={Calendar} title="Reservar Espaço" onClick={() => onNavigate('reservations')} />
            <AcaoCard icon={Box} title="Minhas Encomendas" badgeCount={encomendas.quantidade} onClick={() => onNavigate('packages')} />
            <AcaoCard icon={UserPlus} title="Liberar Visitante" />
            <AcaoCard icon={MessageSquareWarning} title="Abrir Ocorrência" onClick={() => onNavigate('issues')} />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Últimas Atualizações</h2>
          <div className="bg-white rounded-xl shadow-md p-4">
            <ul className="space-y-3">
              {ultimasAtualizacoes.map(item => {
                const Icone = item.icone;
                return (
                  <li key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                    <div className="bg-gray-100 p-2 rounded-full"><Icone className="h-5 w-5 text-gray-600" /></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{item.texto}</p>
                      <p className="text-xs text-gray-500">{item.data}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="text-center mt-3">
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Ver mais</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};