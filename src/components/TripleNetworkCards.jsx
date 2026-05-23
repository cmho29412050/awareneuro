import React, { useState } from 'react';
import { Brain, Activity, Zap, Cpu, Sparkles, BookOpen } from 'lucide-react';

export default function TripleNetworkCards({ currentSimulationState, simulatedValues }) {
  const [viewMode, setViewMode] = useState('simulation'); // 'simulation' or 'academic'

  // Educational content for the academic view
  const academicDetails = [
    {
      id: 'dmn',
      title: '預設模式網絡 (DMN)',
      engName: 'Default Mode Network',
      structures: ['內側前額葉皮質 (mPFC)', '後扣帶迴皮質 (PCC)', '角迴 (Angular Gyrus)'],
      role: '當個體處於非任務導向、心神游移或回顧過去、規劃未來時活躍。與自我參照（Self-referential processing）、反芻思考（Rumination）和自傳式記憶密切相關。',
      meditationImpact: '在正念冥想期間，特別是專注呼吸時，DMN 活化度會受到顯著抑制。這有助於減輕過度的自我反芻，緩解焦慮與抑鬱情緒，帶來內心的平靜。',
      color: 'from-orange-500 to-amber-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      id: 'sn',
      title: '突顯網絡 (SN)',
      engName: 'Salience Network',
      structures: ['前扣帶迴皮質 (dACC)', '前絕葉 (Anterior Insula, AI)'],
      role: '扮演「注意力閘門」與「動態切換器」。負責監測體內外刺激的突顯性（顯著程度），並在檢測到重要變化時，協調其他大腦網絡進行切換。',
      meditationImpact: '當冥想者分心（心神游移）時，SN 會首先偵測到這一狀態偏離，隨後發出信號激活 CEN，進而抑制 DMN，完成專注力的重新導向。此過程被視為「覺察」的關鍵神經機制。',
      color: 'from-rose-500 to-red-500',
      textColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
    {
      id: 'cen',
      title: '中央執行網絡 (CEN)',
      engName: 'Central Executive Network',
      structures: ['背外側前額葉皮質 (dlPFC)', '後頂葉皮質 (PPC)'],
      role: '負責集中注意力、工作記憶、認知控制以及目標導向的行為。在執行複雜認知任務與邏輯推理時高度活躍。',
      meditationImpact: '在正念冥想中，當 SN 提示分心後，CEN 的 dlPFC 會迅速介入，主動抑制干擾並將注意力重新拉回目標（如呼吸）。持續訓練能強化大腦的認知控制力與專注度。',
      color: 'from-indigo-500 to-blue-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            大腦網絡核心看板
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Triple Network Model: 大腦功能性網絡的動態消長與調節機制
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('simulation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'simulation'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            即時模擬數值
          </button>
          <button
            onClick={() => setViewMode('academic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'academic'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            學術神經解剖
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {academicDetails.map((network) => {
          // Determine values based on current state or active simulation values
          let activationValue = 50;
          let activeWaveClass = 'neural-flow-active';
          
          if (network.id === 'dmn') {
            activationValue = simulatedValues.dmn;
            activeWaveClass = activationValue > 70 ? 'neural-flow-hyperactive' : activationValue < 30 ? 'neural-flow-subdued' : 'neural-flow-active';
          } else if (network.id === 'sn') {
            activationValue = simulatedValues.sn;
            activeWaveClass = activationValue > 70 ? 'neural-flow-hyperactive' : activationValue < 30 ? 'neural-flow-subdued' : 'neural-flow-active';
          } else if (network.id === 'cen') {
            activationValue = simulatedValues.cen;
            activeWaveClass = activationValue > 70 ? 'neural-flow-hyperactive' : activationValue < 30 ? 'neural-flow-subdued' : 'neural-flow-active';
          }

          // Custom visual state styles based on activation value
          const isHighActive = activationValue >= 70;
          const isLowActive = activationValue <= 30;

          return (
            <div
              key={network.id}
              className={`relative overflow-hidden rounded-2xl border bg-white dark:bg-[#121826] transition-all duration-500 hover:shadow-lg dark:hover:shadow-indigo-950/20 hover:-translate-y-1 ${
                isHighActive 
                  ? 'border-indigo-200 dark:border-indigo-900/50 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header Accent Line */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${network.color}`} />

              <div className="p-5 space-y-4">
                {/* Header Icon + Titles */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                      {network.engName}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                      {network.title}
                    </h3>
                  </div>
                  <div className={`p-2.5 rounded-xl ${network.bgColor} ${network.textColor}`}>
                    {network.id === 'dmn' && <Brain className="w-5 h-5" />}
                    {network.id === 'sn' && <Zap className="w-5 h-5" />}
                    {network.id === 'cen' && <Cpu className="w-5 h-5" />}
                  </div>
                </div>

                {viewMode === 'simulation' ? (
                  /* Simulation View */
                  <div className="space-y-4 py-2">
                    {/* Activation Value Slider Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">目前活動強度 (Activation)</span>
                        <span className={`font-mono text-sm ${
                          isHighActive ? 'text-rose-500 dark:text-rose-400' : isLowActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-indigo-500 dark:text-indigo-400'
                        }`}>
                          {activationValue}%
                        </span>
                      </div>
                      
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out rounded-full bg-gradient-to-r ${network.color}`}
                          style={{ width: `${activationValue}%` }}
                        />
                      </div>
                    </div>

                    {/* Animated Neural Wave visualization */}
                    <div className="h-16 w-full bg-slate-50 dark:bg-[#161d2f] rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
                      
                      {/* Interactive alert flashing for SN */}
                      {network.id === 'sn' && currentSimulationState === 'alert' && (
                        <div className="absolute inset-0 bg-red-500/10 sn-alert-pulse rounded-xl pointer-events-none" />
                      )}

                      <svg className="w-full h-full p-2" viewBox="0 0 300 40" preserveAspectRatio="none">
                        <path
                          d={`M 0,20 Q 37.5,${20 - (activationValue / 3.5)} 75,20 T 150,20 T 225,20 T 300,20`}
                          fill="none"
                          stroke={
                            network.id === 'dmn' 
                              ? (isHighActive ? '#f97316' : '#22c55e') 
                              : network.id === 'sn'
                              ? '#f43f5e'
                              : '#6366f1'
                          }
                          strokeWidth="2"
                          className={activeWaveClass}
                        />
                        <path
                          d={`M 0,20 Q 37.5,${20 + (activationValue / 5)} 75,20 T 150,20 T 225,20 T 300,20`}
                          fill="none"
                          stroke={
                            network.id === 'dmn' 
                              ? (isHighActive ? '#fbbf24' : '#86efac') 
                              : network.id === 'sn'
                              ? '#fda4af'
                              : '#a5b4fc'
                          }
                          strokeWidth="1"
                          strokeOpacity="0.5"
                          className={`${activeWaveClass} delay-150`}
                        />
                      </svg>
                    </div>

                    {/* Dynamic state label */}
                    <div className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/40">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">網絡現況</span>
                      {network.id === 'dmn' && (
                        activationValue > 70 
                          ? '🤯 DMN 高度活躍：大腦正在進行「預設模式」運作，容易產生反芻思考與分心遊移。' 
                          : '🧘 DMN 受到抑制：自我参照降低，思緒變得平靜清晰，擺脫執念。'
                      )}
                      {network.id === 'sn' && (
                        activationValue > 80 
                          ? '⚡ SN 顯著喚醒：前絕葉偵測到注意力偏離（游移），正準備發射訊號切換網絡。' 
                          : '🟢 SN 維持監控：靜態覺察，對呼吸及內外在感受保持敏感度。'
                      )}
                      {network.id === 'cen' && (
                        activationValue > 70 
                          ? '🎯 CEN 主導控制：dlPFC 介入，專注力重新鎖定在預期目標（如呼吸）。' 
                          : '💤 CEN 活動低下：缺乏認知控制，注意力處於發散、無組織狀態。'
                      )}
                    </div>
                  </div>
                ) : (
                  /* Academic / Structural View */
                  <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 block mb-1">主要解剖結構</span>
                      <div className="flex flex-wrap gap-1">
                        {network.structures.map((s, idx) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200/50 dark:border-slate-700/50">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 block mb-0.5">系統核心角色</span>
                      <p className="leading-relaxed">{network.role}</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-[11px] bg-indigo-50/20 dark:bg-indigo-950/10 p-2.5 rounded-lg border border-indigo-100/30 dark:border-indigo-900/20">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3 h-3" /> 正念冥想調節效應
                      </span>
                      <p className="leading-relaxed text-slate-600 dark:text-slate-400">{network.meditationImpact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
