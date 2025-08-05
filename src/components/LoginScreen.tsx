import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nomeCondominio = "CondoWay Residence";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    setIsLoading(true);
    await onLogin(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 animate-in fade-in duration-500">
        
        <div className="flex flex-col items-center space-y-3">
          <img src="/condoway-logo.png" alt="CondoWay Logo" className="h-20 w-auto" />
          <div className="text-center">
            <h1 className="font-bold text-2xl text-gray-800">Bem-vindo(a) ao</h1>
            <p className="font-semibold text-lg text-primary">{nomeCondominio}</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 app-input bg-gray-50"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 app-input bg-gray-50"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
              <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Lembrar-me</Label>
            </div>
            {/* CORREÇÃO APLICADA AQUI */}
            <Button type="button" variant="link" className="text-primary text-sm p-0 h-auto font-semibold" onClick={onForgotPassword}>
              Esqueci a senha?
            </Button>
          </div>

          <Button type="submit" className="w-full app-button text-base py-6 mt-4" disabled={isLoading}>
            {isLoading ? 
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> : 
              <><LogIn className="h-5 w-5 mr-2" /> Entrar</>
            }
          </Button>
        </form>
      </div>
    </div>
  );
};