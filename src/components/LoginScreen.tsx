import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Exemplo do nome do condomínio
  const nomeCondominio = "CondoWay Residence";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (password !== "123456") {
        throw new Error("Senha incorreta");
      }
      toast.success("Login realizado com sucesso!", { description: "Bem-vindo de volta!" });
      onLogin(email);
    } catch (err) {
      toast.error("E-mail ou senha incorretos", { description: "Por favor, verifique seus dados e tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {/* 1. LOGOTIPO AUMENTADO */}
          <img src="/condoway-logo.png" alt="CondoWay Logo" className="mx-auto h-24 w-auto" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#333]">Entrar</h1>
          {/* 2. NOME DO CONDOMÍNIO EM DESTAQUE */}
          <div className="flex items-center justify-center gap-2 mt-3 text-gray-500">
             <Building className="h-5 w-5" />
             <p className="font-semibold">{nomeCondominio}</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 app-input bg-gray-50" autoComplete="email" aria-label="Campo de e-mail"/>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password"className="text-gray-700">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 app-input bg-gray-50" autoComplete="current-password" aria-label="Campo de senha"/>
              <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:bg-gray-100" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          <div className="text-right">
            <Button variant="link" className="text-primary text-sm p-0 h-auto font-semibold">Esqueci minha senha</Button>
          </div>

          <Button type="submit" className="w-full app-button text-base py-6" disabled={isLoading} aria-label="Entrar na conta">
            {isLoading ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>) : (<><LogIn className="h-5 w-5 mr-2" />Entrar</>)}
          </Button>
        </form>
        
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Ou continue com</span></div>
        </div>
        <div>
            <Button variant="outline" className="w-full text-base py-6" disabled>Google (em breve)</Button>
        </div>

      </div>
    </div>
  );
};