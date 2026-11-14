import { useMemo, useState } from 'react';
import weights from '../data/forecastWeights.json';

const HORIZON = 10;
const MODELS = [
  ['baseline', 'Last reading'],
  ['ridge', 'Ridge'],
  ['neural', 'Neural network'],
  ['blend', 'Blend'],
];

export function forecast(samples, index, isUnavailable) {
  const current = samples[index];
  const history = samples.slice(Math.max(0, index - 29), index + 1);
  const values = history.map(sample => sample.values.heart_rate);
  if (values.length !== 30 || history.some((sample, i) =>
    sample.elapsed_s !== current.elapsed_s - 29 + i ||
    !Number.isFinite(values[i]) || isUnavailable(sample))) return null;

  const latest = values[29];
  const centered = values.map(value => value - latest);
  const neural = weights.neural;
  const hidden = neural['0.weight'].map((row, i) => Math.tanh(row.reduce(
    (sum, coefficient, j) => sum + coefficient * centered[j + 20] / 10, neural['0.bias'][i])));
  const future = new Map(samples.slice(index + 1, index + 11).map(sample => [sample.elapsed_s, sample]));
  return Array.from({ length: HORIZON }, (_, i) => {
    const ridge = latest + centered.reduce(
      (sum, value, j) => sum + value * weights.ridge[j][i], weights.ridge[30][i]);
    const mlp = latest + 10 * neural['2.weight'][i].reduce(
      (sum, coefficient, j) => sum + coefficient * hidden[j], neural['2.bias'][i]);
    const time = current.elapsed_s + i + 1;
    const observed = future.get(time);
    return { time, baseline: latest, ridge, neural: mlp,
      blend: weights.blend.ridgeWeight * ridge + weights.blend.neuralWeight * mlp,
      observed: observed && !isUnavailable(observed) ? observed.values.heart_rate : null };
  });
}

export default function ExperimentalForecast({ samples, index, isUnavailable }) {
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => open ? forecast(samples, index, isUnavailable) : null,
    [open, samples, index, isUnavailable]);

  return (
    <details onToggle={event => setOpen(event.currentTarget.open)} className="rounded-lg bg-[#0D1728] p-2">
      <summary className="cursor-pointer text-sm font-bold text-[#F4F7FC]">Experimental forecast</summary>
      <p className="mt-2 text-xs text-[#C7D2E3]">
        Estimated heart rate for the next 10 seconds (beats/min). Offline research on Earth hospital recordings.
        Last reading had the lowest average error on external VitalDB cases.
      </p>
      {rows ? (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-xs text-[#F4F7FC]">
            <caption className="sr-only">Forecast and recorded comparison in beats per minute</caption>
            <thead><tr>
              <th scope="col">Time</th>
              {MODELS.map(([key, label]) => <th key={key} scope="col" className="px-1">{label}</th>)}
              <th scope="col">Recorded</th>
            </tr></thead>
            <tbody>{rows.map(row => (
              <tr key={row.time}>
                <th scope="row">{row.time} s</th>
                {MODELS.map(([key]) => <td key={key} className="px-1">{row[key].toFixed(1)}</td>)}
                <td>{Number.isFinite(row.observed) ? row.observed : '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <p className="mt-2 text-xs text-[#C7D2E3]">
          Forecast needs 30 consecutive heart-rate readings. Move the slider to a point with a complete history.
        </p>
      )}
    </details>
  );
}
