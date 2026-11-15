import { Database, Orbit, Radio, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import benchmark from '../data/vitalDbBenchmark.json';

const stops = [
  {
    id: 'recordings', title: 'Data from Earth', icon: Database,
    entries: [
      ['PhysioNet BIDMC', 'We prepared 53 ICU recordings from 46 patients. Two recordings power the Workspace replay and event log. Heart-rate readings from the training split were used to fit Ridge and the MLP.',
        'https://physionet.org/content/bidmc/1.0.0/'],
      ['VitalDB', 'We used 40 independent surgical cases to test the BIDMC-trained forecasts. Carrying forward the last reading had the lowest mean absolute error on the observed targets.',
        'https://physionet.org/content/vitaldb/1.0.0/'],
    ],
  },
  {
    id: 'mission-references', title: 'Spaceflight references', icon: Orbit,
    entries: [
      ['NASA Space Apps Challenge', 'The challenge brief defined the project’s focus on collecting and reviewing health indicators during long missions.',
        'https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/'],
      ['NASA Open Science Data Repository', 'We used OSDR as a research reference for the spaceflight context. The recorded readings displayed in the Workspace come from BIDMC.',
        'https://science.nasa.gov/biological-physical/data/osdr/'],
      ['NASA DONKI', 'The Planets page displays archived geomagnetic storm observations from May 2024. The Kp index describes activity at Earth and provides environmental context for the mission scenario.',
        'https://ccmc.gsfc.nasa.gov/tools/DONKI/'],
    ],
  },
  {
    id: 'forecast-models', title: 'Forecast models', icon: Radio,
    entries: [
      ['Ridge regression', 'A linear forecast trained on 30 seconds of BIDMC heart-rate history. It gives us a fitted comparison for the next 10 seconds.'],
      ['Small neural network (MLP)', 'Trained on the last 10 seconds of BIDMC heart-rate history to test whether a short nonlinear model improves the same forecast.'],
      ['IBM Granite TinyTimeMixer R2.1', 'A pretrained model evaluated without retraining. It uses 52 consecutive readings and runs via ONNX in the browser. On our BIDMC comparison, it lowered RMSE and had nearly the same MAE as the last-reading baseline. One-second data uses the model’s unknown-frequency token.',
        'https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2/tree/52-16-ft-l1-r2.1'],
      ['Last-reading baseline and blend', 'The baseline holds the latest value. The blend combines 20% Ridge and 80% MLP. The Workspace displays these experimental estimates alongside the recorded readings when available.'],
    ],
  },
];

function scrollToStop(id) {
  const target = document.getElementById(id);
  target?.focus({ preventScroll: true });
  target?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  });
}

export default function MissionEvidence() {
  return (
    <section id="mission-evidence" aria-labelledby="mission-evidence-title" tabIndex={-1}
      className="scroll-mt-28 rounded-2xl border border-[#7AD7EA]/20 bg-[#0D1728]/90 p-4 sm:p-8">
      <h2 id="mission-evidence-title" className="font-titan text-xl tracking-wide text-[#F4F7FC] sm:text-3xl">
        Data sources & forecast models
      </h2>
      <nav aria-label="Data and model sections" className="my-5 flex flex-wrap gap-2">
        {stops.map(({ id, title }) => (
          <button key={id} type="button" onClick={() => scrollToStop(id)}
            className="min-h-[44px] rounded-full border border-[#7AD7EA]/30 px-4 text-xs font-bold text-[#BCEEF6] hover:bg-[#7AD7EA]/10 focus-visible:outline-2 focus-visible:outline-[#7AD7EA]">
            {title}
          </button>
        ))}
      </nav>
      <div className="relative space-y-7 border-l border-[#7AD7EA]/30 pl-5 sm:ml-3 sm:pl-8">
        {stops.map(({ id, title, icon: Icon, entries }) => (
          <section key={id} id={id} aria-labelledby={id + '-heading'} tabIndex={-1}
            className="relative scroll-mt-28 focus-visible:outline-2 focus-visible:outline-[#7AD7EA]">
            <Icon aria-hidden="true" size={26}
              className="absolute -left-[34px] top-0 rounded-full border border-[#7AD7EA]/45 bg-[#0D1728] p-1 text-[#7AD7EA] sm:-left-[46px]" />
            <h3 id={id + '-heading'} className="mb-3 font-titan text-base text-[#F4F7FC]">{title}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {entries.map(([name, copy, url]) => (
                <article key={name} className="rounded-xl border border-white/10 bg-[#132238] p-4">
                  <h4 className="text-sm font-bold text-[#F4F7FC]">{name}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#C7D2E3]">{copy}</p>
                  {url && <a href={url} className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-[#7AD7EA] underline"
                    aria-label={`Source for ${name}`}>
                    View source <ExternalLink size={12} aria-hidden="true" />
                  </a>}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <details className="mt-6 rounded-xl border border-white/10 bg-[#132238] p-4 text-[#F4F7FC]">
        <summary className="cursor-pointer font-bold">VitalDB external benchmark</summary>
        <p className="my-3 text-sm text-[#C7D2E3]">
          {benchmark.cases} terrestrial surgical cases · {benchmark.observedTargets.toLocaleString('en-US')} observed targets.
          Errors are in beats per minute, with equal weight per case.
        </p>
        <table className="w-full text-left text-sm">
          <thead><tr><th scope="col">Method</th><th scope="col">MAE</th><th scope="col">RMSE</th></tr></thead>
          <tbody>{[['persistence', 'Last reading'], ['ridge', 'Ridge'], ['neural', 'MLP'], ['blend', 'Blend']].map(([key, name]) => (
            <tr key={key} className="border-t border-white/10">
              <th scope="row" className="py-1.5">{name}</th>
              <td>{benchmark.metrics[key].mae_bpm.toFixed(3)}</td>
              <td>{benchmark.metrics[key].rmse_bpm.toFixed(3)}</td>
            </tr>
          ))}</tbody>
        </table>
      </details>
      <Link to="/planets" className="mt-4 mr-4 inline-flex min-h-[44px] items-center text-sm font-bold text-[#7AD7EA] underline">
        Explore the space weather archive
      </Link>
      <Link to="/workspace" className="mt-6 inline-flex min-h-[44px] items-center text-sm font-bold text-[#7AD7EA] underline">
        Explore recorded telemetry in the Workspace
      </Link>
    </section>
  );
}
