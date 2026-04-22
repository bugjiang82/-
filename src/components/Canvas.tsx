import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Rect, Circle, Group } from 'react-konva';
import { useStore, ToolType } from '../store/useStore';
import useImage from 'use-image';
import { ComparisonSlider } from './ComparisonSlider';

export const Canvas: React.FC = () => {
  const { 
    currentImage, 
    tool, 
    brushColor, 
    brushSize, 
    shapes, 
    addShape, 
    updateShape,
    selectionPath,
    setSelectionPath,
    setTool,
    beforeImage,
    showComparison,
    setShowComparison
  } = useStore();

  const [image] = useImage(currentImage || '');
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<number[] | null>(null);
  const [newShape, setNewShape] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === 'brush' || tool === 'eraser') {
      setIsDrawing(true);
      setCurrentLine([pos.x, pos.y]);
    } else if (tool === 'lasso') {
      const currentPath = selectionPath || [];
      
      // Check if clicking near the first point to close
      if (currentPath.length >= 4) {
        const startX = currentPath[0];
        const startY = currentPath[1];
        const dist = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
        
        if (dist < 15) { // 15px proximity threshold
          setTool('select');
          return;
        }
      }
      
      setSelectionPath([...currentPath, pos.x, pos.y]);
    } else if (tool === 'rect') {
      setIsDrawing(true);
      setNewShape({
        id: Math.random().toString(36),
        type: 'rect',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: brushColor,
        strokeWidth: 2,
      });
    } else if (tool === 'circle') {
      setIsDrawing(true);
      setNewShape({
        id: Math.random().toString(36),
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        stroke: brushColor,
        strokeWidth: 2,
      });
    }
  };

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setMousePos(pos);

    if (!isDrawing) return;

    if (tool === 'brush' || tool === 'eraser') {
      setCurrentLine((prev) => prev ? [...prev, pos.x, pos.y] : [pos.x, pos.y]);
    } else if (tool === 'rect' && newShape) {
      setNewShape({
        ...newShape,
        width: pos.x - newShape.x,
        height: pos.y - newShape.y,
      });
    } else if (tool === 'circle' && newShape) {
      const radius = Math.sqrt(
        Math.pow(pos.x - newShape.x, 2) + Math.pow(pos.y - newShape.y, 2)
      );
      setNewShape({
        ...newShape,
        radius,
      });
    }
  };

  const handleMouseUp = () => {
    if (tool === 'lasso') return; // Lasso doesn't finish on mouse up now
    
    setIsDrawing(false);
    if ((tool === 'brush' || tool === 'eraser') && currentLine) {
      addShape({
        id: Math.random().toString(36),
        type: 'path',
        points: currentLine,
        stroke: brushColor,
        strokeWidth: brushSize,
        tool: tool,
      });
      setCurrentLine(null);
    } else if (tool === 'rect' || tool === 'circle') {
      if (newShape) {
        addShape({
          ...newShape,
          isSelection: true
        });
      }
      setNewShape(null);
    }
  };

  const handleDblClick = () => {
    if (tool === 'lasso' && selectionPath && selectionPath.length >= 4) {
      setTool('select');
    }
  };

  if (showComparison && beforeImage && currentImage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-editor-bg overflow-hidden animate-in fade-in duration-500">
        <div className="mb-4 flex items-center justify-between w-full max-w-[800px]">
           <button 
             onClick={() => setShowComparison(false)}
             className="text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-white/60 transition-all uppercase tracking-widest border border-white/10 hover:text-white hover:border-white/20 active:scale-95"
           >
             ← Back to Editor
           </button>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-editor-accent animate-pulse" />
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Comparison Mode</span>
           </div>
        </div>
        <ComparisonSlider before={beforeImage} after={currentImage} className="w-[800px] h-[600px] shadow-2xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-editor-bg overflow-hidden">
      <div className="canvas-container relative rounded-lg border border-white/10 overflow-hidden">
        <Stage
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDblClick={handleDblClick}
          ref={stageRef}
          style={{ cursor: tool === 'select' ? 'default' : 'crosshair' }}
        >
          <Layer>
            {/* Background Image */}
            {image && (
              <KonvaImage
                image={image}
                width={800}
                height={600}
                listening={false}
              />
            )}

            {/* Existing Shapes */}
            {shapes.map((shape) => (
              <Group key={shape.id}>
                {shape.type === 'path' && (
                  <Line
                    points={shape.points}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={shape.tool === 'eraser' ? 'destination-out' : 'source-over'}
                  />
                )}
                {shape.type === 'rect' && (
                  <Rect
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    fill={shape.isSelection ? 'rgba(252, 211, 77, 0.2)' : 'transparent'}
                    dash={shape.isSelection ? [5, 5] : []}
                  />
                )}
                {shape.type === 'circle' && (
                  <Circle
                    x={shape.x}
                    y={shape.y}
                    radius={(shape as any).radius}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    fill={shape.isSelection ? 'rgba(252, 211, 77, 0.2)' : 'transparent'}
                    dash={shape.isSelection ? [5, 5] : []}
                  />
                )}
              </Group>
            ))}

            {/* Active Drawing Line for Brush/Eraser */}
            {currentLine && (
              <Line
                points={currentLine}
                stroke={brushColor}
                strokeWidth={brushSize}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={tool === 'eraser' ? 'destination-out' : 'source-over'}
              />
            )}

            {/* Selection Lasso Path & Points */}
            {selectionPath && (
              <Group>
                <Line
                  points={tool === 'lasso' ? [...selectionPath, mousePos.x, mousePos.y] : selectionPath}
                  stroke="#fcd34d"
                  strokeWidth={2}
                  dash={[5, 5]}
                  fill="rgba(252, 211, 77, 0.2)"
                  closed={selectionPath.length >= 4}
                />
                {/* Visual points for lasso */}
                {Array.from({ length: selectionPath.length / 2 }).map((_, i) => {
                  const isFirst = i === 0;
                  const x = selectionPath[i * 2];
                  const y = selectionPath[i * 2 + 1];
                  const isHovering = isFirst && 
                    Math.sqrt(Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - y, 2)) < 15;
                  
                  return (
                    <Circle
                      key={i}
                      x={x}
                      y={y}
                      radius={isFirst && isHovering ? 6 : 3}
                      fill={isFirst && isHovering ? "#fff" : "#fcd34d"}
                      stroke="#000"
                      strokeWidth={1}
                      shadowBlur={isFirst && isHovering ? 10 : 0}
                      shadowColor="#fcd34d"
                    />
                  );
                })}
              </Group>
            )}

            {/* Ghost Shape for Rect/Circle */}
            {newShape && (
               <>
                {newShape.type === 'rect' && (
                  <Rect
                    {...newShape}
                    dash={[5, 5]}
                  />
                )}
                {newShape.type === 'circle' && (
                  <Circle
                    {...newShape}
                    dash={[5, 5]}
                  />
                )}
               </>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
