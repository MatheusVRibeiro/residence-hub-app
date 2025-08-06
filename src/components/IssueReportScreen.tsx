import React, { useState, useRef } from 'react';
import { MessageSquareWarning, Droplet, Volume2, Lightbulb, FileImage, ArrowLeft, CheckCircle, ListChecks, MessageCircle, Trash2, HardHat, User, Building, Info, Send } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Tipos e Interfaces ---
type Step = 1 | 2 | 3;
type Category = "Vazamento" | "Barulho" | "Iluminação" | "Limpeza e Higiene" | "Infraestrutura" | "Outro Problema";
type IssueStatus = "Enviada" | "Em Análise" | "Resolvida";
type Priority = "baixa" | "media" | "alta";
interface Comment {
  author: "Morador" | "Síndico";
  text: string;
  date: string;
}
interface Issue {
  id: number;
  protocol: string;
  category: Category | null;
  title: string;
  description: string;
  location: string;
  date: string;
  status: IssueStatus;
  priority: Priority;
  comments: Comment[];
  fileName?: string;
}

// --- Componentes ---
const CategoryCard = ({ icon: Icon, title, onClick }: { icon: React.ElementType, title: Category, onClick: () => void }) => (
  <Card className="app-card text-center p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200" onClick={onClick}>
    <CardContent className="p-0 flex flex-col items-center justify-center gap-2 h-full">
      <Icon className="h-8 w-8 text-primary mb-2" />
      <span className="font-semibold text-foreground text-sm leading-tight">{title}</span>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: IssueStatus }) => {
    const statusStyles = {
        "Enviada": "bg-blue-100 text-blue-800 border-blue-200",
        "Em Análise": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "Resolvida": "bg-green-100 text-green-800 border-green-200",
    };
    return <Badge className={cn("capitalize", statusStyles[status])}>{status}</Badge>;
};

const PriorityIndicator = ({ priority }: { priority: Priority }) => {
    const priorityStyles = {
        "baixa": "bg-green-500",
        "media": "bg-yellow-500",
        "alta": "bg-red-500",
    };
    return <span className={cn("h-2.5 w-2.5 rounded-full", priorityStyles[priority])} />;
}

