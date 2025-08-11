import { useEffect, useRef, useState } from 'react';

interface ResizeOptions {
  width: number;
  height: number;
}

export const useImageResizeWorker = (file: File | null, options: ResizeOptions) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    if (!file) return;

     const worker = new Worker(
      new URL('../worker/imageWorker.ts', import.meta.url),
      { type: 'module', name: 'image-resize-worker' }
    );
    worker.addEventListener('error', e => console.error('worker error', e));
    worker.addEventListener('messageerror', e => console.error('worker messageerror', e));
    workerRef.current = worker;
    setLoading(true);

    worker.onmessage = (e) => {
      setUrl(e.data.url);
      setLoading(false);
    };

    worker.postMessage({
      file,
      width: options.width,
      height: options.height,
    });

    return () => {
      worker.terminate();
    };
  }, [file, options.width, options.height]);

  return { imageUrl: url, loading };
};