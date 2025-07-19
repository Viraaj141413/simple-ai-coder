import { useState } from "react";
import { BuildInterface } from "./BuildInterface";
import { ChatbotInterface } from "./ChatbotInterface";

interface User {
  name: string;
  email: string;
}

interface MainDashboardProps {
  user: User;
  onSignOut: () => void;
}

export const MainDashboard = ({ user, onSignOut }: MainDashboardProps) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState("");

  const handleStartBuilding = (prompt: string) => {
    setInitialPrompt(prompt);
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <BuildInterface 
        user={user} 
        onStartBuilding={handleStartBuilding} 
        onSignOut={onSignOut} 
      />
    );
  }

  return (
    <ChatbotInterface 
      user={user} 
      initialPrompt={initialPrompt} 
      onSignOut={onSignOut} 
    />
  );
};