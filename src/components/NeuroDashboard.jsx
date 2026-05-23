import React, { useState, useEffect } from 'react';
import { Sun, Moon, Brain, Info, HelpCircle } from 'lucide-react';
import TripleNetworkCards from './TripleNetworkCards';
import MindfulnessSimulator from './MindfulnessSimulator';
import MeditationTracker from './MeditationTracker';

export default function NeuroDashboard() {
  const [theme, setTheme] = useState(() => {
    // Default to dark mode for a calming aesthetic
    return 'dark';
  });

  const [currentSimulationState, setSimulationState] = useState('wandering');
  const [simulatedValues, setSimulatedValues] = useState({
    dmn: 90,
    sn: 20,
    cen: 15,
    serotonin: 35,
    dopamine: 40,
    gaba: 30
  });

  // Apply theme class to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 transition-colors duration-500 pb-12">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0b0f19]/80 border-b border-slate-200 dark:border-slate-850 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-xl shadow-md text-white">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                覺察神經
                <span className="text-[10px] py-0.5 px-1.5 rounded-full font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  學術沙盤 v1.0
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                正念冥想與大腦核心網絡的動態調節機制
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Academic Hero Block */}
        <section className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-indigo-900/40 shadow-xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-4 max-w-3xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 flex items-center gap-1.5">
              Cognitive Neuroscience & Mindfulness
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              覺察神經：正念冥想與大腦網絡的動態平衡
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              探索正念如何透過沙盤推演，調節預設模式網絡 (DMN)、突顯網絡 (SN) 與中央執行網絡 (CEN) 的神經元活動性。
              透過視覺化的參數與模擬器，學生與正念實踐者能直觀理解「分心 &rarr; 覺察 &rarr; 重新導向 &rarr; 回歸當下」的完整認知神經迴路。
            </p>
          </div>
        </section>

        {/* Dashboard Sections Layout */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* 1. Core Networks Dashboard */}
          <section className="w-full">
            <TripleNetworkCards 
              currentSimulationState={currentSimulationState} 
              simulatedValues={simulatedValues} 
            />
          </section>

          {/* 2. Interactive Mindfulness Simulator */}
          <section className="w-full">
            <MindfulnessSimulator 
              currentSimulationState={currentSimulationState}
              setSimulationState={setSimulationState}
              simulatedValues={simulatedValues}
              setSimulatedValues={setSimulatedValues}
            />
          </section>

          {/* 3. Meditation Timer & Logs */}
          <section className="w-full">
            <MeditationTracker 
              onSimulateState={(state) => {
                setSimulationState(state);
              }}
            />
          </section>

        </div>

        {/* Footer Academic References */}
        <footer className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>本工具基於 Menon, V. (2011) 的「三大網絡模型 (Triple Network Model)」學術研究設計。</span>
          </div>
          <div>
            <span>© 2026 AwareNeuro &bull; 前端與認知神經科學教具</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
