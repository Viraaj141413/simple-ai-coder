import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Code, Zap } from "lucide-react";

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
    setTimeout(() => {
      onSignUp(email, name);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Zap className="h-16 w-16 text-cyan-400 animate-pulse-glow" />
              <Sparkles className="h-8 w-8 text-blue-400 absolute -top-2 -right-2 animate-float" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                CloudAI
              </span>
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 leading-relaxed">
            Build anything with <span className="text-cyan-400 font-semibold">artificial intelligence</span>
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Create complete web applications, games, tools and more. 
            Just describe what you want and watch AI build it for you in seconds.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Code className="h-5 w-5 text-cyan-400" />
              <span className="text-white font-medium">No coding required</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Zap className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">Instant generation</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="text-white font-medium">AI-powered</span>
            </div>
          </div>
        </div>

        {/* Sign Up Form */}
        <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-lg border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Get Started Free</h2>
            <p className="text-gray-400">Join thousands building with AI</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-14 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 transition-colors text-lg"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 transition-colors text-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !email.trim() || !name.trim()}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Creating your account...
                </>
              ) : (
                <>
                  Start Building with AI
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Features Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <Card className="p-8 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/40 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Code Generation</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced AI creates production-ready applications from simple descriptions
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/40 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate complete applications in under 10 seconds with live preview
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/40 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Multiple Formats</h3>
              <p className="text-gray-400 leading-relaxed">
                Creates HTML, CSS, JavaScript, React, TypeScript, and Tailwind files
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};