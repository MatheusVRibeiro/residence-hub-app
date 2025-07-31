import React from 'react';
import { Package, PackageCheck, PackageSearch, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Mock Data ---
const packages = [
  { id: 1, store: "Amazon", trackingCode: "AMZ987654321BR", status: "delivered", arrivalDate: "Hoje, 11:15" },
  { id: 2, store: "Shopee", trackingCode: "SHP123456789BR", status: "delivered", arrivalDate: "Ontem, 16:30" },
  { id: 3, store: "Mercado Livre", trackingCode: "ML555444333BR", status: "awaiting_pickup", arrivalDate: "28/07/2024" },
  { id: 4, store: "AliExpress", trackingCode: "ALI998877665BR", status: "awaiting_pickup", arrivalDate: "27/07/2024" },
];

const getStatusInfo = (status: 'delivered' | 'awaiting_pickup') => {
  switch (status) {
    case 'delivered':
      return { text: "Retirado", variant: "secondary", icon: PackageCheck };
    case 'awaiting_pickup':
      return { text: "Aguardando Retirada", variant: "default", icon: PackageSearch };
    default:
      return { text: "Desconhecido", variant: "secondary", icon: Package };
  }
};

export const PackagesScreen = () => {
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

        <div className="space-y-4">
          {packages.map((pkg) => {
            const statusInfo = getStatusInfo(pkg.status as any);
            const IconComponent = statusInfo.icon;

            return (
              <Card key={pkg.id} className={`app-card ${pkg.status === 'awaiting_pickup' ? 'border-l-4 border-l-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full bg-background border border-border mt-1`}>
                        <IconComponent className={`h-6 w-6 ${pkg.status === 'awaiting_pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-foreground">{pkg.store}</h3>
                            <Badge variant={statusInfo.variant as any}>{statusInfo.text}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Cód: {pkg.trackingCode}</p>
                        <div className="flex items-center text-xs text-muted-foreground pt-1">
                            <Clock className="h-3 w-3 mr-1.5" />
                            Chegou em: {pkg.arrivalDate}
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};