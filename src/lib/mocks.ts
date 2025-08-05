// src/lib/mocks.ts

export const userProfile = {
  name: "Ana Clara",
  email: "ana.clara@email.com",
  phone: "(11) 98765-4321",
  apartment: "Apto 72",
  block: "Bloco B",
  avatarUrl: "https://i.pravatar.cc/150?u=ana",
  initials: "AC",
  vehicles: [
    { id: 1, model: "Honda Civic", plate: "BRA2E19", type: "Carro" },
    { id: 2, model: "Honda PCX", plate: "RIO2A18", type: "Moto" },
  ],
  documents: [
    { id: 1, name: "Regimento Interno.pdf", category: "Regras" },
    { id: 2, name: "Ata da Última Assembleia.pdf", category: "Assembleias" },
  ]
};

export const environments = [
  { id: 1, name: "Salão de Festas", capacity: 50, description: "Espaço amplo para eventos.", available: true, rules: ["Limpeza obrigatória após o uso.", "Som permitido até as 22h."] },
  { id: 2, name: "Churrasqueira", capacity: 20, description: "Área gourmet com churrasqueira.", available: true, rules: ["Levar próprio carvão.", "Não deixar restos de comida."] },
  { id: 3, name: "Quadra de Tênis", capacity: 4, description: "Quadra oficial para esportes.", available: false, rules: ["Uso de calçado apropriado.", "Máximo de 1h por reserva."] },
];

export const initialReservations = [
  { id: 1, environmentName: "Salão de Festas", date: "2025-08-15", time: "19:00", confirmationCode: "FESTA-A7B2" },
  { id: 2, environmentName: "Churrasqueira", date: "2025-08-22", time: "12:00", confirmationCode: "CHURRAS-C3D9" }
];