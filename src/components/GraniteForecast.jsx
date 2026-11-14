import { useState } from 'react';
import { assetPath } from '../utils/assetPath';

const runtimeRoot = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/';
let runtime;

async function loadRuntime() {
  const moduleUrl = runtimeRoot + 'ort.wasm.min.mjs';
  const ort = await import(/* @vite-ignore */ moduleUrl);
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.wasmPaths = runtimeRoot;
  const session = await ort.InferenceSession.create(assetPath('models/granite-ttm.onnx'), {
    executionProviders: ['wasm'],
  });
  return { ort, session };
}

export default function GraniteForecast({ samples, index, isUnavailable }) {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('');
  const history = samples.slice(Math.max(0, index - 51), index + 1);
  const anchor = samples[index].elapsed_s;
  const available = history.length === 52 && history.every((sample, i) =>
    sample.elapsed_s === anchor - 51 + i && Number.isFinite(sample.values.heart_rate) &&
    !isUnavailable(sample));

  async function run() {
    setStatus('Running Granite…');
    try {
      runtime ??= loadRuntime().catch(error => {
        runtime = undefined;
        throw error;
      });
      const { ort, session } = await runtime;
      const values = Float32Array.from(history, sample => sample.values.heart_rate);
      const output = await session.run({ history: new ort.Tensor('float32', values, [1, 52, 1]) });
      const prediction = Array.from(output.prediction.data);
      if (prediction.length !== 10 || !prediction.every(Number.isFinite)) throw new Error('Invalid forecast');
      setResult(prediction);
      setStatus('');
    } catch {
      setStatus('Granite could not run. Try again.');
    }
  }

  return (
    <section className="mt-3 border-t border-white/10 pt-2 text-xs text-[#C7D2E3]">
      <h4 className="font-bold">
        <a className="underline" href="https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2/tree/52-16-ft-l1-r2.1">
          IBM Granite TTM R2.1
        </a>
      </h4>
      <p>Experimental forecast from 52 consecutive heart-rate readings.</p>
      {available ? (
        <button type="button" disabled={status === 'Running Granite…'} onClick={run}
          className="min-h-[44px] font-bold text-[#7AD7EA] underline disabled:opacity-50">
          Run Granite forecast
        </button>
      ) : <p className="mt-1">Granite needs 52 consecutive heart-rate readings.</p>}
      <p role="status">{status}</p>
      {result && (
        <table className="mt-2 w-full text-left">
          <caption className="sr-only">Granite heart-rate forecast in beats per minute</caption>
          <thead><tr><th scope="col">Time</th><th scope="col">Granite (beats/min)</th></tr></thead>
          <tbody>{result.map((value, i) => (
            <tr key={i}><th scope="row">{anchor + i + 1} s</th><td>{value.toFixed(2)}</td></tr>
          ))}</tbody>
        </table>
      )}
    </section>
  );
}
