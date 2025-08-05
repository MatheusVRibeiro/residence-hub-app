import React from 'react';
import { User, Car, FileText, Settings, HelpCircle, LogOut, ChevronRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InfoItem } from "./InfoItem";
import { ActionList } from "./ActionList";
import { userProfile } from '@/lib/mocks'; // Importação dos dados mockados

interface ProfileScreenProps {
  userEmail: string;
  onLogout: () => void;
}

export const ProfileScreen = ({ onLogout }: ProfileScreenProps) => {

  const profileActions = [
    {
      label: 'Configurações',
      icon: Settings,
      onClick: () => console.log('Configurações clicked'),
    },
    {
      label: 'Ajuda e Suporte',
      icon: HelpCircle,
      onClick: () => console.log('Ajuda e Suporte clicked'),
    },
    {
      label: 'Sair da Conta',
      icon: LogOut,
      onClick: onLogout,
      variant: 'destructive' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Cabeçalho do Perfil */}
        <div className="flex flex-col items-center space-y-2 pt-4">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
              {userProfile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
            <p className="text-muted-foreground">{userProfile.apartment} - {userProfile.block}</p>
          </div>
        </div>

        {/* Seções com Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {/* Meus Dados */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" /> Meus Dados
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <InfoItem icon={Mail} value={userProfile.email} />
              <InfoItem icon={Phone} value={userProfile.phone} />
            </AccordionContent>
          </AccordionItem>

          {/* Meus Veículos */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" /> Meus Veículos
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              {userProfile.vehicles.map(vehicle => (
                <div key={vehicle.id} className="p-3 rounded-lg bg-background border border-border flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground text-sm">{vehicle.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                  </div>
                  <Badge variant="outline">{vehicle.type}</Badge>
                </div>
              ))}
               <Button variant="outline" size="sm" className="w-full mt-2">Adicionar Veículo</Button>
            </AccordionContent>
          </AccordionItem>

          {/* Documentos */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" /> Documentos
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
               {userProfile.documents.map(doc => (
                <div key={doc.id} className="p-3 rounded-lg bg-background border border-border flex justify-between items-center cursor-pointer hover:bg-primary/5">
                  <div>
                    <p className="font-medium text-foreground text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.category}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Botões de Ação */}
        <ActionList actions={profileActions} />
      </div>
    </div>
  );
};