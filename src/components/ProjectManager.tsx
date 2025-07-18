import { useState, useEffect } from "react";
import { GeneratedProject, ProjectFile } from "@/services/GeminiService";

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  mainFile: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectManager {
  private static instance: ProjectManager;
  private projects: Project[] = [];
  private listeners: ((projects: Project[]) => void)[] = [];

  static getInstance(): ProjectManager {
    if (!ProjectManager.instance) {
      ProjectManager.instance = new ProjectManager();
    }
    return ProjectManager.instance;
  }

  constructor() {
    this.loadProjects();
  }

  subscribe(listener: (projects: Project[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.projects]));
  }

  private loadProjects() {
    try {
      const stored = localStorage.getItem('ai-builder-projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.projects = parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
    }
  }

  private saveProjects() {
    try {
      localStorage.setItem('ai-builder-projects', JSON.stringify(this.projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  }

  createProject(generatedProject: GeneratedProject): Project {
    const project: Project = {
      id: this.generateId(),
      name: generatedProject.name,
      description: generatedProject.description,
      files: generatedProject.files,
      mainFile: generatedProject.mainFile,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.unshift(project);
    this.saveProjects();
    this.notify();
    return project;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveProjects();
    this.notify();
    return this.projects[index];
  }

  updateFile(projectId: string, filePath: string, content: string): boolean {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return false;

    const file = project.files.find(f => f.path + f.name === filePath);
    if (!file) return false;

    file.content = content;
    project.updatedAt = new Date();

    this.saveProjects();
    this.notify();
    return true;
  }

  addFile(projectId: string, file: ProjectFile): boolean {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return false;

    // Check if file already exists
    const exists = project.files.some(f => f.path + f.name === file.path + file.name);
    if (exists) return false;

    project.files.push(file);
    project.updatedAt = new Date();

    this.saveProjects();
    this.notify();
    return true;
  }

  deleteFile(projectId: string, filePath: string): boolean {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return false;

    const index = project.files.findIndex(f => f.path + f.name === filePath);
    if (index === -1) return false;

    project.files.splice(index, 1);
    project.updatedAt = new Date();

    this.saveProjects();
    this.notify();
    return true;
  }

  deleteProject(id: string): boolean {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    this.saveProjects();
    this.notify();
    return true;
  }

  getProject(id: string): Project | null {
    return this.projects.find(p => p.id === id) || null;
  }

  getProjects(): Project[] {
    return [...this.projects];
  }

  getRecentProjects(limit: number = 5): Project[] {
    return this.projects
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const useProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const manager = ProjectManager.getInstance();

  useEffect(() => {
    const unsubscribe = manager.subscribe(setProjects);
    setProjects(manager.getProjects());
    return unsubscribe;
  }, [manager]);

  return {
    projects,
    createProject: (generatedProject: GeneratedProject) => manager.createProject(generatedProject),
    updateProject: (id: string, updates: Partial<Project>) => manager.updateProject(id, updates),
    updateFile: (projectId: string, filePath: string, content: string) => manager.updateFile(projectId, filePath, content),
    addFile: (projectId: string, file: ProjectFile) => manager.addFile(projectId, file),
    deleteFile: (projectId: string, filePath: string) => manager.deleteFile(projectId, filePath),
    deleteProject: (id: string) => manager.deleteProject(id),
    getProject: (id: string) => manager.getProject(id),
    getRecentProjects: (limit?: number) => manager.getRecentProjects(limit)
  };
};