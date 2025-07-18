import { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  FileCode, 
  Code, 
  Palette,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectFile } from "@/services/GeminiService";
import { Badge } from "@/components/ui/badge";

interface FileExplorerProps {
  files: ProjectFile[];
  selectedFile: string | null;
  onFileSelect: (filePath: string) => void;
  onCreateFile?: () => void;
  isCollapsed?: boolean;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  file?: ProjectFile;
}

export const FileExplorer = ({ 
  files, 
  selectedFile, 
  onFileSelect, 
  onCreateFile,
  isCollapsed = false 
}: FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));

  const getFileIcon = (file: ProjectFile) => {
    switch (file.type) {
      case 'html':
        return <FileCode className="h-4 w-4 text-orange-500" />;
      case 'css':
        return <Palette className="h-4 w-4 text-blue-500" />;
      case 'js':
        return <Code className="h-4 w-4 text-yellow-500" />;
      case 'json':
        return <Settings className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const buildFileTree = (files: ProjectFile[]): FileNode[] => {
    const tree: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    // Add root folder
    const rootFolder: FileNode = {
      name: 'src',
      path: '',
      type: 'folder',
      children: []
    };
    tree.push(rootFolder);
    folderMap.set('', rootFolder);

    files.forEach(file => {
      const parts = file.path.split('/').filter(Boolean);
      let currentPath = '';
      let currentFolder = rootFolder;

      // Create folder structure
      parts.forEach(part => {
        const newPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!folderMap.has(newPath)) {
          const folder: FileNode = {
            name: part,
            path: newPath,
            type: 'folder',
            children: []
          };
          
          currentFolder.children!.push(folder);
          folderMap.set(newPath, folder);
        }
        
        currentFolder = folderMap.get(newPath)!;
        currentPath = newPath;
      });

      // Add file to the appropriate folder
      const fileNode: FileNode = {
        name: file.name,
        path: file.path + file.name,
        type: 'file',
        file
      };
      
      currentFolder.children!.push(fileNode);
    });

    return tree;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (expandedFolders.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;
    
    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors ${
            isSelected ? 'bg-primary/10 border-r-2 border-primary' : ''
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {node.type === 'folder' && (
            <div className="flex items-center gap-1">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
            </div>
          )}
          
          {node.type === 'file' && node.file && getFileIcon(node.file)}
          
          <span className={`text-sm flex-1 ${isSelected ? 'font-medium' : ''}`}>
            {node.name}
          </span>
          
          {node.type === 'file' && node.file && (
            <Badge variant="secondary" className="text-xs">
              {node.file.type.toUpperCase()}
            </Badge>
          )}
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const fileTree = buildFileTree(files);

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-border bg-muted/20 flex flex-col items-center py-4 gap-2">
        <Folder className="h-5 w-5 text-muted-foreground" />
        <div className="w-4 h-px bg-border"></div>
        {files.slice(0, 3).map(file => (
          <div
            key={file.name}
            className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors ${
              selectedFile === file.path + file.name 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
            onClick={() => onFileSelect(file.path + file.name)}
          >
            {getFileIcon(file)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-border bg-muted/20 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Explorer</h3>
          <div className="flex items-center gap-1">
            {onCreateFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateFile}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {fileTree.map(node => renderFileNode(node))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};