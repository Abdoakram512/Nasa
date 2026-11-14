import { useEffect, useId, useMemo, useState } from 'react';
import { assetPath } from '../utils/assetPath';

const METRICS = [
  ['heart_rate', 'Heart rate'],
  ['pulse_rate', 'Pulse rate'],
  ['respiratory_rate', 'Respiratory rate'],
  ['spo2', 'SpO₂'],
];
const DROPOUT_START_S = 20;
const DROPOUT_END_S = 30;
const HEART_RATE_CHANGE_BPM = 3;
const RECORDINGS = {
  bidmc_02: 'telemetry/bidmc-recorded.json',
  bidmc_08: 'telemetry/bidmc_08.json',
};

function isInDropout(sample) {
  return sample && sample.elapsed_s >= DROPOUT_START_S && sample.elapsed_s < DROPOUT_END_S;
}

function getHeartRateChange(sample, previous, simulateDropout) {
  if (!sample || !previous || sample.elapsed_s - previous.elapsed_s !== 1 ||
      (simulateDropout && (isInDropout(sample) || isInDropout(previous)))) return null;
  const current = sample.values.heart_rate;
  const prior = previous.values.heart_rate;
  if (!Number.isFinite(current) || !Number.isFinite(prior)) return null;
  const change = current - prior;
  return Math.abs(change) >= HEART_RATE_CHANGE_BPM ? change : null;
}

function getMissingCount(sample) {
  return METRICS.filter(([metric]) => !Number.isFinite(sample.values[metric])).length;
}

function getEvents(samples, simulateDropout) {
  const events = [];
  let missingPeriod;
  samples.forEach((sample, index) => {
    const previous = samples[index - 1];
    const missingLabel = simulateDropout && isInDropout(sample)
      ? 'SIMULATED · Signal dropout'
      : getMissingCount(sample) ? 'RECORDED · Missing readings' : null;
    if (!missingLabel) {
      missingPeriod = undefined;
    } else if (missingPeriod?.label === missingLabel && sample.elapsed_s - previous.elapsed_s === 1) {
      missingPeriod.end = sample.elapsed_s;
    } else {
      missingPeriod = { index, label: missingLabel, start: sample.elapsed_s, end: sample.elapsed_s };
      events.push(missingPeriod);
    }

    const change = getHeartRateChange(sample, previous, simulateDropout);
    if (change !== null) {
      events.push({ index, label: `RECORDED · Heart rate ${previous.values.heart_rate} → ${sample.values.heart_rate} beats/min`,
        start: sample.elapsed_s, end: sample.elapsed_s });
    }
  });
  return events;
}

