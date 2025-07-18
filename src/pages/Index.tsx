import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Code Builder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .welcome-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 600px;
        }
        .title {
            color: #333;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        .feature {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 15px 0;
            border-left: 4px solid #667eea;
        }
        .cta {
            background: #667eea;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            cursor: pointer;
            margin-top: 20px;
        }
        .cta:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="welcome-card">
        <h1 class="title">🤖 AI Code Builder</h1>
        <p class="subtitle">Tell me what you want to build, and I'll write the code for you!</p>
        
        <div class="feature">
            <h3>💬 Natural Language to Code</h3>
            <p>Simply describe your app in plain English and watch as AI generates working code instantly.</p>
        </div>
        
        <div class="feature">
            <h3>⚡ Instant Preview</h3>
            <p>See your app come to life immediately with our live preview feature.</p>
        </div>
        
        <div class="feature">
            <h3>🎨 Multiple Languages</h3>
            <p>Generate HTML, CSS, JavaScript, Python, and more - all through simple conversation.</p>
        </div>
        
        <button class="cta" onclick="alert('Start chatting with the AI to generate your first app!')">
            Get Started →
        </button>
    </div>
</body>
</html>`);
  
  const [language, setLanguage] = useState("html");
  const [showPreview, setShowPreview] = useState(true);

  const handleCodeGenerated = (newCode: string, newLanguage: string) => {
    setCode(newCode);
    setLanguage(newLanguage);
    toast.success("✨ New code generated!");
  };

  const handleRunCode = () => {
    // In a real implementation, this would execute the code
    console.log("Running code:", code);
  };

  const handleExplainCode = () => {
    // In a real implementation, this would send the code to AI for explanation
    toast.info("🤖 AI explanation feature coming soon! Connect your Gemini API to enable this.");
  };

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="h-8 w-8 text-primary animate-pulse-glow" />
            <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-float" />
          </div>
          <div>
            <h1 className="text-xl font-bold ai-gradient bg-clip-text text-transparent">
              AI Code Builder
            </h1>
            <p className="text-xs text-muted-foreground">
              Build anything with natural language
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="border-glow hover:ai-glow transition-all duration-300"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat Interface - Left Panel */}
        <div className="w-1/3 min-w-[400px]">
          <ChatInterface onCodeGenerated={handleCodeGenerated} />
        </div>

        {/* Code Editor - Middle Panel */}
        <div className={`${showPreview ? 'w-1/3' : 'w-2/3'} transition-all duration-300`}>
          <CodeEditor
            code={code}
            language={language}
            onCodeChange={setCode}
            onRunCode={handleRunCode}
            onExplainCode={handleExplainCode}
          />
        </div>

        {/* Preview Panel - Right Panel */}
        {showPreview && (
          <div className="w-1/3 transition-all duration-300">
            <PreviewPanel
              code={code}
              language={language}
              isVisible={showPreview}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