const CommentBubble = ({ comment }: { comment: Comment }) => {
    const isMorador = comment.author === "Morador";
    const Icon = isMorador ? User : Building;

    return (
        <div className={cn("flex flex-col gap-1", isMorador ? "items-end" : "items-start")}>
            <div className="flex items-center gap-2">
                {!isMorador && <Icon className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-semibold text-foreground">{comment.author}</span>
                {isMorador && <Icon className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className={cn(
                "w-fit max-w-[85%] rounded-lg px-3 py-2",
                isMorador ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
                <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                <p className={cn("text-xs mt-1 text-right", isMorador ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {comment.date}
                </p>
            </div>
        </div>
    );
};


// --- Tela Principal ---
export const IssueReportScreen = () => {
  const [activeTab, setActiveTab] = useState("registrar");
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('baixa');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleCategorySelect = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setTitle(selectedCategory !== 'Outro Problema' ? selectedCategory : '');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const finalTitle = category === 'Outro Problema' ? title : category;
    if (!finalTitle || !description || !priority || !location) {
      toast.error("Campos obrigatórios", { description: "Por favor, preencha todos os campos." });
      setIsLoading(false);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newIssue: Issue = {
        id: Date.now(),
        protocol: `OCO-${Date.now().toString().slice(-6)}`,
        category, title: finalTitle, description, location, fileName: fileName || undefined,
        priority,
        date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: "Enviada",
        comments: [{ author: "Morador", text: description, date: new Date().toLocaleString('pt-BR') }]
    };
    setMyIssues(prev => [newIssue, ...prev]);
    setIsLoading(false);
    setStep(3);
  };
  
  const resetForm = () => {
      setStep(1); setCategory(null); setTitle(''); setDescription('');
      setPriority('baixa'); setLocation(''); setIsAnonymous(true); setFileName(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      setActiveTab("minhas-ocorrencias");
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFileName(e.target.files[0].name);
      }
  };
  
  const handleSindicoAction = (issueId: number, newStatus: IssueStatus, commentText: string) => {
      setMyIssues(prev => prev.map(issue => {
          if (issue.id === issueId) {
              const newComment: Comment = { author: "Síndico", text: commentText, date: new Date().toLocaleString('pt-BR') };
              return { ...issue, status: newStatus, comments: [...issue.comments, newComment] };
          }
          return issue;
      }));
      toast.info(`O status da ocorrência foi atualizado.`);
  };

  const handleAddComment = (issueId: number) => {
    if(!newComment) return;
     setMyIssues(prev => prev.map(issue => {
          if (issue.id === issueId) {
              const comment: Comment = { author: "Morador", text: newComment, date: new Date().toLocaleString('pt-BR') };
              return { ...issue, comments: [...issue.comments, comment] };
          }
          return issue;
      }));
      setNewComment('');
      toast.success("Seu comentário foi adicionado.");
  }

  // --- Renderização ---
  const renderRegisterContent = () => {
    if (step === 1) {
        return (
          <div className="text-center space-y-2 pt-4 mb-6 animate-in fade-in"><h2 className="text-xl font-bold text-foreground">Novo Registro</h2><p className="text-muted-foreground text-sm">Qual o tipo de problema que você quer relatar?</p><div className="grid grid-cols-2 gap-4 pt-4"><CategoryCard icon={Droplet} title="Vazamento" onClick={() => handleCategorySelect("Vazamento")} /><CategoryCard icon={Volume2} title="Barulho" onClick={() => handleCategorySelect("Barulho")} /><CategoryCard icon={Lightbulb} title="Iluminação" onClick={() => handleCategorySelect("Iluminação")} /><CategoryCard icon={Trash2} title="Limpeza e Higiene" onClick={() => handleCategorySelect("Limpeza e Higiene")} /><CategoryCard icon={HardHat} title="Infraestrutura" onClick={() => handleCategorySelect("Infraestrutura")} /><CategoryCard icon={MessageSquareWarning} title="Outro Problema" onClick={() => handleCategorySelect("Outro Problema")} /></div></div>
        );
    }
    
    if (step === 3) {
        return (
          <div className="text-center space-y-4 py-12 animate-in fade-in"><CheckCircle className="h-16 w-16 text-green-500 mx-auto" /><h1 className="text-2xl font-bold text-foreground">Ocorrência Enviada!</h1><p className="text-muted-foreground">O síndico foi notificado. Você pode acompanhar o registro na aba "Minhas Ocorrências".</p><div className="pt-4"><Button onClick={resetForm} className="w-full app-button">Ver minhas ocorrências</Button></div></div>
        )
    }

    return (
        <div className="w-full animate-in fade-in">
            <div className="flex items-center gap-4 mb-4"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep(1)}><ArrowLeft className="h-5 w-5" /></Button><div className="text-left"><h2 className="text-xl font-bold text-foreground">Detalhes da Ocorrência</h2></div></div>
            <Card className="app-card w-full shadow-none border-none">
              <form onSubmit={handleSubmit}>
                <CardContent className="p-0 space-y-6">
                  {category === "Outro Problema" && (<div className="space-y-2"><Label htmlFor="title" className="font-semibold">Assunto</Label><Input id="title" placeholder="Digite um título..." className="app-input" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>)}
                  <div className="space-y-2"><Label htmlFor="description" className="font-semibold">Descrição Detalhada</Label><Textarea id="description" placeholder="Descreva com detalhes o que está acontecendo..." className="app-input min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} required /><p className="text-xs text-muted-foreground">Quanto mais detalhes, mais rápida será a solução.</p></div>
                  <div className="space-y-2"><Label htmlFor="location" className="font-semibold">Local Específico</Label><Input id="location" placeholder="Ex: Piscina, Garagem Bloco B..." value={location} onChange={e => setLocation(e.target.value)} className="app-input" required /></div>
                  <div className="space-y-3"><div className="flex items-center gap-2"><Label className="font-semibold">Prioridade</Label><TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5"><Info className="h-4 w-4 text-muted-foreground"/></Button></TooltipTrigger><TooltipContent className="max-w-xs" side="top"><div className="text-sm font-normal"><p><b>Alta:</b> Risco à segurança (ex: vazamento de gás).</p><p><b>Média:</b> Afeta o conforto (ex: lâmpada queimada).</p><p><b>Baixa:</b> Sugestões ou problemas menores.</p></div></TooltipContent></Tooltip></TooltipProvider></div><RadioGroup value={priority} onValueChange={(value) => setPriority(value as Priority)} className="flex gap-4 pt-1"><div className="flex items-center space-x-2"><RadioGroupItem value="baixa" id="p-baixa" /><Label htmlFor="p-baixa">Baixa</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="media" id="p-media" /><Label htmlFor="p-media">Média</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="alta" id="p-alta" /><Label htmlFor="p-alta">Alta</Label></div></RadioGroup></div>
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><Label htmlFor="anonymous-switch">Envio Anônimo</Label><p className="text-xs text-muted-foreground">Seu nome não será revelado.</p></div><Switch id="anonymous-switch" checked={isAnonymous} onCheckedChange={setIsAnonymous} /></div>
                  <div className="space-y-2"><Label htmlFor="file-upload" className="font-semibold">Anexar Mídia (Opcional)</Label><Button asChild variant="outline" className="w-full cursor-pointer"><label htmlFor="file-upload" className="flex items-center justify-center gap-2"><FileImage className="h-4 w-4" />Adicionar foto ou vídeo<Input id="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} /></label></Button>{fileName && <p className="text-xs text-muted-foreground text-center">Arquivo selecionado: {fileName}</p>}</div>
                </CardContent>
                <CardFooter className="p-0 pt-6"><Button type="submit" className="w-full app-button text-base py-6" disabled={isLoading}>{isLoading ? "Enviando..." : "Enviar Ocorrência"}</Button></CardFooter>
              </form>
            </Card>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-2 pt-4 mb-6"><h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2"><MessageSquareWarning className="h-6 w-6 text-primary" />Ocorrências</h1></div>
        
        {step === 1 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="registrar">Registrar Nova</TabsTrigger><TabsTrigger value="minhas-ocorrencias">Minhas Ocorrências{myIssues.length > 0 && <Badge className="ml-2">{myIssues.length}</Badge>}</TabsTrigger></TabsList>
                <TabsContent value="registrar" className="mt-6">
                  {renderRegisterContent()}
                </TabsContent>
                <TabsContent value="minhas-ocorrencias" className="mt-6">
                  {myIssues.length > 0 ? (<Accordion type="single" collapsible className="w-full space-y-3">{myIssues.map((issue) => (<AccordionItem key={issue.id} value={`issue-${issue.id}`} className="app-card rounded-xl border"><AccordionTrigger className="p-4 text-left hover:no-underline"><div className="w-full"><div className="flex justify-between items-center w-full"><div className="flex items-center gap-2"><PriorityIndicator priority={issue.priority} /><p className="font-semibold text-foreground text-base">{issue.title}</p></div><StatusBadge status={issue.status} /></div><p className="text-xs text-muted-foreground mt-1">Protocolo: {issue.protocol}</p></div></AccordionTrigger><AccordionContent className="px-4 pb-4"><div className="border-t pt-4 space-y-4"><div><h4 className="font-semibold text-sm mb-4">Histórico da Ocorrência</h4><div className="space-y-4">{issue.comments.map((comment, index) => (<CommentBubble key={index} comment={comment}/>))}</div></div><div className="space-y-2 pt-2"><Label htmlFor={`new-comment-${issue.id}`}>Adicionar Comentário</Label><div className="flex items-center gap-2"><Textarea id={`new-comment-${issue.id}`} placeholder="Digite sua mensagem..." className="app-input flex-1" onChange={(e) => setNewComment(e.target.value)} /><Button size="icon" onClick={() => handleAddComment(issue.id)}><Send className="h-4 w-4" /></Button></div></div>{issue.status !== 'Resolvida' && (<div className="space-y-2 border-t pt-4"><p className="text-xs font-semibold text-center text-muted-foreground">Ações do Síndico (Simulação)</p><div className="flex gap-2"><Button size="sm" variant="outline" className="flex-1" onClick={() => handleSindicoAction(issue.id, "Em Análise", "Recebemos sua ocorrência e nossa equipe já está analisando.")}>Analisar</Button><Button size="sm" variant="outline" className="flex-1" onClick={() => handleSindicoAction(issue.id, "Resolvida", "O problema foi resolvido. Agradecemos o contato.")}>Resolver</Button></div></div>)}</div></AccordionContent></AccordionItem>))}</Accordion>) : (<div className="text-center text-muted-foreground py-12 px-4 animate-in fade-in"><ListChecks className="mx-auto h-12 w-12 text-gray-300" /><h3 className="mt-2 text-sm font-semibold text-foreground">Nenhuma ocorrência registrada</h3><p className="mt-1 text-sm text-gray-500">Use a aba ao lado para abrir seu primeiro chamado.</p><Button className="mt-4" onClick={() => setActiveTab('registrar')}>+ Registrar Minha Primeira Ocorrência</Button></div>)}
                </TabsContent>
            </Tabs>
        )}
        
        {step !== 1 && (
            renderRegisterContent()
        )}
      </div>
    </div>
  );
};