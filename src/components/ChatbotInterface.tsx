import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Heart, RefreshCw } from "lucide-react";
import { geminiService } from "@/services/GeminiService";
import { useProjectManager, Project } from "./ProjectManager";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatbotInterfaceProps {
  user: { name: string; email: string };
  initialPrompt: string;
  onSignOut: () => void;
}

export const ChatbotInterface = ({ user, initialPrompt, onSignOut }: ChatbotInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { createProject } = useProjectManager();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Process initial prompt
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Generate project with Gemini
      const generatedProject = await geminiService.generateProject(content);
      
      // Create project in manager
      const project = createProject(generatedProject);
      setCurrentProject(project);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `✨ Perfect! I've created "${project.name}" for you. Your app is now live in the preview! What would you like me to modify or add next?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      toast.success(`🎉 ${project.name} created successfully!`);

    } catch (error) {
      console.error('Error generating project:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I encountered an error while generating your project. Please try again with a different description.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
      toast.error("Failed to generate project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="h-screen w-full bg-background flex">
      {/* Chat Panel - Small Left Side */}
      <div className="w-80 border-r border-border bg-card/30 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
              <span className="font-semibold">Lovable</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              {user.name.split(' ')[0]}
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 mt-1">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-8'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.type === 'user' && (
                  <div className="flex-shrink-0 mt-1">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Bot className="h-5 w-5 text-primary animate-pulse mt-1" />
                <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to modify your app..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Preview Panel - Large Right Side */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="h-12 border-b border-border bg-card/50 flex items-center justify-between px-4">
          <h3 className="font-semibold text-sm">
            {currentProject ? `Preview: ${currentProject.name}` : 'Live Preview'}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-muted/20 p-4">
          {currentProject ? (
            <div className="w-full h-full bg-white rounded-lg shadow-lg border overflow-hidden">
              <iframe
                srcDoc={currentProject.files.find(f => f.name === currentProject.mainFile)?.content || ''}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-white rounded-lg shadow-lg border flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Your app will appear here</h3>
                <p className="text-gray-400">Start chatting to see your creation come to life!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};