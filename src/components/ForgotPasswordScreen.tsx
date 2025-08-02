import React, { useState } from 'react';
import { Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, informe seu e-mail de cadastro.");
      return;
    }
    setIsLoading(true);

    // SIMULAÇÃO: A API verifica o e-mail e envia o link mágico.
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true); // Mostra a tela de confirmação
  };

  // Tela 1: Formulário para inserir o e-mail
  if (!isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins animate-in fade-in duration-500">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-bold text-2xl text-gray-800">Recuperar Senha</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Insira seu e-mail e enviaremos um link seguro para você redefinir sua senha.
            </p>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-gray-600 text-sm font-medium">E-mail Cadastrado</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 app-input bg-gray-50"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full app-button text-base py-6" disabled={isLoading}>
              {isLoading ?
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> :
                <><Send className="h-5 w-5 mr-2" /> Enviar Link de Recuperação</>
              }
            </Button>
          </form>
          <div className="text-center">
            <Button variant="link" className="text-sm text-primary" onClick={onBackToLogin}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela 2: Confirmação de envio do link
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins animate-in fade-in duration-500">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <div>
            <h1 className="font-bold text-2xl text-gray-800">Link Enviado!</h1>
            <p className="text-muted-foreground mt-2 text-sm">
                Enviamos um link seguro para o e-mail <strong>{email}</strong>. Por favor, verifique sua caixa de entrada e spam.
            </p>
        </div>
        <Button className="w-full app-button text-base py-6" onClick={onBackToLogin}>
          Voltar para o Login
        </Button>
      </div>
    </div>
  );
};