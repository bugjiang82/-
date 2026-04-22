import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, ImagePlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateImage, editImage } from '../lib/gemini';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

export const AIPanel: React.FC = () => {
  const { 
    prompt, 
    setPrompt, 
    currentImage, 
    setCurrentImage, 
    beforeImage,
    setBeforeImage,
    showComparison,
    setShowComparison,
    isGenerating, 
    setIsGenerating,
    selectionPath,
    setSelectionPath,
    clearShapes
  } = useStore();

  const handleAction = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      let resultUrl;
      if (currentImage) {
        setBeforeImage(currentImage);
        resultUrl = await editImage(currentImage, prompt);
      } else {
        resultUrl = await generateImage(prompt);
      }
      
      setCurrentImage(resultUrl);
      if (currentImage) {
        setShowComparison(true);
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fcd34d', '#ffffff', '#fbbf24']
      });
      // Optionally clear selection after edit
      setSelectionPath(null);
    } catch (err) {
      alert("AI Generation failed. Check console or API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-editor-sidebar border-t border-white/5">
      <div className="max-w-4xl mx-auto flex items-center gap-4 bg-[#2a2a2a] p-2 rounded-2xl shadow-2xl border border-white/10">
        <div className="flex-none p-3 text-editor-accent">
          <Sparkles size={24} className={isGenerating ? "animate-pulse" : ""} />
        </div>
        
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAction()}
          placeholder={currentImage ? "Describe changes (e.g., 'add a cat', 'make it sunset')" : "Imagine something... (e.g., 'a neon jungle')"}
          className="flex-1 bg-transparent border-none focus:outline-none text-lg text-white placeholder-white/20"
          disabled={isGenerating}
        />

        <button
          onClick={handleAction}
          disabled={isGenerating || !prompt.trim()}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
            isGenerating || !prompt.trim()
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-editor-accent text-black hover:scale-105 active:scale-95 shadow-lg shadow-editor-accent/20"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>{currentImage ? "Edit Image" : "Generate"}</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
