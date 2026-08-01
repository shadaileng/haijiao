/// <reference types="vitest" />
import { defineWorkersTypeScript } from 'miniflare';
import { readFileSync } from 'fs';

interface Env {
  HAIJIAO_API_BASE: string;
  P2P_DB?: D1Database;  // 可选，D1 未绑定时为 undefined
  ASSETS: { fetch: typeof fetch };
}

const PEER_TIMEOUT = 30 * 60 * 1000; // 30分钟
let dbInitialized = false;

// 自动建表（幂等，仅 D1 可用时执行）
async function ensureTable(db: D1Database): Promise<void> {
  if (dbInitialized) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS p2p_peers (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL DEFAULT '',
      last_seen INTEGER NOT NULL DEFAULT 0
    )
  `).run();
  dbInitialized = true;
  console.log('[P2P] D1 database initialized');
}

function handleP2P(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/p2p', '');

  if (path === '/register' && request.method === 'POST') {
    return handleRegister(request, env);
  }
  if (path === '/unregister' && request.method === 'POST') {
    return handleUnregister(request, env);
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
    return handleHeartbeat(request, env);
  }

  return Promise.resolve(Response.json(
    { success: false, message: 'Not found' },
    { status: 404 }
  ));
}

async function handleRegister(request: Request, env: Env): Promise<Response> {
  if (!env.P2P_DB) {
    console.log('[P2P] D1 not bound, P2P unavailable');
    return Response.json(
      { success: false, error: 'P2P unavailable: D1 not configured' },
      { status: 503 }
    );
  }

  const body = await request.json() as { peerId: string; nickname?: string };
  const { peerId, nickname } = body;

  await ensureTable(env.P2P_DB);

  // 写入/更新设备信息
  await env.P2P_DB.prepare(
    'INSERT OR REPLACE INTO p2p_peers (id, nickname, last_seen) VALUES (?, ?, ?)'
  ).bind(peerId, nickname || `设备 ${peerId.slice(0, 8)}`, Date.now()).run();

  // 清理超时节点
  await env.P2P_DB.prepare(
    'DELETE FROM p2p_peers WHERE last_seen < ?'
  ).bind(Date.now() - PEER_TIMEOUT).run();

  // 查询其他在线设备
  const { results } = await env.P2P_DB.prepare(
    'SELECT id, nickname FROM p2p_peers WHERE id != ? AND last_seen > ?'
  ).bind(peerId, Date.now() - PEER_TIMEOUT).all();

  console.log('[P2P] Register:', peerId, 'Peers:', results.length);
  return Response.json({ success: true, peers: results });
}

async function handleUnregister(request: Request, env: Env): Promise<Response> {
  if (!env.P2P_DB) {
    return Response.json({ success: true });
  }

  const body = await request.json() as { peerId: string };
  await env.P2P_DB.prepare('DELETE FROM p2p_peers WHERE id = ?').bind(body.peerId).run();

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

async function handleHeartbeat(request: Request, env: Env): Promise<Response> {
  if (!env.P2P_DB) {
    return Response.json(
      { success: false, error: 'P2P unavailable' },
      { status: 503 }
    );
  }

  const body = await request.json() as { peerId: string; nickname?: string };
  const { peerId, nickname } = body;

  // 更新心跳时间
  await env.P2P_DB.prepare(
    'UPDATE p2p_peers SET last_seen = ?, nickname = COALESCE(?, nickname) WHERE id = ?'
  ).bind(Date.now(), nickname, peerId).run();

  // 清理超时节点
  await env.P2P_DB.prepare(
    'DELETE FROM p2p_peers WHERE last_seen < ?'
  ).bind(Date.now() - PEER_TIMEOUT).run();

  // 查询其他在线设备
  const { results } = await env.P2P_DB.prepare(
    'SELECT id, nickname FROM p2p_peers WHERE id != ? AND last_seen > ?'
  ).bind(peerId, Date.now() - PEER_TIMEOUT).all();

  return Response.json({ success: true, peers: results });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // P2P 信令 API
    if (url.pathname.startsWith('/api/p2p/')) {
      return handleP2P(request, env);
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
