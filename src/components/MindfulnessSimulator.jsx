import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, Crosshair, HelpCircle, Sliders, Activity, Info } from 'lucide-react';

export default function MindfulnessSimulator({ 
  currentSimulationState, 
  setSimulationState, 
  simulatedValues, 
  setSimulatedValues 
}) {
  const [isManual, setIsManual] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState(0); // 0: Idle, 1: Phase 1 (SN Alert), 2: Phase 2 (CEN), 3: Phase 3 (DMN Calm)
  const [phaseProgress, setPhaseProgress] = useState(0);

  // States settings definition
  const STATE_PRESETS = {
    wandering: {
      label: '一般心神游移 (Mind Wandering)',
      desc: 'DMN 活躍，個體陷於自發性的思考、回想與反芻中，注意力呈發散狀態。',
      dmn: 90, sn: 20, cen: 15,
      serotonin: 35, dopamine: 40, gaba: 30
    },
    alert: {
      label: '第一階段：SN 偵測游移 (Alert)',
      desc: '突顯網絡（SN）察覺到當前思緒已偏離聚焦目標，前絕葉活化度爆發，發出警訊。',
      dmn: 80, sn: 95, cen: 35,
      serotonin: 45, dopamine: 55, gaba: 40
    },
    redirect: {
      label: '第二階段：CEN 重導注意力 (Redirect)',
      desc: '中央執行網絡（CEN）介入，背外側前額葉（dlPFC）啟動認知控制，將思緒拉回呼吸。',
      dmn: 45, sn: 50, cen: 90,
      serotonin: 60, dopamine: 80, gaba: 65
    },
    focused: {
      label: '第三階段：DMN 抑制/專注平靜 (Focused)',
      desc: '注意力回歸當下，DMN 被顯著抑制，心神游移減退，大腦進入清明與放鬆狀態。',
      dmn: 15, sn: 25, cen: 80,
      serotonin: 85, dopamine: 70, gaba: 90
    },
    monitoring: {
      label: '深層開放監察 (Open Monitoring)',
      desc: '無特定對焦目標，不對任何想法或感官刺激進行評判。三大網絡維持動態和諧。',
      dmn: 30, sn: 75, cen: 65,
      serotonin: 95, dopamine: 50, gaba: 85
    }
  };

  // Synchronize state changes when manual is false
  useEffect(() => {
    if (!isManual && STATE_PRESETS[currentSimulationState]) {
      setSimulatedValues({
        dmn: STATE_PRESETS[currentSimulationState].dmn,
        sn: STATE_PRESETS[currentSimulationState].sn,
        cen: STATE_PRESETS[currentSimulationState].cen,
        serotonin: STATE_PRESETS[currentSimulationState].serotonin,
        dopamine: STATE_PRESETS[currentSimulationState].dopamine,
        gaba: STATE_PRESETS[currentSimulationState].gaba,
      });
    }
  }, [currentSimulationState, isManual]);

  // Handle auto-simulating meditation transitions progress
  useEffect(() => {
    let intervalId;
    if (simulationPhase > 0) {
      intervalId = setInterval(() => {
        setPhaseProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setPhaseProgress(0);
    }
    return () => clearInterval(intervalId);
  }, [simulationPhase]);

  // Handle phase switching based on progress
  useEffect(() => {
    if (simulationPhase > 0 && phaseProgress >= 100) {
      setPhaseProgress(0);
      if (simulationPhase === 1) {
        setSimulationPhase(2);
        setSimulationState('redirect');
      } else if (simulationPhase === 2) {
        setSimulationPhase(3);
        setSimulationState('focused');
      } else {
        setSimulationPhase(0);
      }
    }
  }, [phaseProgress, simulationPhase, setSimulationState]);

  const triggerMeditationFlow = () => {
    setIsManual(false);
    setSimulationPhase(1);
    setPhaseProgress(0);
    setSimulationState('alert');
  };

  const handleManualSlider = (key, val) => {
    if (!isManual) setIsManual(true);
    setSimulatedValues(prev => {
      const next = { ...prev, [key]: parseInt(val) };
      
      // Basic heuristic to adjust neurotransmitters based on manual inputs for educational relevance
      if (key === 'dmn') {
        next.serotonin = Math.max(10, Math.min(100, Math.round(100 - val * 0.75)));
      } else if (key === 'cen') {
        next.dopamine = Math.round(15 + val * 0.8);
      }
      next.gaba = Math.round(Math.max(15, Math.min(100, 100 - (next.dmn * 0.6) + (next.cen * 0.4))));
      
      return next;
    });
  };

  const resetSimulator = () => {
    setIsManual(false);
    setSimulationPhase(0);
    setPhaseProgress(0);
    setSimulationState('wandering');
  };

  return (
    <div className="w-full bg-white dark:bg-[#121826] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
            正念冥想狀態模擬器
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            模擬大腦自發性思考與冥想介入時的三大網絡活動演變
          </p>
        </div>

        {/* Manual control toggle */}
        <button
          onClick={() => {
            setIsManual(!isManual);
            if (isManual) resetSimulator();
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
            isManual 
              ? 'bg-amber-500/10 border-amber-300 text-amber-700 dark:text-amber-400'
              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          {isManual ? '關閉手動微調' : '開啟手動微調'}
        </button>
      </div>

      {/* Preset State Grid Selector */}
      {!isManual && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => { setSimulationPhase(0); setSimulationState('wandering'); }}
            className={`p-3.5 text-left rounded-xl border text-xs font-medium transition-all ${
              currentSimulationState === 'wandering'
                ? 'border-orange-200 bg-orange-500/5 text-orange-800 dark:text-orange-300 dark:border-orange-950/60 shadow-sm'
                : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-semibold text-sm mb-1 text-orange-600 dark:text-orange-400">一般心神游移</div>
            DMN 高度活化，思緒漫無目的遊蕩。
          </button>
          
          <button
            onClick={triggerMeditationFlow}
            disabled={simulationPhase > 0}
            className={`p-3.5 text-left rounded-xl border text-xs font-medium transition-all relative ${
              simulationPhase > 0 || ['alert', 'redirect', 'focused'].includes(currentSimulationState)
                ? 'border-indigo-200 bg-indigo-500/5 text-indigo-800 dark:text-indigo-300 dark:border-indigo-950/60 shadow-sm'
                : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            {simulationPhase > 0 && (
              <div className="absolute top-2 right-2 flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </div>
            )}
            <div className="font-semibold text-sm mb-1 text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              啟動冥想 (呼吸對焦)
            </div>
            循序啟動 SN 警覺 &rarr; CEN 介入 &rarr; DMN 抑制。
          </button>

          <button
            onClick={() => { setSimulationPhase(0); setSimulationState('monitoring'); }}
            className={`p-3.5 text-left rounded-xl border text-xs font-medium transition-all ${
              currentSimulationState === 'monitoring'
                ? 'border-emerald-200 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 dark:border-emerald-950/60 shadow-sm'
                : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-semibold text-sm mb-1 text-emerald-600 dark:text-emerald-400">深層開放監察</div>
            SN/CEN 穩健協同，全面覺察不流於批判。
          </button>
        </div>
      )}

      {/* Simulator Phase Transition Visual Timeline */}
      {simulationPhase > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-4 rounded-xl space-y-3.5 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              冥想調節階段演進中...
            </span>
            <span className="font-mono text-slate-500">{Math.round(phaseProgress)}%</span>
          </div>
          
          <div className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-teal-500 to-emerald-500 transition-all duration-100" 
              style={{ width: `${((simulationPhase - 1) * 33.3) + (phaseProgress / 3)}%` }} 
            />
          </div>

          <div className="grid grid-cols-3 text-[10px] sm:text-xs text-center font-medium text-slate-400 dark:text-slate-500">
            <div className={`transition-all duration-300 ${simulationPhase === 1 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}>
              1. SN 覺察 (警訊)
            </div>
            <div className={`transition-all duration-300 ${simulationPhase === 2 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}>
              2. CEN 重導 (鎖定)
            </div>
            <div className={`transition-all duration-300 ${simulationPhase === 3 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}>
              3. DMN 抑制 (寧靜)
            </div>
          </div>
        </div>
      )}

      {/* Detailed Current Simulation Status Description */}
      {!isManual && (
        <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {STATE_PRESETS[currentSimulationState]?.label}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {STATE_PRESETS[currentSimulationState]?.desc}
            </p>
          </div>
        </div>
      )}

      {/* Main Simulation Panel (Grid of Sliders / Progress bars and Neurotransmitters) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Networks Adjuster/Visualizer */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <span>🧠 核心網絡活化度</span>
            {isManual && <span className="text-[10px] font-normal bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded">手動調節中</span>}
          </h3>

          <div className="space-y-4">
            {/* DMN Slider / Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">預設模式網絡 (DMN)</span>
                <span className="font-mono text-amber-500 font-semibold">{simulatedValues.dmn}%</span>
              </div>
              {isManual ? (
                <input 
                  type="range" min="0" max="100" 
                  value={simulatedValues.dmn} 
                  onChange={(e) => handleManualSlider('dmn', e.target.value)}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              ) : (
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${simulatedValues.dmn}%` }} />
                </div>
              )}
            </div>

            {/* SN Slider / Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">突顯網絡 (SN)</span>
                <span className="font-mono text-rose-500 font-semibold">{simulatedValues.sn}%</span>
              </div>
              {isManual ? (
                <input 
                  type="range" min="0" max="100" 
                  value={simulatedValues.sn} 
                  onChange={(e) => handleManualSlider('sn', e.target.value)}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              ) : (
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${simulatedValues.sn}%` }} />
                </div>
              )}
            </div>

            {/* CEN Slider / Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">中央執行網絡 (CEN)</span>
                <span className="font-mono text-indigo-500 font-semibold">{simulatedValues.cen}%</span>
              </div>
              {isManual ? (
                <input 
                  type="range" min="0" max="100" 
                  value={simulatedValues.cen} 
                  onChange={(e) => handleManualSlider('cen', e.target.value)}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              ) : (
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${simulatedValues.cen}%` }} />
                </div>
              )}
            </div>
          </div>

          {/* Educational tip on DMN vs CEN anti-correlation */}
          <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-2 flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span>神經科學筆記：DMN 與 CEN 通常呈現「負相關」關係，即一者活躍時另一者會受到抑制。正念冥想有助於強化 SN 動態切換此兩網絡的效率。</span>
          </div>
        </div>

        {/* Neurotransmitter Synergy Estimator */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <span>🧪 神經遞質協同估計</span>
            <span className="text-[10px] font-normal text-slate-400">(與大腦狀態間接對應的隱喻模型)</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Serotonin (血清素) */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-2 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">血清素</span>
              <span className="text-[10px] text-slate-400 text-center">情緒穩定 / 減輕反芻</span>
              
              <div className="w-4 h-20 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden relative flex flex-col justify-end">
                <div 
                  className="w-full bg-gradient-to-t from-teal-500 to-emerald-400 transition-all duration-700 rounded-full" 
                  style={{ height: `${simulatedValues.serotonin}%` }} 
                />
              </div>
              <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">{simulatedValues.serotonin}%</span>
            </div>

            {/* Dopamine (多巴胺) */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-2 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">多巴胺</span>
              <span className="text-[10px] text-slate-400 text-center">獎賞預測 / 維持目標</span>
              
              <div className="w-4 h-20 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden relative flex flex-col justify-end">
                <div 
                  className="w-full bg-gradient-to-t from-indigo-500 to-blue-400 transition-all duration-700 rounded-full" 
                  style={{ height: `${simulatedValues.dopamine}%` }} 
                />
              </div>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{simulatedValues.dopamine}%</span>
            </div>

            {/* GABA (γ-氨基丁酸) */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-2 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">GABA</span>
              <span className="text-[10px] text-slate-400 text-center">神經抑制 / 舒緩焦慮</span>
              
              <div className="w-4 h-20 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden relative flex flex-col justify-end">
                <div 
                  className="w-full bg-gradient-to-t from-amber-500 to-orange-400 transition-all duration-700 rounded-full" 
                  style={{ height: `${simulatedValues.gaba}%` }} 
                />
              </div>
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{simulatedValues.gaba}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulation Reset or Start triggers */}
      {isManual && (
        <div className="flex justify-end gap-2 border-t border-slate-150 dark:border-slate-805 pt-4">
          <button
            onClick={resetSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重設回模擬狀態
          </button>
        </div>
      )}
    </div>
  );
}