export default function RecordedTelemetry() {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [recordingId, setRecordingId] = useState('bidmc_02');
  const selectorId = useId();
  const [record, setRecord] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [simulateDropout, setSimulateDropout] = useState(false);

  useEffect(() => {
    if (!isOpen || record) return;
    const controller = new AbortController();
    setHasError(false);

    async function loadRecording() {
      try {
        const response = await fetch(assetPath(RECORDINGS[recordingId]), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Recording unavailable');
        const data = await response.json();
        if (data.schema_version !== '1.0.0' || data.data_source !== 'RECORDED' ||
            data.stream_id !== recordingId || !data.samples?.length) {
          throw new Error('Unexpected recording');
        }
        if (!controller.signal.aborted) setRecord(data);
      } catch {
        if (!controller.signal.aborted) setHasError(true);
      }
    }

    loadRecording();
    return () => controller.abort();
  }, [isOpen, record, recordingId]);

  const sample = record?.samples[sampleIndex];
  const previousSample = record?.samples[sampleIndex - 1];
  const dropout = simulateDropout && isInDropout(sample);
  const heartRateChange = getHeartRateChange(sample, previousSample, simulateDropout);
  const missingCount = sample ? getMissingCount(sample) : 0;
  const events = useMemo(() => getEvents(record?.samples ?? [], simulateDropout),
    [record, simulateDropout]);
  const status = dropout ? 'Signal unavailable · Simulated dropout'
    : missingCount === METRICS.length ? 'Signal unavailable · All recorded readings are missing'
    : missingCount > 0 ? 'Some recorded readings are missing' : '';

  return (
    <details
      onToggle={(event) => {
        if (event.target === event.currentTarget) setIsOpen(event.currentTarget.open);
      }}
      className="rounded-2xl border border-[#7AD7EA]/25 bg-[#132238]/90 p-4"
    >
      <summary className="cursor-pointer text-sm font-bold text-[#F4F7FC]">
        Recorded telemetry <span className="ml-1 text-[10px] font-mono-tech text-[#7AD7EA]">RECORDED</span>
      </summary>
      <div className="mt-3 space-y-3">
        <p className="text-xs text-[#C7D2E3]">
          Hospital ICU readings from Earth. This recording is independent of the crew simulation.
        </p>
        <label htmlFor={selectorId} className="block text-xs text-[#C7D2E3]">Recording</label>
        <select
          id={selectorId}
          value={recordingId}
          className="min-h-[44px] w-full rounded-lg bg-[#0D1728] px-2 text-sm text-[#F4F7FC]"
          onChange={(event) => {
            setRecordingId(event.target.value);
            setRecord(null);
            setHasError(false);
            setSampleIndex(0);
            setSimulateDropout(false);
          }}
        >
          <option value="bidmc_02">BIDMC 02</option>
          <option value="bidmc_08">BIDMC 08 · Heart-rate change example</option>
        </select>
        {recordingId === 'bidmc_08' && (
          <p className="text-xs text-[#C7D2E3]">Try 448 s to see a heart-rate change.</p>
        )}
        {sample ? (
          <>
            <label className="flex min-h-[44px] items-center gap-2 text-xs text-[#C7D2E3]">
              <input
                type="checkbox"
                checked={simulateDropout}
                onChange={(event) => setSimulateDropout(event.target.checked)}
                className="accent-[#7AD7EA]"
              />
              Simulate signal dropout (20–30 s)
            </label>
            {simulateDropout && (
              <p className="text-xs font-bold text-[#7AD7EA]">SIMULATED · Dropout replay</p>
            )}
            <label htmlFor={inputId} className="block text-xs text-[#C7D2E3]">
              Sample time · {sample.elapsed_s} s from recording start
            </label>
            <input
              id={inputId}
              type="range"
              min={0}
              max={record.samples.length - 1}
              step={1}
              value={sampleIndex}
              aria-valuetext={`${sample.elapsed_s} seconds from recording start`}
              onChange={(event) => setSampleIndex(Number(event.target.value))}
              className="w-full accent-[#7AD7EA]"
            />
            <div role="status" className="text-xs font-bold text-amber-300">{status}</div>
            <div role="status" aria-label="Heart rate change" className="text-xs text-[#C7D2E3]">
              {heartRateChange !== null && (
                <>
                  <strong>Heart rate changed {heartRateChange > 0 ? '+' : ''}{heartRateChange} beats/min in 1 s.</strong>
                  {' '}Demo threshold: {HEART_RATE_CHANGE_BPM} beats/min. For recording review only.
                </>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-2">
              {METRICS.map(([metric, label]) => (
                <div key={metric} className="rounded-lg bg-[#0D1728] p-2">
                  <dt className="text-xs text-[#C7D2E3]">{label}</dt>
                  <dd className="text-sm font-mono-tech text-[#F4F7FC]">
                    {dropout || !Number.isFinite(sample.values[metric])
                      ? 'Missing'
                      : `${sample.values[metric]} ${record.units[metric]}`}
                  </dd>
                </div>
              ))}
            </dl>
            <details className="rounded-lg bg-[#0D1728] p-2">
              <summary className="cursor-pointer text-sm font-bold text-[#F4F7FC]">
                Event log ({events.length})
              </summary>
              {events.length ? (
                <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                  {events.map(({ index, label, start, end }) => (
                    <li key={`${index}-${label}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setSampleIndex(index);
                          document.getElementById(inputId)?.focus();
                        }}
                        className="min-h-[44px] w-full rounded px-2 text-left text-xs text-[#C7D2E3] hover:bg-[#132238] focus-visible:outline-2 focus-visible:outline-[#7AD7EA]"
                      >
                        {start === end ? `${start} s` : `${start}–${end} s`} · {label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-2 text-xs text-[#C7D2E3]">No events in this recording.</p>}
            </details>
          </>
        ) : (
          <p role="status" className="text-xs text-[#C7D2E3]">
            {hasError ? 'Recording unavailable. Reopen this panel to retry.' : 'Loading recording…'}
          </p>
        )}
        <p className="text-xs text-[#C7D2E3]">
          <a className="underline" href="https://physionet.org/content/bidmc/1.0.0/">
            Pimentel et al. · PhysioNet BIDMC v1.0.0
          </a>
          {record && ` · ${record.stream_id}`}
          {' · '}
          <a className="underline" href="https://opendatacommons.org/licenses/by/1-0/">ODC-BY 1.0</a>
        </p>
      </div>
    </details>
  );
}
