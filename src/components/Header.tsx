import React, { useRef } from 'react';
import { Upload, Download, Banana, HelpCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const { setCurrentImage, currentImage } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.download = 'nano-banana-edit.png';
    link.href = currentImage;
    link.click();
  };

  return (
    <header className="h-16 bg-black border-b border-white/5 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-editor-accent rounded-xl flex items-center justify-center shadow-lg shadow-editor-accent/20">
          <Banana size={24} className="text-black" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-lg tracking-tight leading-none">NANO BANANA</h1>
          <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">AI Image Studio</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleUpload}
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors border border-white/5"
        >
          <Upload size={18} />
          <span className="text-sm font-medium">Upload</span>
        </button>

        <button 
          onClick={handleDownload}
          disabled={!currentImage}
          className="flex items-center gap-2 px-4 py-2 bg-editor-accent hover:bg-yellow-400 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm shadow-editor-accent/10"
        >
          <Download size={18} />
          <span className="text-sm">Export</span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <button className="text-white/40 hover:text-white transition-colors">
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
};
