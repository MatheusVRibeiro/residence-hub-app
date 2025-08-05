import { useState } from 'react';
import { toast } from "sonner";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de uma chamada de API de login
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (password !== "123456") {
        throw new Error("Senha incorreta");
      }
      toast.success("Login realizado com sucesso!", { description: "Bem-vindo(a)!" });
      setUserEmail(email);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      toast.error("E-mail ou senha incorretos", { description: "Verifique seus dados." });
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  return {
    isLoggedIn,
    userEmail,
    login,
    logout,
  };
};