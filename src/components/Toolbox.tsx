import React from 'react';
import { 
  MousePointer2, 
  Paintbrush, 
  Lasso, 
  Square, 
  Circle, 
  Eraser, 
  Type,
  Trash2,
  Undo2
} from 'lucide-react';
import { useStore, ToolType } from '../store/useStore';
import { cn } from '../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

const tools: { icon: any; id: ToolType; label: string }[] = [
  { icon: MousePointer2, id: 'select', label: 'Select' },
  { icon: Paintbrush, id: 'brush', label: 'Brush' },
  { icon: Lasso, id: 'lasso', label: 'Lasso Selection' },
  { icon: Square, id: 'rect', label: 'Rectangle' },
  { icon: Circle, id: 'circle', label: 'Circle' },
  { icon: Eraser, id: 'eraser', label: 'Eraser' },
];

export const Toolbox: React.FC = () => {
  const { tool, setTool, clearShapes, setSelectionPath, brushColor, setBrushColor, brushSize, setBrushSize } = useStore();

  return (
    <Tooltip.Provider>
      <div className="w-16 bg-editor-sidebar border-r border-white/5 flex flex-col items-center py-6 gap-6 z-10">
        <div className="flex flex-col gap-2">
          {tools.map((t) => (
            <Tooltip.Root key={t.id}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setTool(t.id)}
                  className={cn(
                    "p-3 rounded-xl transition-all duration-200 group",
                    tool === t.id 
                      ? "bg-editor-accent text-black scale-110 shadow-lg shadow-editor-accent/20" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <t.icon size={20} className={cn("transition-transform", tool === t.id ? "scale-100" : "group-hover:scale-110")} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content side="right" sideOffset={10} className="bg-white text-black text-xs px-2 py-1 rounded font-medium animate-in fade-in zoom-in duration-200">
                {t.label}
              </Tooltip.Content>
            </Tooltip.Root>
          ))}
        </div>

        <div className="h-px w-8 bg-white/10" />

        <div className="flex flex-col gap-4 items-center">
            {/* Color Picker */}
            <div className="relative group">
                <input 
                    type="color" 
                    value={brushColor} 
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer overflow-hidden appearance-none bg-transparent"
                />
            </div>

            {/* Size Slider (Simple) */}
            <input 
                type="range" 
                min="1" 
                max="50" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-12 h-1 accent-editor-accent rotate-270 mt-8 mb-4"
            />
        </div>

        <div className="mt-auto flex flex-col gap-2">
            <button
                onClick={() => {
                    clearShapes();
                    setSelectionPath(null);
                }}
                className="p-3 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                title="Clear All"
            >
                <Trash2 size={20} />
            </button>
        </div>
      </div>
    </Tooltip.Provider>
  );
};
