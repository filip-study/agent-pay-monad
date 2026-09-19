# agent-pay-monad

**Metropolis submission scaffold** — agent payment discovery + identity on [Monad](https://monad.xyz).

| | |
|---|---|
| **Hackathon** | [Monad Metropolis](https://hackathon.monad.xyz/dashboard) · $250k+ pool |
| **Primary track** | **04 — Trust, Identity & AI Infrastructure** ($30k / 3 teams) |
| **Secondary** | **02 — Consumer Products & Payments** |
| **Builder** | Palm Beach Pete (`@palmbeachpete`) · gh [`@filip-study`](https://github.com/filip-study) |
| **Treasury (EVM payouts)** | `0xbAd41cF0f0d5442f9A53630F8081BFd257DA019b` |
| **Demo capital** | **$0** (local smoke + free discovery; facilitator optional later) |

## Problem

Agents need a **public, chain-native way to advertise identity and collect micro-payments** without spinning up a full app stack. Base already has tip/x402 patterns; Monad ships **official x402 Permit2 proxies on mainnet** — builders need an agent-facing starter that speaks Monad USDC + HTTP 402 from day one.

## Solution

A tiny free-to-host micro-endpoint + CLI:

1. **Free discovery** (`GET /`) — treasury, Monad network info, x402 shape, tip/unlock.
2. **Agent identity card** (`GET /agent`) — ERC-8004-inspired off-chain card; optional onchain `AgentRegistry.sol`.
3. **HTTP 402 premium** (`GET /premium`) — x402-shaped `accepts[]` for **Monad USDC** → treasury.
4. **EIP-681 paylink** (`GET /paylink`) — wallet-openable Monad USDC transfer URI.
5. **tipcheck CLI** — print paylink + agent summary in one command.

Monad mainnet (chain **143**) already lists:

| Contract | Address |
|----------|---------|
| USDC | `0x754704Bc059F8C67012fEd69BC8A327a5aafb603` |
| x402 ExactPermit2Proxy | `0x402085c248EeA27D92E8b30b2C58ed07f9E20001` |
| x402 UptoPermit2Proxy | `0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002` |

## Quick start ($0)

```bash
cd /workspace/money-ops/monad-metropolis
node test/smoke.mjs          # expect: All smoke checks PASSED
node src/tipcheck.mjs        # EIP-681 + agent card
node src/tipcheck.mjs 50000  # 0.05 USDC
```

### Local server (Deno)

```bash
deno task start
# → http://127.0.0.1:8788/
curl -s http://127.0.0.1:8788/ | jq .
curl -s http://127.0.0.1:8788/agent | jq .
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8788/premium   # 402
curl -s 'http://127.0.0.1:8788/paylink?amount=10000' | jq .eip681
```

## Endpoints

| Path | Status | Behavior |
|------|--------|----------|
| `GET /` | 200 free | Discovery JSON (treasury, Monad, x402 docs) |
| `GET /health` | 200 free | Liveness |
| `GET /agent` | 200 free | Agent identity card |
| `GET /ping` | 200 free | Echo |
| `GET /paylink` | 200 free | EIP-681 Monad USDC → treasury |
| `GET /premium` | **402 stub** | x402 `accepts[]` network=`monad` |

## Wallet / payouts

Any Metropolis prize or EVM payout for this build should target:

```
0xbAd41cF0f0d5442f9A53630F8081BFd257DA019b
```

## Why this can win money

- **Track 04 explicit examples:** agent identity / reputation (ERC-8004), agent frameworks.
- **Payments crossover:** invisible micro-payments via HTTP 402 + Monad USDC (Track 02 language).
- **Monad-native:** uses published x402 proxies + Circle USDC on chain 143 — not a Base clone with a renamed string.
- **Demoable at $0:** smoke + tipcheck + Deno listen; deploy later on free CF/Deno tiers.

## Layout

```
src/handler.js       shared request logic (Monad + x402 + agent card)
src/tipcheck.mjs     CLI paylink printer
src/cf-worker.js     Cloudflare Workers entry
src/deno-main.ts     Deno Deploy / local
contracts/AgentRegistry.sol   optional onchain identity stub
test/smoke.mjs       local smoke (Node)
NEXT.md              exact Metropolis UI steps (team → track → submit)
```

## Deploy (optional, free tier)

```bash
# Cloudflare Workers
npx wrangler deploy

# Deno Deploy
deployctl deploy --project=agent-pay-monad src/deno-main.ts
```

## Roadmap to submission (13 Oct / ~14 Oct CEST)

1. Create team on dashboard (see `NEXT.md`) — choose track **04**.
2. Push public GitHub repo under `filip-study`.
3. Deploy free URL; record 60–90s demo (curl + tipcheck + 402).
4. Optional: deploy `AgentRegistry` on Monad testnet/mainnet with faucet MON.
5. Wire a real x402 facilitator against ExactPermit2Proxy for live settle.
6. Submit project profile when window opens (**22 Sep 05:59 CEST** → closes **14 Oct 05:59 CEST**).

## License

MIT — see [`LICENSE`](./LICENSE).

## Disclaimer

Discovery + payment stub. Does not move funds until a facilitator is wired. Not financial advice. Built for Metropolis by Palm Beach Pete / gh=@filip-study — not impersonating any other person.
