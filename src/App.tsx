/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { Toolbox } from './components/Toolbox';
import { Canvas } from './components/Canvas';
import { AIPanel } from './components/AIPanel';

export default function App() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Toolbox />
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <Canvas />
          <AIPanel />
        </main>

        {/* Right Sidebar - Layers or History (Stub) */}
        <aside className="w-64 bg-editor-sidebar border-l border-white/5 hidden lg:flex flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/40">Layers</h3>
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40">Canvas v1.0</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3 group hover:border-editor-accent/30 transition-colors">
              <div className="w-10 h-10 bg-[#333] rounded-lg overflow-hidden border border-white/10">
                {/* Image thumb stub */}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium">Background</span>
                <span className="text-[10px] text-white/40 text-xs">Locked</span>
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group">
              <span className="text-xs font-medium text-white/60 italic">No additional layers</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

