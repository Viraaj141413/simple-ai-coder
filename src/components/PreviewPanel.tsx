import { useState } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreviewPanelProps {
  code: string;
  language: string;
  isVisible: boolean;
}

export const PreviewPanel = ({ code, language, isVisible }: PreviewPanelProps) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getDeviceClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      default:
        return 'w-full h-full';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6 text-accent" />
            <div>
              <h2 className="text-xl font-bold">Live Preview</h2>
              <Badge variant="secondary" className="text-xs mt-1">
                {language.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Mode Buttons */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('desktop')}
                className="rounded-none border-none"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('tablet')}
                className="rounded-none border-none"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('mobile')}
                className="rounded-none border-none"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-glow hover:ai-glow transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([code], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
              }}
              className="border-glow hover:ai-glow transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4 bg-muted/20">
        <div className="h-full flex items-center justify-center">
          {deviceMode !== 'desktop' ? (
            <div className={`${getDeviceClass()} bg-white rounded-lg shadow-2xl border border-border overflow-hidden relative`}>
              {/* Device Frame */}
              <div className="w-full h-full relative">
                <iframe
                  srcDoc={language === 'html' ? code : `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Preview</title>
                    </head>
                    <body>
                      <pre style="padding: 20px; font-family: monospace; background: #f5f5f5; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${code}</pre>
                    </body>
                    </html>
                  `}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                  key={isRefreshing ? Date.now() : undefined}
                />
              </div>
              
              {/* Device Labels */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                  {deviceMode === 'mobile' ? '375×667' : '768×1024'}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-white rounded-lg shadow-lg border border-border overflow-hidden">
              <iframe
                srcDoc={language === 'html' ? code : `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Preview</title>
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                        padding: 20px;
                        background: #f8f9fa;
                        margin: 0;
                      }
                      pre {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        border: 1px solid #e9ecef;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
                        font-size: 14px;
                        line-height: 1.5;
                      }
                    </style>
                  </head>
                  <body>
                    <h2 style="color: #495057; margin-top: 0;">Code Preview</h2>
                    <pre>${code}</pre>
                  </body>
                  </html>
                `}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
                key={isRefreshing ? Date.now() : undefined}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-500">●</span>
            <span>Live Preview Active</span>
          </div>
          <span>{deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} View</span>
        </div>
      </div>
    </div>
  );
};