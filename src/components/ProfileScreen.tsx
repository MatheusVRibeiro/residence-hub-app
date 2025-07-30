import { User, MapPin, Phone, Mail, CreditCard, Settings, LogOut, Bell, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProfileScreenProps {
  userEmail: string;
  onLogout: () => void;
}

export const ProfileScreen = ({ userEmail, onLogout }: ProfileScreenProps) => {
  const userName = userEmail.split('@')[0];
  const userInitials = userName.slice(0, 2).toUpperCase();

  // Mock data - em produção, viria da API
  const userInfo = {
    name: "João Silva Santos",
    email: userEmail,
    phone: "(11) 99999-9999",
    apartment: "Apto 502 - Bloco A",
    building: "Residencial Jardim das Flores",
    memberSince: "Janeiro 2022"
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-4">
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{userInfo.name}</h1>
            <p className="text-muted-foreground">{userInfo.apartment}</p>
            <p className="text-sm text-muted-foreground">{userInfo.building}</p>
          </div>
        </div>

        {/* Informações Pessoais */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">E-mail</p>
                <p className="text-xs text-muted-foreground">{userInfo.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Telefone</p>
                <p className="text-xs text-muted-foreground">{userInfo.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Endereço</p>
                <p className="text-xs text-muted-foreground">{userInfo.apartment}</p>
                <p className="text-xs text-muted-foreground">{userInfo.building}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Membro desde</p>
                <p className="text-xs text-muted-foreground">{userInfo.memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Notificações Push</p>
                  <p className="text-xs text-muted-foreground">Receber avisos importantes</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">E-mail</p>
                  <p className="text-xs text-muted-foreground">Receber avisos por e-mail</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Autenticação Biométrica</p>
                  <p className="text-xs text-muted-foreground">Login com impressão digital</p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card className="app-card">
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <Settings className="h-4 w-4" />
              Editar Perfil
            </Button>
            
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <CreditCard className="h-4 w-4" />
              Histórico de Pagamentos
            </Button>
            
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <Shield className="h-4 w-4" />
              Alterar Senha
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-3" 
              size="lg"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};