import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Save, Trash2, Calendar, CheckSquare, Clock, BookOpen, AlertCircle, Heart } from 'lucide-react';

export default function MeditationTracker({ onSimulateState }) {
  const [sessionMinutes, setSessionMinutes] = useState(3);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // Checklist and text states
  const [snChecked, setSnChecked] = useState(false);
  const [cenChecked, setCenChecked] = useState(false);
  const [dmnChecked, setDmnChecked] = useState(false);
  const [notes, setNotes] = useState('');

  // Breathing state: 'inhale', 'hold', 'exhale'
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingTime, setBreathingTime] = useState(4);
  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);

  // Load logs from localStorage
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('neuro_meditation_logs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (e) {
      console.error("Failed to load logs from localStorage:", e);
    }
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            clearInterval(timerRef.current);
            // Auto transition simulator back to calm/focused when session ends
            if (onSimulateState) onSimulateState('focused');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Breathing Guidance Hook (4s Inhale, 2s Hold, 4s Exhale)
  useEffect(() => {
    if (isActive) {
      breathTimerRef.current = setInterval(() => {
        setBreathingTime((prevTime) => {
          if (prevTime <= 1) {
            setBreathingPhase((prevPhase) => {
              if (prevPhase === 'inhale') {
                return 'hold';
              } else if (prevPhase === 'hold') {
                return 'exhale';
              } else {
                return 'inhale';
              }
            });
            // Reset phase durations
            return breathingPhase === 'inhale' ? 2 : 4; // if we were inhaling, next is hold (2s); if holding, next is exhale (4s)
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(breathTimerRef.current);
      setBreathingPhase('inhale');
      setBreathingTime(4);
    }

    return () => clearInterval(breathTimerRef.current);
  }, [isActive, breathingPhase]);

  const handleTimeSelect = (mins) => {
    setSessionMinutes(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    // If starting timer, trigger focused mode in simulator
    if (!isActive && onSimulateState) {
      onSimulateState('focused');
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionMinutes * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Add Log Entry
  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!snChecked && !cenChecked && !dmnChecked && !notes.trim()) {
      alert("請填寫筆記或勾選神經覺察項目後再儲存。");
      return;
    }

    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      duration: sessionMinutes - Math.ceil(timeLeft / 60),
      checkboxes: {
        sn: snChecked,
        cen: cenChecked,
        dmn: dmnChecked
      },
      notes: notes.trim()
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('neuro_meditation_logs', JSON.stringify(updatedLogs));

    // Reset inputs
    setSnChecked(false);
    setCenChecked(false);
    setDmnChecked(false);
    setNotes('');
  };

  const handleDeleteLog = (id) => {
    const updatedLogs = logs.filter(log => log.id !== id);
    setLogs(updatedLogs);
    localStorage.setItem('neuro_meditation_logs', JSON.stringify(updatedLogs));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Left Column: Timer & Breathing Visualizer */}
      <div className="lg:col-span-7 bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm flex flex-col justify-between">
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            實踐與呼吸引導
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            配合均勻呼吸，將意念集中於呼吸感受，沉浸於正念平靜中
          </p>
        </div>

        {/* Breathing Visualizer & Countdown */}
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            
            {/* Pulsating breathing rings */}
            <div 
              className={`absolute inset-0 rounded-full bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/20 transition-all duration-1000 ${
                isActive 
                  ? breathingPhase === 'inhale' 
                    ? 'scale-110 opacity-75' 
                    : breathingPhase === 'hold' 
                    ? 'scale-110 opacity-100 ring-2 ring-indigo-400/30' 
                    : 'scale-90 opacity-20' 
                  : 'scale-90 opacity-40'
              }`}
            />
            <div 
              className={`absolute w-36 h-36 rounded-full bg-teal-500/5 dark:bg-teal-400/5 border border-teal-500/10 transition-all duration-1000 ${
                isActive 
                  ? breathingPhase === 'inhale' 
                    ? 'scale-105 opacity-80' 
                    : breathingPhase === 'hold' 
                    ? 'scale-105 opacity-90' 
                    : 'scale-95 opacity-30' 
                  : 'scale-95 opacity-50'
              }`}
            />
            
            {/* Center Core Circle */}
            <div 
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-all duration-[4000ms] ease-in-out z-10 ${
                isActive 
                  ? breathingPhase === 'inhale' 
                    ? 'bg-gradient-to-tr from-indigo-500 to-teal-400 text-white scale-110 shadow-indigo-500/20' 
                    : breathingPhase === 'hold'
                    ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-white scale-110 shadow-teal-500/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 scale-95 shadow-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-250'
              }`}
            >
              <span className="text-xs font-bold tracking-widest uppercase">
                {!isActive ? '準備' : breathingPhase === 'inhale' ? '吸氣' : breathingPhase === 'hold' ? '屏息' : '呼氣'}
              </span>
              {isActive && (
                <span className="font-mono text-sm font-semibold mt-1">
                  {breathingTime}s
                </span>
              )}
            </div>
          </div>

          {/* Time Countdown Text */}
          <div className="text-center space-y-1">
            <div className="font-mono text-4xl font-extrabold tracking-wider text-slate-800 dark:text-slate-100">
              {formatTime(timeLeft)}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Session Remaining
            </p>
          </div>
        </div>

        {/* Timer Controls & Settings */}
        <div className="space-y-4">
          {/* Quick Mins Select */}
          <div className="flex justify-center gap-2">
            {[1, 3, 5, 10].map((mins) => (
              <button
                key={mins}
                onClick={() => handleTimeSelect(mins)}
                disabled={isActive}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  sessionMinutes === mins
                    ? 'bg-slate-800 border-slate-800 text-white dark:bg-slate-200 dark:border-slate-200 dark:text-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                } disabled:opacity-40`}
              >
                {mins} 分鐘
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all active:scale-95 ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/15 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4.5 h-4.5" /> 暫停冥想
                </>
              ) : (
                <>
                  <Play className="w-4.5 h-4.5" /> 開始專注
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs text-slate-600 dark:text-slate-400 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> 重設
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Mindfulness Log / Diary */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Diary entry form */}
        <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            大腦網絡覺察日誌
          </h2>

          <form onSubmit={handleSaveLog} className="space-y-4">
            
            {/* Neuro Awareness Checkboxes */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">今日神經覺察指標</span>
              
              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-355 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={snChecked} 
                  onChange={(e) => setSnChecked(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5" 
                />
                <div>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">成功捕捉到心神游移 (SN 活化)</span>
                  <span className="block text-[10px] text-slate-450 dark:text-slate-450 mt-0.5">前絕葉成功發出分心訊號，停止自我游移。</span>
                </div>
              </label>

              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-355 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={cenChecked} 
                  onChange={(e) => setCenChecked(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5" 
                />
                <div>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">成功收回注意力焦點 (CEN 介入)</span>
                  <span className="block text-[10px] text-slate-450 dark:text-slate-450 mt-0.5">背外側前額葉（dlPFC）主動重新將注意力導向呼吸。</span>
                </div>
              </label>

              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-355 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={dmnChecked} 
                  onChange={(e) => setDmnChecked(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5" 
                />
                <div>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">感受到大腦平靜放鬆 (DMN 抑制)</span>
                  <span className="block text-[10px] text-slate-450 dark:text-slate-450 mt-0.5">自我審查與紛亂雜念顯著減輕，DMN 活動波幅降低。</span>
                </div>
              </label>
            </div>

            {/* Notes Input */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">覺察心得與隨筆</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="2"
                placeholder="記錄剛才冥想時的心神變化、身體感受或思想漂移軌跡..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-950 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              儲存神經覺察記錄
            </button>

          </form>
        </div>

        {/* History logs log tracker */}
        <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex-1 min-h-[220px] max-h-[300px] overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            神經覺察歷史紀錄 ({logs.length})
          </h2>

          {logs.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <Heart className="w-8 h-8 opacity-25" />
              <span className="text-[10px] tracking-wide">暫無日誌。完成一次冥想練習後，儲存您的首筆紀錄吧！</span>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 text-xs space-y-2 relative"
                >
                  <button 
                    onClick={() => handleDeleteLog(log.id)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <span>{log.date}</span>
                    <span>&bull;</span>
                    <span>練習 {log.duration} 分鐘</span>
                  </div>

                  {log.notes && (
                    <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 pr-5">
                      {log.notes}
                    </p>
                  )}

                  {/* Indicator Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {log.checkboxes.sn && (
                      <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                        SN 偵測
                      </span>
                    )}
                    {log.checkboxes.cen && (
                      <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                        CEN 重導
                      </span>
                    )}
                    {log.checkboxes.dmn && (
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                        DMN 抑制
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
