/// <reference types="vitest" />
import { defineWorkersTypeScript } from 'miniflare';
import { readFileSync } from 'fs';

interface Env {
  HAIJIAO_API_BASE: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Proxy API requests to haijiao.com
    if (url.pathname.startsWith('/api/')) {
      return proxyApi(request, env);
    }

    // Serve static assets
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.ok) {
        return asset;
      }
    } catch {}

    // Fallback to index.html for SPA routing
    return env.ASSETS?.fetch(new Request(`${url.origin}/index.html`, request)) || new Response('Not Found', { status: 404 });
  },
};

async function proxyApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  // 图片代理端点：用于获取 .txt 文件并解码
  if (url.pathname === '/api/proxy-image') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return Response.json({ success: false, message: 'Missing url parameter' }, { status: 400 });
    }
    
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      if (!response.ok) {
        return Response.json({ success: false, message: 'Image fetch failed' }, { status: response.status });
      }
      
      const text = await response.text();
      return new Response(text, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return Response.json(
        { success: false, message: 'Proxy error', error: String(error) },
        { status: 502 }
      );
    }
  }

  const apiUrl = `${env.HAIJIAO_API_BASE}${request.url.replace(`${new URL(request.url).origin}/api`, '')}`;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('origin', env.HAIJIAO_API_BASE);

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
