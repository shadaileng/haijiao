/// <reference types="vitest" />
import { defineWorkersTypeScript } from 'miniflare';
import { readFileSync } from 'fs';

interface Env {
  HAIJIAO_API_BASE: string;
}

interface PeerRecord {
  id: string;
  nickname: string;
  lastSeen: number;
}

// P2P 信令服务器内存存储
const p2pPeers = new Map<string, PeerRecord>();
const PEER_TIMEOUT = 30 * 60 * 1000; // 30分钟
let lastCleanup = Date.now();

function cleanupPeers(): void {
  const now = Date.now();
  if (now - lastCleanup < 60 * 1000) return;

  for (const [id, peer] of p2pPeers) {
    if (now - peer.lastSeen > PEER_TIMEOUT) {
      p2pPeers.delete(id);
    }
  }
  lastCleanup = now;
}

function handleP2P(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/p2p', '');

  if (path === '/register' && request.method === 'POST') {
    return handleRegister(request);
  }
  if (path === '/unregister' && request.method === 'POST') {
    return handleUnregister(request);
  }
  if (path === '/offer' && request.method === 'POST') {
    return handleOffer(request);
  }
  if (path === '/answer' && request.method === 'POST') {
    return handleAnswer(request);
  }
  if (path === '/candidate' && request.method === 'POST') {
    return handleCandidate(request);
  }
  if (path === '/heartbeat' && request.method === 'POST') {
    return handleHeartbeat(request);
  }

  return Promise.resolve(Response.json(
    { success: false, message: 'Not found' },
    { status: 404 }
  ));
}

async function handleRegister(request: Request): Promise<Response> {
  const body = await request.json() as { peerId: string; nickname?: string };
  const { peerId, nickname } = body;

  cleanupPeers();

  const peers = Array.from(p2pPeers.values())
    .filter(p => p.id !== peerId)
    .map(p => p.id);

  p2pPeers.set(peerId, {
    id: peerId,
    nickname: nickname || `设备 ${peerId.slice(0, 8)}`,
    lastSeen: Date.now(),
  });

  return Response.json({ success: true, peers });
}

async function handleUnregister(request: Request): Promise<Response> {
  const body = await request.json() as { peerId: string };
  p2pPeers.delete(body.peerId);

  return Response.json({ success: true });
}

async function handleOffer(request: Request): Promise<Response> {
  const body = await request.json() as { from: string; to: string; sdp: unknown };
  // 信令转发：实际实现中需要通过 WebSocket 或其他机制转发
  // 这里仅记录，实际转发在客户端之间进行
  return Response.json({ success: true });
}

async function handleAnswer(request: Request): Promise<Response> {
  const body = await request.json() as { from: string; to: string; sdp: unknown };
  return Response.json({ success: true });
}

async function handleCandidate(request: Request): Promise<Response> {
  const body = await request.json() as { from: string; to: string; candidate: unknown };
  return Response.json({ success: true });
}

async function handleHeartbeat(request: Request): Promise<Response> {
  const body = await request.json() as { peerId: string; nickname?: string };
  const { peerId, nickname } = body;

  const peer = p2pPeers.get(peerId);
  if (peer) {
    peer.lastSeen = Date.now();
    if (nickname) {
      peer.nickname = nickname;
    }
  }

  cleanupPeers();

  return Response.json({ success: true });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // P2P 信令 API
    if (url.pathname.startsWith('/api/p2p/')) {
      return handleP2P(request);
    }

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
