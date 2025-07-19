import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Code, Folder, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjectManager } from "./ProjectManager";

interface BuildInterfaceProps {
  user: { name: string; email: string };
  onStartBuilding: (prompt: string) => void;
  onSignOut: () => void;
}

export const BuildInterface = ({ user, onStartBuilding, onSignOut }: BuildInterfaceProps) => {
  const [prompt, setPrompt] = useState("");
  const { getRecentProjects } = useProjectManager();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onStartBuilding(prompt.trim());
    }
  };

  const suggestions = [
    { icon: "🧮", title: "Calculator app", desc: "Build a modern calculator with beautiful design" },
    { icon: "📝", title: "Todo list application", desc: "Task management with add, delete, and mark complete" },
    { icon: "🎮", title: "Memory game", desc: "Card matching game with scoring system" },
    { icon: "🌤️", title: "Weather dashboard", desc: "Show current weather and forecasts" },
    { icon: "💼", title: "Portfolio website", desc: "Professional portfolio with projects showcase" },
    { icon: "📊", title: "Analytics dashboard", desc: "Data visualization with charts and metrics" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code className="h-7 w-7 text-cyan-400" />
            <span className="text-xl font-bold">CloudAI</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">{/* Negative margin to center better */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Build something with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CloudAI
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12">
            Hi {user.name.split(' ')[0]}, what do you want to create today?
          </p>

          {/* Main Input */}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask CloudAI to create anything... calculator, todo app, game, website..."
                className="w-full h-16 px-6 pr-16 text-lg bg-black/20 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
              <Button
                type="submit"
                disabled={!prompt.trim()}
                className="absolute right-3 top-3 h-10 w-10 p-0 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mb-12">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index}
                className="p-6 bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => setPrompt(suggestion.title)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{suggestion.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{suggestion.title}</h3>
                  <p className="text-sm text-gray-400">{suggestion.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Projects */}
          {getRecentProjects(3).length > 0 && (
            <div className="w-full max-w-4xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
                <Clock className="h-6 w-6 text-cyan-400" />
                Recent Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getRecentProjects(3).map(project => (
                  <Card 
                    key={project.id}
                    className="p-6 bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 transition-all duration-300 cursor-pointer hover:scale-105"
                    onClick={() => onStartBuilding(`Open project: ${project.name}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Folder className="h-5 w-5 text-cyan-400" />
                      <h4 className="font-semibold text-white">{project.name}</h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                      {project.files.length} files
                    </Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};