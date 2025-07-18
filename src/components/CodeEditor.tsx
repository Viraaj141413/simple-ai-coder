import { useState } from "react";
import { Play, Download, HelpCircle, Copy, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  onExplainCode: () => void;
}

export const CodeEditor = ({ 
  code, 
  language, 
  onCodeChange, 
  onRunCode, 
  onExplainCode 
}: CodeEditorProps) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    toast.success("Running your code...");
    onRunCode();
    
    // Simulate execution time
    setTimeout(() => {
      setIsRunning(false);
      toast.success("Code executed successfully!");
    }, 1000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleDownloadCode = () => {
    const fileExtension = language === 'html' ? 'html' : 
                         language === 'javascript' ? 'js' : 
                         language === 'python' ? 'py' : 'txt';
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-code.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Code downloaded!");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="h-6 w-6 text-accent" />
            <div>
              <h2 className="text-xl font-bold">Code Editor</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {language.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {code.split('\n').length} lines
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="border-glow hover:ai-glow transition-all duration-300"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="border-glow hover:ai-glow transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExplainCode}
              className="border-glow hover:ai-glow transition-all duration-300"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Explain
            </Button>
            <Button
              onClick={handleRunCode}
              disabled={isRunning || !code.trim()}
              className="ai-gradient hover:opacity-90 transition-opacity accent-glow"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full p-4 code-bg text-foreground font-mono text-sm resize-none border-none outline-none"
          placeholder={`Start writing ${language} code here, or let AI generate it for you...`}
          spellCheck={false}
        />
        
        {/* Syntax highlighting overlay would go here in a real editor */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ready to code
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Ln {code.split('\n').length}, Col 1</span>
            <span>UTF-8</span>
            <span>{language.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">●</span>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};