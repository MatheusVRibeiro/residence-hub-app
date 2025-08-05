import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { ForgotPasswordScreen } from "@/components/ForgotPasswordScreen";
import { ResetPasswordScreen } from "@/components/ResetPasswordScreen";
import { DashboardMorador } from "@/components/DashboardMorador";
import { ReservationsScreen } from "@/components/ReservationsScreen";
import { NotificationsScreen } from "@/components/NotificationsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { PackagesScreen } from "@/components/PackagesScreen";
import { IssueReportScreen } from "@/components/IssueReportScreen";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth"; // Importação do novo hook

export type Tab = 'dashboard' | 'reservations' | 'notifications' | 'profile' | 'packages' | 'issues';
type AuthScreen = 'login' | 'forgotPassword' | 'resetPassword';

const Index = () => {
  const { isLoggedIn, userEmail, login, logout } = useAuth(); // Usando o hook
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
    setAuthScreen('login');
  };

  if (!isLoggedIn) {
    switch (authScreen) {
      case 'forgotPassword':
        return <ForgotPasswordScreen onBackToLogin={() => setAuthScreen('login')} />;
      case 'resetPassword':
        return <ResetPasswordScreen onPasswordReset={() => setAuthScreen('login')} />;
      case 'login':
      default:
        return <LoginScreen onLogin={login} onForgotPassword={() => setAuthScreen('forgotPassword')} />;
    }
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardMorador onNavigate={setActiveTab} />;
      case 'reservations': return <ReservationsScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'profile': return <ProfileScreen userEmail={userEmail} onLogout={handleLogout} />;
      case 'packages': return <PackagesScreen />;
      case 'issues': return <IssueReportScreen />;
      default: return <DashboardMorador onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;