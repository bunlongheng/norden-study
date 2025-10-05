import React, { useState, useEffect } from 'react';
import { BookOpen, Pencil, Hash, Puzzle, Palette, Music, Gamepad2, Settings, X, Moon, Sun } from 'lucide-react';

const TimerApp = () => {
  const [activeMode, setActiveMode] = useState('reading');
  const [timeLeft, setTimeLeft] = useState(900);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userName, setUserName] = useState('Norden Heng');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('Norden Heng');
  const [completedModes, setCompletedModes] = useState({});
  const [sessionDuration, setSessionDuration] = useState(900);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [modes, setModes] = useState([
    { id: 'reading', name: 'Reading', icon: 'BookOpen', color: '#4A9FF5', bgColor: '#5AB2FF', enabled: true },
    { id: 'writing', name: 'Writing', icon: 'Pencil', color: '#F89057', bgColor: '#FF9A6C', enabled: true },
    { id: 'math', name: 'Math', icon: 'Hash', color: '#D946EF', bgColor: '#E879F9', enabled: true },
    { id: 'puzzle', name: 'Puzzle', icon: 'Puzzle', color: '#9B7EDE', bgColor: '#B494FF', enabled: true },
    { id: 'art', name: 'Art', icon: 'Palette', color: '#EAB308', bgColor: '#FDE047', enabled: true },
    { id: 'music', name: 'Music', icon: 'Music', color: '#5FD68A', bgColor: '#75E89D', enabled: false },
    { id: 'game', name: 'Game', icon: 'Gamepad2', color: '#FF6B9D', bgColor: '#FF8FB3', enabled: false }
  ]);

  const iconMap = { BookOpen, Pencil, Hash, Puzzle, Palette, Music, Gamepad2 };
  const currentMode = modes.find(m => m.id === activeMode);
  const enabledModes = modes.filter(m => m.enabled);

  // Update date/time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[currentDateTime.getDay()];
    const monthName = months[currentDateTime.getMonth()];
    const date = currentDateTime.getDate();
    let hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${dayName}, ${monthName} ${date}, ${hours}:${minutes} ${ampm}`;
  };

  // Load from localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem('timerCompleted');
    const savedDuration = localStorage.getItem('timerDuration');
    if (savedCompleted) setCompletedModes(JSON.parse(savedCompleted));
    if (savedDuration) {
      setSessionDuration(parseInt(savedDuration));
      setTimeLeft(parseInt(savedDuration));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('timerCompleted', JSON.stringify(completedModes));
    localStorage.setItem('timerDuration', sessionDuration.toString());
  }, [completedModes, sessionDuration]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !completedModes[activeMode]) {
      setIsRunning(false);
      const updatedCompleted = { ...completedModes, [activeMode]: true };
      setCompletedModes(updatedCompleted);
      localStorage.setItem('timerCompleted', JSON.stringify(updatedCompleted));
      setShowConfetti(true);
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const playBeep = (freq, delay = 0) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.5);
          }, delay);
        };
        playBeep(800, 0);
        playBeep(1000, 200);
      } catch (e) {}
      
      setTimeout(() => setShowConfetti(false), 4000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeMode, completedModes]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDuration - timeLeft) / sessionDuration) * 534;

  const handleStartStop = () => {
    if (!hasStarted) setHasStarted(true);
    setIsRunning(!isRunning);
  };

  const handleModeChange = (modeId) => {
    if (completedModes[modeId]) return;
    setActiveMode(modeId);
    setTimeLeft(sessionDuration);
    setIsRunning(false);
    setHasStarted(false);
  };

  const handleDurationChange = (newDuration) => {
    setSessionDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
    setHasStarted(false);
    setCompletedModes({});
  };

  const toggleModeEnabled = (modeId) => {
    setModes(modes.map(m => m.id === modeId ? { ...m, enabled: !m.enabled } : m));
  };

  const saveName = () => {
    setUserName(tempName);
    setEditingName(false);
  };

  const bgColor = isDarkMode ? '#000000' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const cardBg = isDarkMode ? '#1A1A1A' : '#F3F4F6';

  const activeModeIndex = enabledModes.findIndex(m => m.id === activeMode);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" style={{ 
      fontFamily: 'Poppins, system-ui, sans-serif',
      backgroundColor: bgColor,
      color: textColor,
      overflow: 'hidden'
    }}>
      <div className="w-full max-w-6xl flex flex-col items-center" style={{ maxHeight: '100vh' }}>
        {/* Top Bar */}
        <div className="w-full flex items-center justify-between mb-4 sm:mb-6 px-2">
          <div className="text-left">
            <p className="text-xs sm:text-sm" style={{ color: secondaryTextColor }}>{formatDateTime()}</p>
            <p className="text-xs sm:text-sm" style={{ color: secondaryTextColor }}>{userName}</p>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-2 sm:p-3 rounded-full transition-all hover:scale-110" style={{ backgroundColor: cardBg }}>
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: textColor }} />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-3 text-center" style={{ color: textColor }}>{currentMode?.name}</h1>

        {/* Status Badge */}
        {hasStarted && (
          <div className="mb-4 sm:mb-6 text-xs sm:text-sm font-medium tracking-wider uppercase px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg" style={{ 
            color: timeLeft === 0 ? '#22C55E' : (isRunning ? currentMode?.color : '#EF4444'),
            backgroundColor: cardBg,
            border: `2px solid ${timeLeft === 0 ? '#22C55E' : (isRunning ? currentMode?.color : '#EF4444')}`
          }}>
            {timeLeft === 0 ? '✓ Finished' : (isRunning ? '● In Progress' : 'Paused')}
          </div>
        )}

        {/* Coverflow Icons */}
        <div className="w-full mb-6 sm:mb-8 overflow-hidden" style={{ perspective: '1000px' }}>
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-4">
            {enabledModes.map((mode, idx) => {
              const Icon = iconMap[mode.icon];
              const isActive = idx === activeModeIndex;
              const isCompleted = completedModes[mode.id] === true;
              const offset = idx - activeModeIndex;
              
              const scale = isActive ? 1.3 : Math.max(0.6, 1 - Math.abs(offset) * 0.25);
              const rotateY = offset * 25;
              const translateX = offset * 20;
              const translateZ = isActive ? 50 : -Math.abs(offset) * 30;
              const opacity = isCompleted ? 0.25 : (isActive ? 1 : Math.max(0.4, 1 - Math.abs(offset) * 0.3));
              
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  disabled={isCompleted}
                  className="relative flex-shrink-0 transition-all duration-500 ease-out"
                  style={{
                    width: 'clamp(60px, 15vw, 100px)',
                    height: 'clamp(60px, 15vw, 100px)',
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    cursor: isCompleted ? 'not-allowed' : 'pointer',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="w-full h-full rounded-3xl flex items-center justify-center relative" style={{
                    backgroundColor: isCompleted ? '#3A3A3A' : mode.bgColor,
                    filter: isCompleted ? 'grayscale(100%)' : 'none',
                    boxShadow: isActive ? `0 0 40px ${mode.color}80, 0 20px 60px rgba(0,0,0,0.5)` : '0 10px 30px rgba(0,0,0,0.3)',
                    background: isActive && !isCompleted ? `linear-gradient(135deg, ${mode.bgColor} 0%, ${mode.color} 100%)` : mode.bgColor
                  }}>
                    <Icon className="w-1/2 h-1/2" strokeWidth={2.5} style={{ color: isCompleted ? '#666666' : 'white' }} />
                    {isCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-2xl sm:text-3xl font-bold" style={{ color: '#22C55E', textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>✓</div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timer Circle */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <button onClick={handleStartStop} disabled={timeLeft === 0} className="relative transition-all duration-200" style={{ 
            width: 'clamp(250px, 50vw, 400px)',
            height: 'clamp(250px, 50vw, 400px)',
            cursor: timeLeft === 0 ? 'default' : 'pointer',
            opacity: timeLeft === 0 ? 0.5 : 1
          }}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke={isDarkMode ? '#2A2A2A' : '#E5E7EB'} strokeWidth="12" />
              <circle cx="100" cy="100" r="85" fill="none" stroke={currentMode?.color} strokeWidth="14" strokeLinecap="round" strokeDasharray="534" strokeDashoffset={534 - progress} style={{ transition: 'stroke-dashoffset 0.5s linear' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold" style={{ 
                color: textColor,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                fontWeight: '300'
              }}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </button>
        </div>

        {/* Start/Pause Button */}
        {timeLeft !== 0 && (
          <button onClick={handleStartStop} className="px-12 sm:px-16 py-4 sm:py-5 rounded-full font-semibold text-white text-lg sm:text-xl transition-all duration-200 hover:scale-105 flex items-center gap-3" style={{ backgroundColor: '#4B5563', boxShadow: '0 4px 16px rgba(75, 85, 99, 0.3)' }}>
            <span className="text-xl sm:text-2xl">{isRunning ? '⏸' : '▶'}</span>
            {isRunning ? 'Pause' : 'Start'}
          </button>
        )}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="absolute" style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 8}px`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#FF1744', '#00E676', '#2979FF', '#FFD600'][Math.floor(Math.random() * 10)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              opacity: 0.8 + Math.random() * 0.2,
              animation: `confettiFall ${2 + Math.random() * 3}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.3}s`
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowSettings(false)}>
          <div className="w-full max-w-lg rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto" style={{ backgroundColor: cardBg }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-all" style={{ backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E7EB' }}>
              <X className="w-5 h-5" style={{ color: textColor }} />
            </button>
            <h2 className="text-3xl font-bold mb-6" style={{ color: textColor }}>Settings</h2>

            {/* Theme Toggle */}
            <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E7EB' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="font-medium">Theme</span>
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="relative w-14 h-8 rounded-full transition-all duration-300" style={{ backgroundColor: isDarkMode ? '#5AB2FF' : '#9CA3AF' }}>
                  <div className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300" style={{ left: isDarkMode ? '30px' : '4px' }}></div>
                </button>
              </div>
            </div>

            {/* Session Duration */}
            <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E7EB' }}>
              <label className="block font-medium mb-3">Session Duration</label>
              <select value={sessionDuration} onChange={(e) => handleDurationChange(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-lg outline-none font-medium" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', color: textColor, border: '2px solid #5AB2FF' }}>
                <option value={5}>5 seconds (test)</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={900}>15 minutes</option>
              </select>
              <p className="text-xs mt-2" style={{ color: secondaryTextColor }}>Changing duration will reset all timers</p>
            </div>

            {/* Name Setting */}
            <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E7EB' }}>
              <label className="block font-medium mb-2">Name</label>
              {editingName ? (
                <div className="flex gap-2">
                  <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="flex-1 px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', color: textColor, border: '2px solid #5AB2FF' }} />
                  <button onClick={saveName} className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:scale-105 transition-all">Save</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span style={{ color: textColor }}>{userName}</span>
                  <button onClick={() => { setEditingName(true); setTempName(userName); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:scale-105 transition-all">Edit</button>
                </div>
              )}
            </div>

            {/* Manage Modes */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>Manage Modes</h3>
              <div className="space-y-2">
                {modes.map(mode => (
                  <div key={mode.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E7EB' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: mode.bgColor }}>
                        {React.createElement(iconMap[mode.icon], { className: "w-5 h-5 text-white", strokeWidth: 2.5 })}
                      </div>
                      <span className="font-medium" style={{ color: textColor }}>{mode.name}</span>
                    </div>
                    <button onClick={() => toggleModeEnabled(mode.id)} className="relative w-12 h-7 rounded-full transition-all duration-300" style={{ backgroundColor: mode.enabled ? '#5FD68A' : '#6B7280' }}>
                      <div className="absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all duration-300" style={{ left: mode.enabled ? '22px' : '2px' }}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerApp;