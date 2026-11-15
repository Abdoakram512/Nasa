import React, { useState } from 'react';
import {
  Bot, Send, Sparkles, Activity, Zap, CheckCircle2,
  ShieldAlert, Radio, WifiOff, FileText, ArrowRight, RefreshCw, Cpu
} from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

export default function AiIdentityPage({
  telemetry,
  isCommBlackout,
  onApplyCountermeasure,
  countermeasureApplied,
  onResetCountermeasure,
  onToggleBlackout
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
    },
    {
      title: "تقييم بروتوكول انقطاع الاتصال اللاسلكي",
      query: "إيه حالة الاتصال في محاكاة المهمة؟"
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-8 py-4">
      {/* 1. Header Banner */}
      <section className="p-8 sm:p-10 rounded-[32px] cinematic-card-bg border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E4783B] animate-ping" />
            <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest">
              SCRIPTED MISSION GUIDE
            </span>
          </div>
          <h1 className="font-titan text-3xl sm:text-4xl lg:text-5xl text-[#EBEBEB] uppercase leading-tight tracking-wide">
            AURA MISSION GUIDE
          </h1>
          <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed">
            Explore scripted responses about simulated crew telemetry. Experimental forecasts run in the Workspace.
          </p>
        </div>

        {/* Live Status Pill Card */}
        <div className="p-4 rounded-2xl bg-[#0D0B0A] border border-white/10 space-y-2 text-xs font-mono-tech shrink-0 w-full md:w-64">
          <div className="flex items-center justify-between">
            <span className="text-[#808080]">GUIDE MODE</span>
            <span className="text-emerald-400 font-bold">SCRIPTED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#808080]">COMM-LAG</span>
            <span className="text-[#E4783B] font-bold">{telemetry.commDelayMinutes} MIN</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#808080]">BLACKOUT MODE</span>
            <span className={isCommBlackout ? 'text-amber-400 font-bold' : 'text-[#ACACAC]'}>
              {isCommBlackout ? 'SIMULATED BLACKOUT' : 'SCENARIO READY'}
            </span>
          </div>
          <button
            onClick={onToggleBlackout}
            className="w-full mt-2 py-1.5 rounded-lg bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/30 font-bold text-[10px] transition-all"
          >
            {isCommBlackout ? 'Deactivate Blackout' : 'Simulate Blackout'}
          </button>
        </div>
      </section>

      {/* 2. Biometric Waveform & Triage Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">HEART RATE & HRV</span>
          <div className="text-xl font-titan text-[#F4F7FC] mt-0.5">{telemetry.currentHR} BPM</div>
          <span className="text-[10px] text-[#7AD7EA] font-mono-tech">RMSSD: {telemetry.currentHRV} ms</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">CEPHALAD FLUID SHIFT</span>
          <div className="text-xl font-titan text-[#7AD7EA] mt-0.5">+{telemetry.fluidShiftIndex}%</div>
          <span className="text-[10px] text-[#98A7BD] font-mono-tech">Headward Redistribution</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">TRABECULAR BMD</span>
          <div className="text-xl font-titan text-[#F4F7FC] mt-0.5">{telemetry.bmdRetention}%</div>
          <span className="text-[10px] text-rose-400 font-mono-tech">-{telemetry.bmdLoss}% loss</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">OPTIC SHEATH (SANS)</span>
          <div className="text-xl font-titan text-[#F4F7FC] mt-0.5">5.6 mm</div>
          <span className="text-[10px] text-amber-400 font-mono-tech">Intracranial ICP: 22 mmHg</span>
        </div>
      </section>

      {/* 3. Main Clinical Chat Console */}
      <section className="rounded-[32px] bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] shadow-2xl flex flex-col h-[680px] overflow-hidden">
        {/* Console Header */}
        <div className="p-4 sm:p-5 border-b border-[rgba(180,210,235,0.12)] bg-[#0D1728] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/40 flex items-center justify-center text-[#7AD7EA]">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-titan text-base text-[#F4F7FC] tracking-wide uppercase">
                  AURA Mission Guide
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7AD7EA]/20 text-[#7AD7EA] font-mono-tech font-bold">
                  NASA-STD-3001
                </span>
              </div>
              <span className="text-[10px] text-[#98A7BD] font-mono-tech">
                Deterministic Medical Copilot • Bilingual Arabic / English
              </span>
            </div>
          </div>

          {/* Neural Waveform Audio Sync */}
          <div className="hidden sm:flex items-center gap-1.5 h-4">
            {[6, 12, 20, 10, 16, 24, 14, 8, 18, 12].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-[#7AD7EA] rounded-full animate-pulse"
                style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Quick Clinical Prompts Bar */}
        <div className="p-3 bg-[#0D1728]/80 border-b border-[rgba(180,210,235,0.1)] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono-tech text-[#98A7BD] uppercase shrink-0 pl-1">
            MISSION QUESTIONS:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-right px-3 py-1.5 rounded-full bg-[#182A44] hover:bg-[#7AD7EA]/20 text-[11px] text-[#C7D2E3] hover:text-[#F4F7FC] border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 transition-all shrink-0 font-cairo"
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-sans">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-right ${
                  msg.sender === 'user'
                    ? 'bg-[#182A44] text-[#F4F7FC] border border-[#7AD7EA]/40 rounded-bl-none shadow-md font-cairo'
                    : 'bg-[#0D1728] border border-[rgba(180,210,235,0.14)] text-[#F4F7FC] rounded-br-none shadow-xl'
                }`}
              >
                <p className="leading-relaxed text-xs font-cairo text-[#F4F7FC]">{msg.text}</p>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[rgba(180,210,235,0.1)] flex flex-wrap gap-1 justify-end">
                    {msg.citations.map((cite, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded bg-[#132238] text-[#7AD7EA] border border-[#7AD7EA]/30 text-[9px] font-mono-tech"
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
            <div className="flex items-center gap-2 text-[#E4783B] text-xs font-mono-tech justify-end">
              <span>Loading the scripted mission response…</span>
              <span className="w-2 h-2 rounded-full bg-[#E4783B] animate-ping" />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[rgba(180,210,235,0.12)] bg-[#0D1728]">
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
              className="p-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#d46a30] text-[#07111F] font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(228,120,59,0.3)] shrink-0"
            >
              <Send size={16} className="rotate-180" />
            </button>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="اسأل AURA عن المؤشرات الحيوية، العظام، أو بروتوكول SANS..."
              className="flex-1 bg-[#132238] border border-[rgba(180,210,235,0.14)] focus:border-[#7AD7EA] rounded-xl px-4 py-3 text-xs text-[#F4F7FC] placeholder-[#98A7BD] outline-none transition-all text-right font-cairo"
            />
          </form>
        </div>
      </section>
    </div>
  );
}
