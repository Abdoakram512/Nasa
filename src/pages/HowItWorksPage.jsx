import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Cpu, ShieldAlert, Zap, Radio, CheckCircle2,
  ArrowRight, FileText, Database, Compass
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: "Load a recorded session",
      subtitle: "PhysioNet BIDMC",
      desc: "Open the Workspace and select an Earth ICU recording.",
      details: ["Heart rate, pulse, breathing rate and oxygen saturation", "Original timing, units and missing readings"],
      icon: Activity
    },
    {
      num: '02',
      title: "Review signal quality",
      subtitle: "Event log",
      desc: "Jump to recorded changes and missing readings, or enable a labeled dropout simulation.",
      details: ["Recorded and simulated events carry source labels", "The heart-rate change marker uses a demo threshold"],
      icon: ShieldAlert
    },
    {
      num: '03',
      title: "Compare forecasts",
      subtitle: "Browser-based experiments",
      desc: "Run Ridge, the MLP or IBM Granite TinyTimeMixer and review their estimates alongside the last-reading baseline.",
      details: ["Ten-second heart-rate forecasts", "Recorded future values appear when available"],
      icon: Cpu
    },
    {
      num: '04',
      title: "Explore the mission",
      subtitle: "Crew and environment simulation",
      desc: "Use the 3D viewport and planet pages to explore the context of a simulated journey.",
      details: ["Simulated crew telemetry", "AURA provides scripted explanations"],
      icon: Zap
    },
    {
      num: '05',
      title: "Try mission operations",
      subtitle: "Local demonstrations",
      desc: "Explore communication blackout, a simulated countermeasure and a mock DSN transmission.",
      details: ["Mission actions update the demo locally"],
      icon: Radio
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto px-3.5 sm:px-8 py-3 sm:py-4">
      {/* 1. Header Banner */}
      <section className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] cinematic-card-bg border border-[rgba(180,210,235,0.14)] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-widest block">
            HOW IT WORKS • MISSION HEALTH DEMO
          </span>
          <h1 className="font-titan text-2xl sm:text-4xl lg:text-5xl text-[#F4F7FC] uppercase leading-tight tracking-wide">
            FROM RECORDING TO REVIEW
          </h1>
          <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed">
            Follow the same workflow available in the Workspace.
          </p>
        </div>
      </section>

      {/* 2. Step-by-Step Interactive Workflow */}
      <section className="space-y-6">
        <div className="space-y-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-6 sm:p-8 rounded-[28px] bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                {/* Number & Icon */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between gap-4">
                  <span className="font-titan text-4xl sm:text-5xl text-[#7AD7EA] drop-shadow-[0_0_20px_rgba(122,215,234,0.3)]">
                    {st.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA]">
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-mono-tech text-[#98A7BD] uppercase block">
                    STEP {st.num} OF 05
                  </span>
                </div>

                {/* Content */}
                <div className="md:col-span-9 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider block mb-1">
                      {st.subtitle}
                    </span>
                    <h3 className="font-titan text-xl sm:text-2xl text-[#F4F7FC] uppercase tracking-wide">
                      {st.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed font-sans">
                    {st.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {st.details.map((d, dIdx) => (
                      <div key={dIdx} className="p-2.5 rounded-xl bg-[#0D1728] border border-[rgba(180,210,235,0.1)] flex items-start gap-2 text-xs text-[#F4F7FC]">
                        <CheckCircle2 size={13} className="text-[#7AD7EA] shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <section className="p-8 rounded-[28px] bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-titan text-xl text-[#F4F7FC] uppercase">
            EXPERIENCE THE PLATFORM IN ACTION
          </h3>
          <p className="text-xs text-[#C7D2E3] mt-1">
            Open the Mission Control Workspace to explore the crew simulation and review recorded vital signs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/workspace"
            className="px-6 py-2.5 rounded-full bg-[#E4783B] text-[#07111F] font-bold text-xs tracking-wider transition-all hover:bg-[#d46a30] shadow-[0_0_18px_rgba(228,120,59,0.3)]"
          >
            ENTER WORKSPACE
          </Link>
          <Link
            to="/ai-identity"
            className="px-6 py-2.5 rounded-full bg-[#182A44] text-[#F4F7FC] border border-[#7AD7EA]/30 font-bold text-xs tracking-wider transition-all hover:bg-[#1f3657]"
          >
            AURA Mission Guide
          </Link>
        </div>
      </section>
    </div>
  );
}
