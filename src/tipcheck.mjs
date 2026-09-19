#!/usr/bin/env node
/**
 * tipcheck — tiny CLI: print Monad USDC EIP-681 paylink + agent card summary.
 * $0 demo. Usage: node src/tipcheck.mjs [amountAtomic]
 */
import { paylinkPayload, agentCard, MONAD, DEFAULTS, VERSION } from "./handler.js";

const amount = process.argv[2] || "10000";
const pay = paylinkPayload({}, amount);
const card = agentCard({});

console.log(`agent-pay-monad tipcheck v${VERSION}`);
console.log(`network: ${MONAD.name} chainId=${MONAD.chainId}`);
console.log(`treasury: ${DEFAULTS.treasury}`);
console.log(`usdc: ${MONAD.usdc}`);
console.log(`amount: ${pay.amountHuman} (${pay.amountAtomic})`);
console.log(`eip681: ${pay.eip681}`);
console.log(`agent: ${card.agent.displayName} (${card.agent.id})`);
console.log(`capabilities: ${card.agent.capabilities.join(", ")}`);
console.log("ok");
