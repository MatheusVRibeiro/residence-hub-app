import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { Dashboard } from "@/components/Dashboard";
import { ReservationsScreen } from "@/components/ReservationsScreen";
import { NotificationsScreen } from "@/components/NotificationsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { BottomNavigation } from "@/components/BottomNavigation";

type Tab = 'dashboard' | 'reservations' | 'notifications' | 'profile';

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
        return <Dashboard userEmail={userEmail} onNavigate={handleNavigation} />;
      case 'reservations':
        return <ReservationsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen userEmail={userEmail} onLogout={handleLogout} />;
      default:
        return <Dashboard userEmail={userEmail} onNavigate={handleNavigation} />;
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