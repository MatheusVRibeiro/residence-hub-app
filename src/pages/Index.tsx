import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { DashboardMorador } from "@/components/DashboardMorador";
import { ReservationsScreen } from "@/components/ReservationsScreen";
import { NotificationsScreen } from "@/components/NotificationsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { PackagesScreen } from "@/components/PackagesScreen";
import { IssueReportScreen } from "@/components/IssueReportScreen";
import { BottomNavigation } from "@/components/BottomNavigation";

// Este tipo agora é a "fonte da verdade" para a navegação do app
export type Tab = 'dashboard' | 'reservations' | 'notifications' | 'profile' | 'packages' | 'issues';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setActiveTab('dashboard');
  };

  const handleNavigation = (tab: Tab) => {
    setActiveTab(tab);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMorador onNavigate={handleNavigation} />;
      case 'reservations':
        return <ReservationsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen userEmail={userEmail} onLogout={handleLogout} />;
      case 'packages':
        return <PackagesScreen />;
      case 'issues':
        return <IssueReportScreen />;
      default:
        return <DashboardMorador onNavigate={handleNavigation} />;
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