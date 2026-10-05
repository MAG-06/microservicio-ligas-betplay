import { config } from "../config/env";
import type { KambiGroupTree } from "../types/kambi.types";

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${config.kambi.base}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    headers: config.kambi.headers,
    signal: AbortSignal.timeout(config.kambi.timeoutMs),
  });
  if (!res.ok) throw new Error(`Kambi respondio HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function getArbolLigas() {
  return get<KambiGroupTree>("/group.json", {
    lang: config.kambi.params.lang,
    market: config.kambi.params.market,
  });
}
