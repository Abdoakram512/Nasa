import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Activity, Bone, Eye, Zap, Radio, ShieldCheck,
  CheckCircle2, ArrowRight, Sliders, ExternalLink
} from 'lucide-react';
import { assetPath } from '../utils/assetPath';

export default function FeaturesPage() {
  const featureList = [
    {
      id: 'aura-ai',
      badge: "MISSION GUIDE",
      title: "AURA Mission Guide",
      subtitle: "Scripted mission explanations",
      description: "Explore simulated heart, bone and eye indicators through preset responses.",
      bullets: ["Questions about the current mission scenario", "Research references alongside the responses"],
      linkText: 'Open AURA Console',
      linkUrl: '/ai-identity',
      image: assetPath('astronaut_portrait.jpg')
    },
    {
      id: 'bio-twin',
      badge: "RECORDED TELEMETRY",
      title: "Vital Signs & Forecasts",
      subtitle: "PhysioNet BIDMC replay",
      description: "Review Earth ICU recordings, jump to signal events and compare experimental forecasts.",
      bullets: ["Four recorded vital signs", "Missing readings and simulated signal dropout", "Ridge, MLP and IBM Granite forecasts"],
      linkText: 'Open Telemetry Workspace',
      linkUrl: '/workspace',
      image: assetPath('hemodynamics_scan.jpg')
    },
    {
      id: 'eva-3d',
      badge: "INTERACTIVE VIEWPORT",
      title: "3D Astronaut & Anatomy",
      subtitle: "Interactive mission visualization",
      description: "Rotate the astronaut and explore the anatomy of the simulated crew member.",
      bullets: ["Touch and mouse controls", "Animated anatomy and simulated indicators"],
      linkText: 'Inspect 3D Spacesuit',
      linkUrl: '/workspace',
      image: assetPath('sans_scan.jpg')
    },
    {
      id: 'countermeasures',
      badge: "MISSION OPERATIONS",
      title: "Countermeasure Simulation",
      subtitle: "Scenario controls",
      description: "Try a simulated exercise protocol and observe the change in the scenario.",
      bullets: ["Simulated resistance exercise", "Local scenario state updates"],
      linkText: 'Open Mission Simulation',
      linkUrl: '/workspace',
      image: assetPath('ared_exercise.jpg')
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto px-3.5 sm:px-8 py-3 sm:py-4">
      {/* Header Banner */}
      <section className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] cinematic-card-bg border border-[rgba(180,210,235,0.14)] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-widest block">
            NASA SPACE APPS PROTOTYPE
          </span>
          <h1 className="font-titan text-2xl sm:text-4xl lg:text-5xl text-[#F4F7FC] uppercase leading-tight tracking-wide">
            EXPLORE MISSION FEATURES
          </h1>
          <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed">
            Explore the recording viewer, experimental forecasts and interactive mission simulation.
          </p>
        </div>
      </section>

      {/* Feature Showcase Rows */}
      <section className="space-y-6 sm:space-y-8">
        {featureList.map((feat, idx) => (
          <div
            key={feat.id}
            className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[28px] bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 hover:shadow-[0_15px_40px_rgba(7,17,31,0.8)] transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Visual Preview */}
            <div className={`lg:col-span-5 relative rounded-2xl overflow-hidden border border-[rgba(180,210,235,0.16)] shadow-xl h-64 sm:h-72 group ${
              idx % 2 === 1 ? 'lg:order-2' : ''
            }`}>
              <img
                src={feat.image}
                alt={feat.title}
                className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[9px] font-mono-tech px-2.5 py-1 rounded-full bg-[#07111F]/90 text-[#7AD7EA] border border-[#7AD7EA]/40 font-bold uppercase backdrop-blur-md">
                  {feat.badge}
                </span>
              </div>
            </div>

            {/* Description & Bullets */}
            <div className={`lg:col-span-7 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div>
                <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider block mb-1">
                  {feat.subtitle}
                </span>
                <h3 className="font-titan text-xl sm:text-2xl text-[#F4F7FC] uppercase tracking-wide">
                  {feat.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed font-sans">
                {feat.description}
              </p>

              <ul className="space-y-2 text-xs text-[#F4F7FC] font-sans">
                {feat.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#7AD7EA] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  to={feat.linkUrl}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.3)] hover:scale-105"
                >
                  <span>{feat.linkText}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
