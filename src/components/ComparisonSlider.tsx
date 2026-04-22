import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

interface ComparisonSliderProps {
  before: string;
  after: string;
  className?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ before, after, className }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const onMouseDown = () => {
    isDragging.current = true;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden select-none cursor-col-resize rounded-lg border border-white/10", className)}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="After" 
        className="w-full h-full object-contain pointer-events-none"
        style={{ maxWidth: '800px', maxHeight: '600px' }}
      />

      {/* Before Image (Overlay) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-editor-accent"
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="h-full object-contain pointer-events-none"
          style={{ width: '800px', maxWidth: '800px', maxHeight: '600px' }}
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 z-10 flex items-center justify-center"
        style={{ left: `calc(${sliderPos}% - 12px)` }}
      >
        <div className="w-6 h-12 bg-editor-accent rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
          <GripVertical size={16} className="text-black" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded-md tracking-widest uppercase pointer-events-none">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-editor-accent text-black text-[10px] font-bold px-2 py-1 rounded-md tracking-widest uppercase pointer-events-none">
        AI Edited
      </div>
    </div>
  );
};
