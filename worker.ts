/// <reference types="vitest" />
import { defineWorkersTypeScript } from 'miniflare';
import { readFileSync } from 'fs';

interface Env {
  HAIJIAO_API_BASE: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Proxy API requests to backend
    if (url.pathname.startsWith('/api/')) {
      return proxyApi(request, env);
    }

    // SPA fallback: non-API requests return index.html
    return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
  },
};

// 解析前端传入的镜像源（X-Backend），校验为合法 https 域名则作为代理目标，否则回退 env 默认
function resolveBackend(request: Request, env: Env): string {
  const backend = request.headers.get('X-Backend')
  if (backend) {
    try {
      const u = new URL(backend)
      if (u.protocol === 'https:') {
        return u.origin
      }
    } catch {
      // 忽略非法值
    }
  }
  return env.HAIJIAO_API_BASE
}

async function proxyApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const backend = resolveBackend(request, env);

  const apiUrl = `${backend}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('x-backend');
  headers.set('origin', backend);

  // Preserve auth cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  try {
    const response = await fetch(apiUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'follow',
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('access-control-allow-origin', '*');
    responseHeaders.set('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('access-control-allow-headers', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: 'Proxy error', error: String(error) },
      { status: 502 }
    );
  }
}
