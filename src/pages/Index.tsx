import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { MainDashboard } from "@/components/MainDashboard";

interface User {
  name: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ai-builder-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('ai-builder-user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleSignUp = (email: string, name: string) => {
    const newUser: User = { email, name };
    setUser(newUser);
    localStorage.setItem('ai-builder-user', JSON.stringify(newUser));
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('ai-builder-user');
    // Also clear projects if desired
    // localStorage.removeItem('ai-builder-projects');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-muted-foreground">Loading AI Builder...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onSignUp={handleSignUp} />;
  }

  return <MainDashboard user={user} onSignOut={handleSignOut} />;
};

export default Index;
