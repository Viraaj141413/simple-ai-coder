import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Heart } from "lucide-react";

interface BuildInterfaceProps {
  user: { name: string; email: string };
  onStartBuilding: (prompt: string) => void;
  onSignOut: () => void;
}

export const BuildInterface = ({ user, onStartBuilding, onSignOut }: BuildInterfaceProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onStartBuilding(prompt.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <span className="text-lg font-semibold">Lovable</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <a href="#" className="hover:text-gray-300 transition-colors">Community</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Pricing</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Enterprise</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Learn</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Launched</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
            Get free credits
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSignOut}
            className="text-white hover:bg-white/10"
          >
            {user.name.split(' ')[0]}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Build something{" "}
            <span className="inline-flex items-center gap-2">
              <Heart className="h-12 w-12 md:h-16 md:w-16 text-red-500 fill-current" />
              Lovable
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12">
            Create apps and websites by chatting with AI
          </p>

          {/* Main Input */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Lovable to create a landing page for my..."
                className="w-full h-16 px-6 pr-16 text-lg bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                type="submit"
                disabled={!prompt.trim()}
                className="absolute right-3 top-3 h-10 w-10 p-0 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Options */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Public</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Supabase</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};