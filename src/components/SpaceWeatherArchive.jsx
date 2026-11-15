import { useState } from 'react';
import storms from '../data/donkiStorms.json';

const utc = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
});

export default function SpaceWeatherArchive() {
  const [index, setIndex] = useState(0);
  const storm = storms[index];
  const peak = Math.max(...storm.observations.map(row => row.kpIndex));
  return (
    <details className="rounded-2xl border border-[#7AD7EA]/20 bg-[#0D1728]/90 p-4 text-[#F4F7FC]">
      <summary className="min-h-[44px] cursor-pointer font-bold">Historical space weather · NASA DONKI</summary>
      <div className="space-y-3">
        <p className="text-sm text-[#C7D2E3]">
          Archived geomagnetic storms from May 2024. NOAA observations reported by DONKI show geomagnetic activity at Earth and provide context for the mission simulation.
        </p>
        <label className="block text-sm">
          Storm start (UTC)
          <select value={index} onChange={event => setIndex(Number(event.target.value))}
            className="ml-2 min-h-[44px] rounded bg-[#132238] px-2">
            {storms.map((entry, i) => <option key={entry.id} value={i}>{utc.format(new Date(entry.startUtc))}</option>)}
          </select>
        </label>
        <p className="font-mono-tech text-sm text-[#7AD7EA]">Peak Kp in this record: {peak}</p>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead><tr><th scope="col">Observation (UTC)</th><th scope="col">Kp (0–9)</th></tr></thead>
            <tbody>{storm.observations.map(row => (
              <tr key={row.observedTime} className="border-t border-white/10">
                <th scope="row" className="py-1.5 pr-2 font-normal">{utc.format(new Date(row.observedTime))}</th>
                <td className="w-1/2">
                  <div className="flex items-center gap-2">
                    <span className="w-10">{row.kpIndex}</span>
                    <span aria-hidden="true" className="h-2 flex-1 rounded bg-[#132238]">
                      <span className="block h-full rounded bg-[#7AD7EA]" style={{ width: `${row.kpIndex / 9 * 100}%` }} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <a href={storm.url} className="inline-flex min-h-[44px] items-center text-sm font-bold text-[#7AD7EA] underline">
          Open original DONKI storm record
        </a>
      </div>
    </details>
  );
}
