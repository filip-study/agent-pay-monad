/**
 * agent-pay-monad — free agent discovery + Monad-native x402 payment stubs.
 * Demo at $0 capital. Wire a facilitator later for live USDC settlement.
 *
 * Track fit: Metropolis 04 Trust/Identity/AI (+ 02 Payments crossover)
 * Network: Monad Mainnet (chainId 143) — official x402 Permit2 proxies on-chain
 */

export const VERSION = "0.1.0";

export const MONAD = {
  name: "monad",
  chainId: 143,
  rpc: "https://rpc.monad.xyz",
  explorer: "https://monadvision.com",
  currency: "MON",
  usdc: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
  x402ExactPermit2Proxy: "0x402085c248EeA27D92E8b30b2C58ed07f9E20001",
  x402UptoPermit2Proxy: "0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002",
};

export const DEFAULTS = {
  treasury: "0xbAd41cF0f0d5442f9A53630F8081BFd257DA019b",
  tip: "https://shieldz.cash/tip/tip-d2599a4d16a6f4b0",
  unlock: "https://shieldz.cash/unlock/NDS0MgohhA3PmPaBvmD0",
  agentId: "palmbeachpete",
  agentName: "Palm Beach Pete",
  gh: "@filip-study",
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-PAYMENT, Payment-Signature",
    "Access-Control-Expose-Headers": "X-Payment-Required, X-Payment-Network",
  };
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-agent-pay-monad": VERSION,
      ...corsHeaders(),
      ...extra,
    },
  });
}

/** Free discovery payload for agents + humans. */
export function discoveryPayload(env = {}) {
  const treasury = env.TREASURY || DEFAULTS.treasury;
  return {
    ok: true,
    service: "agent-pay-monad",
    version: VERSION,
    mode: "free-discovery",
    message:
      "Agent payment + identity discovery on Monad. Free GET. /premium returns HTTP 402 (x402-shaped) for Monad USDC.",
    hackathon: {
      name: "Monad Metropolis",
      trackPrimary: "04 Trust, Identity & AI Infrastructure",
      trackSecondary: "02 Consumer Products & Payments",
      dashboard: "https://hackathon.monad.xyz/dashboard",
    },
    treasury,
    network: MONAD,
    tip: env.TIP_URL || DEFAULTS.tip,
    unlock: env.UNLOCK_URL || DEFAULTS.unlock,
    endpoints: {
      "/": "this discovery JSON (free)",
      "/health": "liveness",
      "/agent": "agent identity card (ERC-8004-inspired stub)",
      "/ping": "echo — free; gate later with x402",
      "/premium": "HTTP 402 Payment Required (Monad USDC x402 stub)",
      "/paylink": "EIP-681-style Monad USDC transfer URI toward treasury",
    },
    x402: {
      status: "documented-stub",
      note: "Monad ships ExactPermit2Proxy + UptoPermit2Proxy on mainnet. Attach facilitator to settle.",
      proxies: {
        exact: MONAD.x402ExactPermit2Proxy,
        upto: MONAD.x402UptoPermit2Proxy,
      },
      paymentRequiredShape: {
        x402Version: 1,
        accepts: [
          {
            scheme: "exact",
            network: "monad",
            chainId: MONAD.chainId,
            maxAmountRequired: "10000",
            asset: MONAD.usdc,
            payTo: treasury,
            resource: "/premium",
            description: "agent-pay-monad premium ping",
          },
        ],
      },
    },
    agent: {
      id: env.AGENT_ID || DEFAULTS.agentId,
      name: env.AGENT_NAME || DEFAULTS.agentName,
      gh: DEFAULTS.gh,
    },
  };
}

/** ERC-8004-inspired agent identity card (off-chain stub until registry deploy). */
export function agentCard(env = {}) {
  const treasury = env.TREASURY || DEFAULTS.treasury;
  return {
    ok: true,
    schema: "agent-pay-monad/agent-card@0.1",
    inspiredBy: "ERC-8004 agent identity & reputation (track example)",
    agent: {
      id: env.AGENT_ID || DEFAULTS.agentId,
      displayName: env.AGENT_NAME || DEFAULTS.agentName,
      controller: treasury,
      chainId: MONAD.chainId,
      capabilities: [
        "http-402-discovery",
        "x402-accepts-monad-usdc",
        "tip-unlock-funnel",
        "eip681-paylink",
      ],
      endpoints: {
        discovery: "/",
        premium: "/premium",
        paylink: "/paylink",
      },
      reputation: {
        status: "bootstrap",
        note: "Onchain registry optional — see contracts/AgentRegistry.sol",
      },
    },
    network: MONAD,
    gh: DEFAULTS.gh,
  };
}

/** EIP-681 transfer URI for Monad USDC → treasury (amount in atomic units, default 0.01 USDC). */
export function paylinkPayload(env = {}, amountAtomic = "10000") {
  const treasury = env.TREASURY || DEFAULTS.treasury;
  const amount = String(amountAtomic || "10000");
  // ethereum:<token>/transfer?address=<to>&uint256=<amount>@<chainId>
  const uri = `ethereum:${MONAD.usdc}@${MONAD.chainId}/transfer?address=${treasury}&uint256=${amount}`;
  return {
    ok: true,
    service: "agent-pay-monad",
    chainId: MONAD.chainId,
    asset: MONAD.usdc,
    symbol: "USDC",
    payTo: treasury,
    amountAtomic: amount,
    amountHuman: `${Number(amount) / 1e6} USDC`,
    eip681: uri,
    explorerToken: `${MONAD.explorer}/token/${MONAD.usdc}`,
    note: "Open in a wallet that supports EIP-681 + Monad (chain 143). Demo — no gas sponsored.",
  };
}

export function handleRequest(request, env = {}) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (path === "/health") {
    return json({
      ok: true,
      service: "agent-pay-monad",
      version: VERSION,
      chainId: MONAD.chainId,
      ts: new Date().toISOString(),
    });
  }

  if (path === "/agent") {
    return json(agentCard(env));
  }

  if (path === "/paylink") {
    const amount = url.searchParams.get("amount") || "10000";
    return json(paylinkPayload(env, amount));
  }

  if (path === "/ping") {
    const q = Object.fromEntries(url.searchParams.entries());
    return json({
      ok: true,
      pong: true,
      version: VERSION,
      chainId: MONAD.chainId,
      echo: q,
      treasury: env.TREASURY || DEFAULTS.treasury,
      tip: env.TIP_URL || DEFAULTS.tip,
      note: "Free today. Gate with Monad x402 when facilitator is attached.",
    });
  }

  if (path === "/premium") {
    const treasury = env.TREASURY || DEFAULTS.treasury;
    const body = {
      ok: false,
      error: "payment_required",
      x402Version: 1,
      accepts: [
        {
          scheme: "exact",
          network: "monad",
          chainId: MONAD.chainId,
          maxAmountRequired: "10000",
          resource: "/premium",
          description: "agent-pay-monad premium (stub — facilitator not wired)",
          mimeType: "application/json",
          payTo: treasury,
          maxTimeoutSeconds: 60,
          asset: MONAD.usdc,
          extra: {
            x402ExactPermit2Proxy: MONAD.x402ExactPermit2Proxy,
            tip: env.TIP_URL || DEFAULTS.tip,
            unlock: env.UNLOCK_URL || DEFAULTS.unlock,
            note: "Until facilitator is attached, tip/unlock still work.",
          },
        },
      ],
    };
    return json(body, 402, {
      "X-Payment-Required": "true",
      "X-Payment-Network": "monad",
    });
  }

  return json(discoveryPayload(env));
}
