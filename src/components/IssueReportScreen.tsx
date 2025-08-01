import React, { useState } from 'react';
import { MessageSquareWarning, Droplet, Volume2, Lightbulb, FileImage } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";

export const IssueReportScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baixa');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const quickSuggestions = [
    { label: "Vazamento", icon: Droplet },
    { label: "Barulho", icon: Volume2 },
    { label: "Iluminação", icon: Lightbulb },
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !description || !priority || !location) {
      toast.error("Campos obrigatórios", { description: "Por favor, preencha todos os campos para registrar a ocorrência." });
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Ocorrência enviada!", { description: "Sua ocorrência foi registrada com sucesso e encaminhada ao síndico." });
    
    setTitle('');
    setDescription('');
    setPriority('baixa');
    setLocation('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-2 pt-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <MessageSquareWarning className="h-6 w-6 text-primary" />
            Registrar Ocorrência
          </h1>
          <p className="text-muted-foreground text-sm">Descreva o problema para que o síndico possa tomar uma providência.</p>
        </div>

        <Card className="app-card w-full">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-4 md:p-6 space-y-6">
              {/* Assunto da Ocorrência */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">Assunto</Label>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map(suggestion => (
                    <Button key={suggestion.label} type="button" variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleSuggestionClick(suggestion.label)}>
                      <suggestion.icon className="h-4 w-4 mr-2" />
                      {suggestion.label}
                    </Button>
                  ))}
                </div>
                <Input
                  id="title"
                  placeholder="Ou digite um título para a ocorrência..."
                  className="app-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Detalhes da Ocorrência */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">Descrição Detalhada</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva com detalhes o que está acontecendo..."
                  className="app-input min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              {/* Local da Ocorrência */}
              <div className="space-y-2">
                <Label htmlFor="location" className="font-semibold">Local</Label>
                <Input id="location" placeholder="Ex: Piscina, Garagem Bloco B, Apto 502..." value={location} onChange={e => setLocation(e.target.value)} className="app-input" required />
              </div>

              {/* Prioridade */}
              <div className="space-y-3">
                <Label className="font-semibold">Prioridade</Label>
                <RadioGroup value={priority} onValueChange={setPriority} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="baixa" id="p-baixa" /><Label htmlFor="p-baixa">Baixa</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="media" id="p-media" /><Label htmlFor="p-media">Média</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="alta" id="p-alta" /><Label htmlFor="p-alta">Alta</Label></div>
                </RadioGroup>
              </div>

              {/* Envio Anônimo */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous-switch">Envio Anônimo</Label>
                  <p className="text-xs text-muted-foreground">Seu nome não será revelado.</p>
                </div>
                <Switch id="anonymous-switch" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full app-button text-base py-6" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Ocorrência"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};