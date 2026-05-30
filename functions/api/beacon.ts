interface Env {
  LOGFLARE_API_KEY?: string;
  LOGFLARE_SOURCE_ID?: string;
}

function getClientIp(request: Request): string {
  const cf = request.cf;
  if (cf && typeof cf === "object" && "requestClientIp" in cf) {
    return cf.requestClientIp as string;
  }
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp;
  }
  return "unknown";
}

async function logToLogflare(
  env: Env,
  data: {
    platform: string;
    component: string;
    screenWidth: number;
    screenHeight: number;
    ip: string;
    referer: string | null;
    userAgent: string | null;
  }
): Promise<void> {
  const apiKey = env.LOGFLARE_API_KEY;
  const sourceId = env.LOGFLARE_SOURCE_ID;

  if (!apiKey || !sourceId) {
    return;
  }

  const logEntry = {
    message: "download_click",
    metadata: {
      platform: data.platform,
      component: data.component,
      screenWidth: data.screenWidth,
      screenHeight: data.screenHeight,
      ip: data.ip,
      referer: data.referer,
      userAgent: data.userAgent,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await fetch(`https://api.logflare.app/logs/json?source=${sourceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify([logEntry]),
    });
  } catch {
    // Silently fail logging
  }
}

export async function onRequestPost({ request, env, waitUntil }: {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<void>) => void;
}) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const platform = typeof body.platform === "string" ? body.platform : "";
  const component = typeof body.component === "string" ? body.component : "";
  const sw = typeof body.sw === "number" ? body.sw : 0;
  const sh = typeof body.sh === "number" ? body.sh : 0;

  if (!platform || !component) {
    return new Response("Missing required fields", { status: 400 });
  }

  const ip = getClientIp(request);
  const referer = request.headers.get("Referer");
  const userAgent = request.headers.get("User-Agent");

  waitUntil(
    logToLogflare(env, {
      platform,
      component,
      screenWidth: sw,
      screenHeight: sh,
      ip,
      referer,
      userAgent,
    })
  );

  return new Response(null, {
    status: 204,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
