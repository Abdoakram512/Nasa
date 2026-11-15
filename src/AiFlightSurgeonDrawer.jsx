import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, X, ShieldAlert, Cpu, ArrowRight, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';

export default function AiFlightSurgeonDrawer({
  isOpen,
  onClose,
  telemetry,
  isCommBlackout,
  onApplyCountermeasure,
  countermeasureApplied
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `أهلًا، أنا AURA، دليل المهمة. الردود هنا مُعدّة مسبقًا وبتشرح مؤشرات الطاقم في المحاكاة. تقدر تجرّب موديلات توقع النبض في Experimental forecast داخل Workspace.`,
      citations: ['NASA-STD-3001 Vol 1', 'HRP-BHP-2026', 'ExMC Local Core'],
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const quickPrompts = [
    {
      title: "لماذا ينخفض معدل تقلب نبضات القلب (HRV)؟",
      query: `لماذا ينخفض معدل تقلب نبضات القلب (HRV) في اليوم ${telemetry.missionDay} من المهمة؟`
    },
    {
      title: "تقييم انتقال السوائل الرأسي ومتلازمة SANS",
      query: "إيه اللي بتعرضه بطاقة SANS في محاكاة الطاقم؟"
    },
    {
      title: "توليد تعديل تدريب ARED وتوازن الكالسيوم",
      query: "إزاي سيناريو المهمة بيعرض كثافة العظام وجهاز ARED؟"
    }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    spaceAudio.playChirp();

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponse = '';
      let citations = [];

      const q = query.toLowerCase();
      if (q.includes('hrv') || q.includes('قلب') || q.includes('نبض') || q.includes('heart') || q.includes('variability')) {
        aiResponse = `في محاكاة اليوم ${telemetry.missionDay}، تقلب معدل القلب (HRV) للطاقم هو ${telemetry.currentHRV} ms. استخدم الـWorkspace لمراجعة تسجيلات القلب الفعلية وتجربة التوقعات.`;
        citations = ['NASA-STD-3001 Vol 1', 'HRP-47052', 'LSDA-ISS-CV'];
      } else if (q.includes('عظام') || q.includes('bone') || q.includes('ared') || q.includes('calcium') || q.includes('كالسيوم')) {
        aiResponse = `مؤشر كثافة العظام في سيناريو الطاقم هو ${telemetry.bmdRetention}%. تقدر تستكشف محاكاة جهاز المقاومة من الـWorkspace.`;
        citations = ['LSDA-BMD-ISS-04', 'NASA HRP Bone Evidence', 'NASA-STD-3001'];
      } else if (q.includes('sans') || q.includes('عين') || q.includes('بصر') || q.includes('vision') || q.includes('optic') || q.includes('سوائل')) {
        aiResponse = `مؤشر انتقال السوائل نحو الرأس في سيناريو الطاقم هو ${telemetry.fluidShiftIndex}%. بطاقة SANS في الـWorkspace بتعرض سياق الحالة المُحاكاة.`;
        citations = ['HRP-SANS-4819', 'NASA-STD-3001 Rev B'];
      } else {
        aiResponse = `دي لقطة من محاكاة اليوم ${telemetry.missionDay}. حالة الاتصال في السيناريو: ${isCommBlackout ? 'انقطاع مُحاكى' : 'الاتصال متاح في السيناريو'}. اسأل عن القلب أو العظام أو العين لاستكشاف الردود الجاهزة.`;
        citations = ['NASA-STD-3001', 'NASA IMM Model'];
      }

      setMessages([...newMessages, { sender: 'ai', text: aiResponse, citations }]);
      setIsGenerating(false);
      spaceAudio.playBeep(1600, 0.1);
    }, 600);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile-Friendly Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:max-w-lg bg-[#0D1728]/98 border-l border-[rgba(180,210,235,0.14)] backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between select-none font-sans">
        {/* 1. Header with Neural Pulse Visualizer */}
        <div className="p-4 border-b border-[rgba(180,210,235,0.14)] bg-[#07111F] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/40 flex items-center justify-center text-[#7AD7EA] shadow-[0_0_20px_rgba(122,215,234,0.25)]">
            <Bot size={22} />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#7AD7EA] border-2 border-[#07111F] animate-ping" />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F4F7FC] tracking-wider font-titan">AURA Mission Guide</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7AD7EA]/15 text-[#7AD7EA] border border-[#7AD7EA]/40 font-mono-tech">
                ExMC CDSS
              </span>
            </div>
            <div className="text-[10px] text-[#98A7BD] font-mono-tech flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7AD7EA] animate-pulse" />
              <span>{isCommBlackout ? 'SIMULATED BLACKOUT' : 'CREW SIMULATION'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-[#98A7BD] hover:text-[#F4F7FC] p-2 rounded-xl hover:bg-[#132238] border border-transparent hover:border-[rgba(180,210,235,0.14)] transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Real-Time Biometric Neural Waveform */}
      <div className="px-4 py-2.5 bg-[#132238]/60 border-b border-[rgba(180,210,235,0.1)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-[#7AD7EA] animate-pulse" />
          <span className="text-[10px] font-mono-tech text-[#C7D2E3] uppercase">
            Biometric Sync: {telemetry.currentHR} BPM • {telemetry.currentHRV} ms
          </span>
        </div>

        {/* Animated Sound / Neural Wave Bars */}
        <div className="flex items-center gap-1 h-4">
          {[8, 14, 22, 12, 18, 10, 16, 24, 11, 7].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-[#7AD7EA] rounded-full animate-pulse"
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      </div>

      {/* 3. Quick Medical Inquiry Chips */}
      <div className="p-3 border-b border-[rgba(180,210,235,0.1)] bg-[#07111F]/80">
        <div className="text-[10px] text-[#98A7BD] font-mono-tech mb-2 flex items-center gap-1 text-right">
          <Sparkles size={11} className="text-[#7AD7EA]" />
          <span>أسئلة عن محاكاة المهمة</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-right px-3 py-2 rounded-xl bg-[#132238] hover:bg-[#182A44] border border-[rgba(180,210,235,0.12)] hover:border-[#7AD7EA]/50 text-[11px] text-[#C7D2E3] hover:text-[#F4F7FC] transition-all flex items-center justify-between group font-cairo"
            >
              <span className="truncate">{p.title}</span>
              <ArrowRight size={12} className="text-[#98A7BD] group-hover:text-[#7AD7EA] opacity-60 group-hover:opacity-100 transition-all ml-1 shrink-0 rotate-180" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`max-w-[92%] p-3.5 rounded-2xl text-right ${
                msg.sender === 'user'
                  ? 'bg-[#182A44] border border-[rgba(122,215,234,0.3)] text-[#F4F7FC] rounded-bl-none shadow-md font-cairo'
                  : 'bg-[#132238] border border-[rgba(180,210,235,0.14)] text-[#F4F7FC] rounded-br-none shadow-xl'
              }`}
            >
              <p className="leading-relaxed text-[11px] font-cairo">{msg.text}</p>

              {/* Citations Footer */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[rgba(180,210,235,0.1)] flex flex-wrap gap-1 justify-end">
                  {msg.citations.map((cite, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded bg-[#07111F] text-[#7AD7EA] border border-[#7AD7EA]/30 text-[9px] font-mono-tech"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-[#7AD7EA] text-xs font-mono-tech justify-end">
            <span>Loading the scripted mission response…</span>
            <span className="w-2 h-2 rounded-full bg-[#7AD7EA] animate-ping" />
          </div>
        )}
      </div>

      {/* 5. Input Dock */}
      <div className="p-3 border-t border-[rgba(180,210,235,0.14)] bg-[#07111F]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="submit"
            disabled={!inputQuery.trim() || isGenerating}
            className="p-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#C86026] text-white font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(228,120,59,0.3)] shrink-0"
          >
            <Send size={16} className="rotate-180" />
          </button>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="اسأل AURA عن المؤشرات الحيوية، العظام، أو SANS..."
            className="flex-1 bg-[#0D1728] border border-[rgba(180,210,235,0.14)] focus:border-[#7AD7EA] rounded-xl px-4 py-2.5 text-xs text-[#F4F7FC] placeholder-[#98A7BD] outline-none transition-all text-right font-cairo"
          />
        </form>
      </div>
    </div>
    </>
  );
}
