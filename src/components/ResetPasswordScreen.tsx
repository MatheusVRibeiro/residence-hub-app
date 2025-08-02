import React, { useState } from 'react';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ResetPasswordScreenProps {
  onPasswordReset: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ onPasswordReset }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setIsLoading(true);
    
    // SIMULAÇÃO: A API valida o token da URL e atualiza a senha no banco de dados.
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Senha redefinida com sucesso!", { description: "Você já pode entrar com sua nova senha." });
    setIsLoading(false);
    onPasswordReset(); // Leva o usuário de volta para a tela de login
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins animate-in fade-in duration-500">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
            <KeyRound className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-bold text-2xl text-gray-800">Crie sua Nova Senha</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Escolha uma senha forte e segura para proteger sua conta.
            </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="password">Nova Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 app-input bg-gray-50" required />
              <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 app-input bg-gray-50" required />
            </div>
          </div>

          <Button type="submit" className="w-full app-button text-base py-6 mt-2" disabled={isLoading}>
            {isLoading ? 
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> : 
              <>Redefinir Senha</>
            }
          </Button>
        </form>
      </div>
    </div>
  );
};