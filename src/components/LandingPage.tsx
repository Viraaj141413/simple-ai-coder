import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Code, Zap, Rocket, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onSignUp: (email: string, name: string) => void;
}

export const LandingPage = ({ onSignUp }: LandingPageProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    
    setIsLoading(true);
    // Simulate signup process
    setTimeout(() => {
      onSignUp(email, name);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Zap className="h-12 w-12 text-primary animate-pulse-glow" />
              <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1 animate-float" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold ai-gradient bg-clip-text text-transparent">
              AI Builder
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Turn your ideas into <span className="text-primary font-semibold">working apps</span> in seconds.<br />
            Just describe what you want, and watch AI build it for you.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm">No coding required</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
              <Rocket className="h-4 w-4 text-accent" />
              <span className="text-sm">Instant deployment</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">AI-powered</span>
            </div>
          </div>
        </div>

        {/* Sign Up Form */}
        <Card className="w-full max-w-md p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Get Started Free</h2>
            <p className="text-muted-foreground">Join thousands of builders creating with AI</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !email.trim() || !name.trim()}
              className="w-full h-12 ai-gradient hover:opacity-90 transition-opacity text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating your account...
                </>
              ) : (
                <>
                  Start Building
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Code Generation</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI creates production-ready code from your descriptions
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Generate complete applications in under 30 seconds
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Instant Preview</h3>
              <p className="text-sm text-muted-foreground">
                See your app come to life with real-time preview and testing
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};