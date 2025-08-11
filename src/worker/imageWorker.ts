/// <reference lib="webworker" />
import { set_panic_hook, resize_image_bytes } from '../wasm/image_resizer.js';

type Req = { id: number; file: File | null; width: number; height: number };
type Res = { id: number; url: string | null; error?: string };

let initialized = false;

onmessage = async (e: MessageEvent<Req>) => {
  const { id, file, width, height } = e.data;

  try {
    if (!initialized) {
      set_panic_hook();        // wasm panic 메시지를 콘솔로 보기 좋게
      initialized = true;
    }

    if (!file) {
      postMessage({ id, url: null } satisfies Res);
      return;
    }

    const buf = new Uint8Array(await file.arrayBuffer());
    const resized = resize_image_bytes(buf, width, height);

    const blob = new Blob([resized], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    postMessage({ id, url } satisfies Res);
  } catch (err) {
    postMessage({ id, url: null, error: String(err) } satisfies Res);
  }
};
