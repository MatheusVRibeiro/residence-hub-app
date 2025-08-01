import React, { useMemo, useState } from 'react';
import { Package, PackageCheck, QrCode, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Tipos e Dados Mockados ---
type PackageStatus = 'awaiting_pickup' | 'delivered';
interface Pkg {
  id: number;
  store: string;
  trackingCode: string;
  status: PackageStatus;
  arrivalDate: string;
}

const allPackages: Pkg[] = [
  { id: 1, store: "Amazon", trackingCode: "AMZ987654321BR", status: "awaiting_pickup", arrivalDate: "Hoje, 11:15" },
  { id: 2, store: "Mercado Livre", trackingCode: "ML555444333BR", status: "awaiting_pickup", arrivalDate: "Ontem, 09:30" },
  { id: 3, store: "Shopee", trackingCode: "SHP123456789BR", status: "delivered", arrivalDate: "29/07/2024" },
  { id: 4, store: "AliExpress", trackingCode: "ALI998877665BR", status: "delivered", arrivalDate: "27/07/2024" },
  { id: 5, store: "Amazon", trackingCode: "AMZ112233445BR", status: "delivered", arrivalDate: "25/07/2024" },
];

// --- Componente do Card de Encomenda ---
const PackageCard = ({ pkg }: { pkg: Pkg }) => {
  const isAwaitingPickup = pkg.status === 'awaiting_pickup';

  // Simula um ícone de loja baseado no nome
  const getStoreIcon = (storeName: string) => {
    // Em um app real, você teria os SVGs das marcas
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
        {storeName.substring(0, 4)}
      </div>
    );
  };

  return (
    <Card className={`app-card transition-all duration-300 ${isAwaitingPickup ? 'border-primary border-l-4' : 'opacity-70'}`}>
      <CardContent className="p-4 flex items-center gap-4">
        {getStoreIcon(pkg.store)}
        <div className="flex-1">
          <p className="font-bold text-foreground">{pkg.store}</p>
          <p className="text-xs text-muted-foreground">Cód: {pkg.trackingCode}</p>
          <p className="text-xs text-muted-foreground">Chegou em: {pkg.arrivalDate}</p>
        </div>
        {isAwaitingPickup && (
          <div className="flex flex-col items-center gap-1 text-primary">
            <QrCode className="h-8 w-8" />
            <span className="text-xs font-semibold">Retirar</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Tela Principal ---
export const PackagesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPackages = useMemo(() => {
    return allPackages.filter(p =>
      p.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const awaitingPickup = filteredPackages.filter(p => p.status === 'awaiting_pickup');
  const delivered = filteredPackages.filter(p => p.status === 'delivered');

  const renderPackageList = (packages: Pkg[], emptyMessage: string) => {
    if (packages.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-12 px-4">
          <PackageCheck className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-sm text-gray-500">Você será notificado quando algo novo chegar.</p>
        </div>
      );
    }
    return packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Minhas Encomendas
          </h1>
          <p className="text-muted-foreground text-sm">Acompanhe os pacotes que chegaram para você.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por loja ou código..."
            className="app-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="awaiting" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="awaiting">
              Aguardando Retirada
              {awaitingPickup.length > 0 && <Badge className="ml-2">{awaitingPickup.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="delivered">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="awaiting" className="mt-6 space-y-4">
            {renderPackageList(awaitingPickup, "Nenhuma encomenda para retirar!")}
          </TabsContent>
          <TabsContent value="delivered" className="mt-6 space-y-4">
            {renderPackageList(delivered, "Seu histórico de retiradas está vazio.")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};