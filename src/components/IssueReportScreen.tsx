import React, { useState } from 'react';
import { MessageSquareWarning, Building, MapPin, ShieldAlert, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";

export const IssueReportScreen = () => {
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baixa');
  const [locationType, setLocationType] = useState('area_comum');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [commonArea, setCommonArea] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação
    if (!description || !priority) {
      toast({ title: "Campos obrigatórios", description: "Por favor, descreva a ocorrência e selecione a prioridade.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Simula o envio para a API
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({ title: "Ocorrência enviada!", description: "Sua ocorrência foi registrada com sucesso." });
    
    // Limpa o formulário
    setDescription('');
    setPriority('baixa');
    setLocationType('area_comum');
    setBlock('');
    setFloor('');
    setCommonArea('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <MessageSquareWarning className="h-6 w-6 text-primary" />
            Registrar Ocorrência
          </h1>
          <p className="text-muted-foreground text-sm">Descreva o problema para que o síndico possa tomar uma providência.</p>
        </div>

        <Card className="app-card">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">O que está acontecendo?</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhadamente a situação..."
                  className="app-input min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Prioridade</Label>
                <RadioGroup value={priority} onValueChange={setPriority} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="baixa" id="p-baixa" />
                    <Label htmlFor="p-baixa">Baixa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="media" id="p-media" />
                    <Label htmlFor="p-media">Média</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alta" id="p-alta" />
                    <Label htmlFor="p-alta">Alta</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Local da Ocorrência</Label>
                <RadioGroup value={locationType} onValueChange={setLocationType} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="area_comum" id="loc-comum" />
                        <Label htmlFor="loc-comum">Área Comum</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unidade" id="loc-unidade" />
                        <Label htmlFor="loc-unidade">Unidade Específica</Label>
                    </div>
                </RadioGroup>
              </div>

              {locationType === 'unidade' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="block">Bloco</Label>
                    <Input id="block" placeholder="Ex: A" value={block} onChange={e => setBlock(e.target.value)} className="app-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Andar/Apto</Label>
                    <Input id="floor" placeholder="Ex: 502" value={floor} onChange={e => setFloor(e.target.value)} className="app-input" />
                  </div>
                </div>
              )}

              {locationType === 'area_comum' && (
                 <div className="space-y-2 animate-in fade-in duration-300">
                    <Label htmlFor="common-area">Qual área?</Label>
                    <Input id="common-area" placeholder="Ex: Piscina, Garagem..." value={commonArea} onChange={e => setCommonArea(e.target.value)} className="app-input" />
                 </div>
              )}

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous-switch" className="text-base">Envio Anônimo</Label>
                  <p className="text-xs text-muted-foreground">Seu nome não será revelado ao síndico.</p>
                </div>
                <Switch id="anonymous-switch" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              </div>

              <Button type="submit" className="w-full app-button" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Ocorrência"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};