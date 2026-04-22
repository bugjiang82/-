import { create } from 'zustand';

export type ToolType = 'select' | 'brush' | 'lasso' | 'rect' | 'circle' | 'eraser';

interface Shape {
  id: string;
  type: 'path' | 'rect' | 'circle';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  stroke: string;
  strokeWidth: number;
  fill?: string;
  isSelection?: boolean;
  tool?: ToolType;
}

interface EditorState {
  currentImage: string | null;
  beforeImage: string | null;
  showComparison: boolean;
  tool: ToolType;
  brushColor: string;
  brushSize: number;
  shapes: Shape[];
  selectionPath: number[] | null;
  isGenerating: boolean;
  prompt: string;
  
  // Actions
  setCurrentImage: (image: string | null) => void;
  setBeforeImage: (image: string | null) => void;
  setShowComparison: (show: boolean) => void;
  setTool: (tool: ToolType) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  clearShapes: () => void;
  setSelectionPath: (path: number[] | null) => void;
  setIsGenerating: (status: boolean) => void;
  setPrompt: (prompt: string) => void;
}

export const useStore = create<EditorState>((set) => ({
  currentImage: null,
  beforeImage: null,
  showComparison: false,
  tool: 'brush',
  brushColor: '#000000',
  brushSize: 5,
  shapes: [],
  selectionPath: null,
  isGenerating: false,
  prompt: '',

  setCurrentImage: (image) => set({ currentImage: image }),
  setBeforeImage: (image) => set({ beforeImage: image }),
  setShowComparison: (show) => set({ showComparison: show }),
  setTool: (tool) => set({ tool }),
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, updates) => set((state) => ({
    shapes: state.shapes.map((s) => s.id === id ? { ...s, ...updates } : s)
  })),
  clearShapes: () => set({ shapes: [] }),
  setSelectionPath: (path) => set({ selectionPath: path }),
  setIsGenerating: (status) => set({ isGenerating: status }),
  setPrompt: (prompt) => set({ prompt }),
}));
