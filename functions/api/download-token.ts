interface Env {
  DOWNLOAD_KV: KVNamespace;
}

const TOKEN_TTL_SECONDS = 300; // 5 minutes

export async function onRequestGet({ env }: { env: Env }) {
  const token = crypto.randomUUID();
  await env.DOWNLOAD_KV.put(`token:${token}`, "1", { expirationTtl: TOKEN_TTL_SECONDS });

  return new Response(JSON.stringify({ token }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
