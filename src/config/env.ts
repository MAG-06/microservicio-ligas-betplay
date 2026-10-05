import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 8000),
  host: process.env.HOST ?? "127.0.0.1",

  kambi: {
    base: "https://us.offering-api.kambicdn.com/offering/v2018/betplay",
    params: { lang: "es_CO", market: "CO", channel_id: "3", client_id: "200" },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Origin: "https://betplay.com.co",
      Referer: "https://betplay.com.co/",
    },
    timeoutMs: 15_000,
  },

  supabase: {
    url: process.env.SUPABASE_URL ?? "",
    key: process.env.SUPABASE_KEY ?? "",
  },

  syncToken: process.env.SYNC_TOKEN ?? "",
} as const;
