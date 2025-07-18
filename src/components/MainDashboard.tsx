import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileExplorer } from "./FileExplorer";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code, 
  Eye,
  EyeOff,
  Play,
  Download,
  RefreshCw,
  Settings,
  Menu,
  X,
  Plus,
  Clock,
  Folder
} from "lucide-react";
import { geminiService } from "@/services/GeminiService";
import { useProjectManager, Project } from "./ProjectManager";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface User {
  name: string;
  email: string;
}

interface MainDashboardProps {
  user: User;
  onSignOut: () => void;
}

export const MainDashboard = ({ user, onSignOut }: MainDashboardProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showFiles, setShowFiles] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { projects, createProject, getRecentProjects } = useProjectManager();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setHasStarted(true);

    try {
      // Generate project with Gemini
      const generatedProject = await geminiService.generateProject(userMessage.content);
      
      // Create project in manager
      const project = createProject(generatedProject);
      setCurrentProject(project);
      setSelectedFile(project.files[0]?.path + project.files[0]?.name || null);
      setShowFiles(true);
      setShowPreview(true);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `🎉 Perfect! I've created "${project.name}" for you. The app includes:\n\n${project.files.map(f => `• ${f.name} (${f.type.toUpperCase()})`).join('\n')}\n\nYour app is ready to use! You can see the files on the left and preview on the right. What would you like me to modify or add next?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      toast.success(`✨ ${project.name} created successfully!`);

    } catch (error) {
      console.error('Error generating project:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I encountered an error while generating your project. Please try again with a different description, or check your internet connection.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
      toast.error("Failed to generate project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getCurrentFileContent = () => {
    if (!currentProject || !selectedFile) return '';
    const file = currentProject.files.find(f => f.path + f.name === selectedFile);
    return file?.content || '';
  };

  const getWelcomeMessage = () => {
    if (hasStarted) return null;

    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <div className="relative mb-8">
          <Bot className="h-16 w-16 text-primary animate-pulse-glow" />
          <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-float" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">
          Hi {user.name.split(' ')[0]}, what do you want to make?
        </h2>
        
        <p className="text-muted-foreground mb-8 max-w-md">
          Describe your app idea and I'll create a complete, working application for you instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          {[
            { icon: "🧮", title: "Calculator app", desc: "A modern calculator with beautiful design" },
            { icon: "📝", title: "Todo list application", desc: "Task management with add, delete, and mark complete" },
            { icon: "🎮", title: "Memory game", desc: "Card matching game with scoring system" }
          ].map((suggestion, index) => (
            <Card 
              key={index}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSuggestionClick(suggestion.title)}
            >
              <div className="text-2xl mb-2">{suggestion.icon}</div>
              <h3 className="font-medium text-sm mb-1">{suggestion.title}</h3>
              <p className="text-xs text-muted-foreground">{suggestion.desc}</p>
            </Card>
          ))}
        </div>

        {getRecentProjects(3).length > 0 && (
          <div className="w-full max-w-3xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getRecentProjects(3).map(project => (
                <Card 
                  key={project.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setCurrentProject(project);
                    setSelectedFile(project.files[0]?.path + project.files[0]?.name || null);
                    setShowFiles(true);
                    setShowPreview(true);
                    setHasStarted(true);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">{project.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {project.files.length} files
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-semibold">AI Builder</span>
          </div>
          
          {currentProject && (
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="outline">{currentProject.name}</Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentProject && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFiles(!showFiles)}
              >
                <Code className="h-4 w-4 mr-2" />
                {showFiles ? 'Hide Files' : 'Show Files'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
            </>
          )}
          
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            {user.name.split(' ')[0]}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r border-border bg-muted/20 flex flex-col">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              {!hasStarted ? (
                <div className="text-center p-8">
                  <Bot className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse-glow" />
                  <h3 className="font-semibold mb-2">AI Assistant Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by describing what you want to build!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 animate-slide-up ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <div className="flex-shrink-0">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'ai-gradient text-white'
                            : 'bg-card border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <User className="h-6 w-6 text-accent" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 animate-slide-up">
                      <Bot className="h-6 w-6 text-primary animate-pulse" />
                      <div className="bg-card border rounded-lg p-3 max-w-[80%]">
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
              )}
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to build..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="ai-gradient hover:opacity-90 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* File Explorer */}
          {showFiles && currentProject && (
            <FileExplorer
              files={currentProject.files}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />
          )}

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {!hasStarted ? (
              getWelcomeMessage()
            ) : currentProject ? (
              <div className="flex flex-1">
                {/* Code Editor (only if file is selected and preview is not full width) */}
                {selectedFile && !showPreview && (
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-border bg-card/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{selectedFile.split('/').pop()}</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 code-bg">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                        {getCurrentFileContent()}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Preview Panel */}
                {showPreview && (
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-border bg-card/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Live Preview</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 bg-muted/20">
                      <div className="w-full h-full bg-white rounded-lg shadow-lg border overflow-hidden">
                        <iframe
                          srcDoc={currentProject.files.find(f => f.name === currentProject.mainFile)?.content || ''}
                          className="w-full h-full border-none"
                          sandbox="allow-scripts"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground">
                    Start a conversation to create your first project
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};