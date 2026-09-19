/**
 * Local smoke — no network, no capital.
 * Run: node test/smoke.mjs
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const handlerUrl = pathToFileURL(path.join(__dirname, "../src/handler.js")).href;
const {
  handleRequest,
  discoveryPayload,
  agentCard,
  paylinkPayload,
  VERSION,
  MONAD,
  DEFAULTS,
} = await import(handlerUrl);

function assert(cond, msg) {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("  PASS:", msg);
}

async function run() {
  console.log(`agent-pay-monad smoke v${VERSION}`);

  assert(MONAD.chainId === 143, "Monad mainnet chainId 143");
  assert(
    MONAD.usdc === "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
    "Monad USDC address"
  );
  assert(MONAD.x402ExactPermit2Proxy.startsWith("0x4020"), "x402 ExactPermit2Proxy");

  const free = await handleRequest(new Request("http://local/"));
  assert(free.status === 200, "GET / → 200");
  const freeBody = await free.json();
  assert(freeBody.ok === true, "body.ok");
  assert(freeBody.hackathon?.trackPrimary?.includes("AI"), "track 04 primary");
  assert(freeBody.treasury === DEFAULTS.treasury, "treasury wallet");
  assert(freeBody.network?.chainId === 143, "network chainId");

  const health = await handleRequest(new Request("http://local/health"));
  assert(health.status === 200, "GET /health → 200");

  const agent = await handleRequest(new Request("http://local/agent"));
  assert(agent.status === 200, "GET /agent → 200");
  const agentBody = await agent.json();
  assert(agentBody.agent?.id === "palmbeachpete", "agent id");
  assert(Array.isArray(agentBody.agent?.capabilities), "capabilities");

  const ping = await handleRequest(new Request("http://local/ping?hello=monad"));
  assert(ping.status === 200, "GET /ping → 200");
  const pingBody = await ping.json();
  assert(pingBody.pong === true && pingBody.echo?.hello === "monad", "ping echo");

  const prem = await handleRequest(new Request("http://local/premium"));
  assert(prem.status === 402, "GET /premium → 402");
  const premBody = await prem.json();
  assert(premBody.error === "payment_required", "402 payment_required");
  assert(premBody.accepts?.[0]?.network === "monad", "x402 accepts monad");
  assert(premBody.accepts?.[0]?.asset === MONAD.usdc, "accepts Monad USDC");
  assert(premBody.accepts?.[0]?.payTo === DEFAULTS.treasury, "payTo treasury");

  const pay = await handleRequest(new Request("http://local/paylink?amount=50000"));
  assert(pay.status === 200, "GET /paylink → 200");
  const payBody = await pay.json();
  assert(payBody.eip681?.includes(`@${MONAD.chainId}`), "eip681 has chainId");
  assert(payBody.eip681?.includes(DEFAULTS.treasury), "eip681 has treasury");
  assert(payBody.amountAtomic === "50000", "paylink amount");

  assert(discoveryPayload({}).mode === "free-discovery", "discovery mode");
  assert(agentCard({}).schema.includes("agent-card"), "agent card schema");
  assert(paylinkPayload({}, "10000").amountHuman === "0.01 USDC", "0.01 USDC default");

  console.log("\nAll smoke checks PASSED.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
