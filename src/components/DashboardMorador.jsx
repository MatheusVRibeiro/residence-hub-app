import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Box, UserPlus, AlertTriangle, MessageSquareWarning, Megaphone, Home, Building } from 'lucide-react';
import styles from '../styles/DashboardMorador.module.css'; // Importando o CSS Module

// --- Componentes Reutilizáveis ---

// Card para a seção de Ações Rápidas
const AcaoCard = ({ icon: Icon, title, badgeCount, onClick }) => (
  <button onClick={onClick} className="relative text-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-full h-full flex flex-col items-center justify-center">
    {badgeCount > 0 && (
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {badgeCount}
      </span>
    )}
    <Icon className="h-10 w-10 text-blue-600 mb-2" />
    <span className="font-semibold text-gray-700 text-sm">{title}</span>
  </button>
);

// --- Componente Principal ---

export const DashboardMorador = () => {
  const [saudacao, setSaudacao] = useState('');

  // --- Mock de Dados (simulando uma API) ---
  const morador = {
    nome: "Ana Clara",
    fotoUrl: "https://i.pravatar.cc/150?u=ana", // Placeholder para foto
    condominio: "CondoWay Residence",
    bloco: "Bloco B",
    apartamento: "72",
    notificacoesNaoLidas: 3,
  };

  const avisoImportante = {
    titulo: "Manutenção programada do elevador",
    texto: "O elevador de serviço estará em manutenção na próxima sexta-feira, das 09:00 às 12:00. Utilize o elevador social durante este período.",
  };

  const encomendas = {
    quantidade: 2,
  };

  const ultimasAtualizacoes = [
    { id: 1, tipo: 'reserva', icone: Calendar, texto: "Sua reserva do Salão de Festas foi confirmada.", data: "Hoje, 14:30" },
    { id: 2, tipo: 'encomenda', icone: Box, texto: "Nova encomenda registrada na portaria.", data: "Hoje, 11:15" },
    { id: 3, tipo: 'aviso', icone: Megaphone, texto: "Aviso geral: Reunião do conselho amanhã.", data: "Ontem, 18:00" },
  ];

  // Efeito para definir a saudação dinâmica
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      setSaudacao('Bom dia');
    } else if (hora >= 12 && hora < 18) {
      setSaudacao('Boa tarde');
    } else {
      setSaudacao('Boa noite');
    }
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* 1. Cabeçalho */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{saudacao}, {morador.nome}! 👋</h1>
            <div className="flex items-center gap-4 text-gray-500 mt-2">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                <span>{morador.condominio}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                <span>{morador.bloco} / Apto {morador.apartamento}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-7 w-7 text-gray-600 cursor-pointer" />
              {morador.notificacoesNaoLidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {morador.notificacoesNaoLidas}
                </span>
              )}
            </div>
            <img 
              src={morador.fotoUrl} 
              alt="Foto do perfil" 
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        </header>

        {/* 2. Aviso Importante */}
        <div className="bg-red-100 border border-red-200 text-red-800 rounded-xl p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 mr-3 mt-1 text-red-600" />
            <div className="flex-1">
              <h2 className="font-bold text-lg">{avisoImportante.titulo}</h2>
              <p className="mt-1">{avisoImportante.texto}</p>
            </div>
          </div>
          <div className="text-right mt-2">
             <button className="font-semibold text-red-700 hover:text-red-900 transition-colors">Ver todos os avisos</button>
          </div>
        </div>

        {/* 3. Ações Rápidas */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AcaoCard icon={Calendar} title="Reservar Espaço" />
            <AcaoCard icon={Box} title="Minhas Encomendas" badgeCount={encomendas.quantidade} />
            <AcaoCard icon={UserPlus} title="Liberar Visitante" />
            <AcaoCard icon={MessageSquareWarning} title="Abrir Ocorrência" />
          </div>
        </section>

        {/* 4. Últimas Atualizações */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Últimas Atualizações</h2>
          <div className="bg-white rounded-xl shadow-md p-4">
            <ul className="space-y-4">
              {ultimasAtualizacoes.map(item => {
                const Icone = item.icone;
                return (
                  <li key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Icone className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{item.texto}</p>
                      <p className="text-sm text-gray-500">{item.data}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="text-center mt-4">
              <button className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Ver mais</button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};