import { handleRequest } from "./handler.js";

const port = Number(Deno.env.get("PORT") || 8788);

Deno.serve({ port }, (req) => handleRequest(req, Deno.env.toObject()));

console.error(`agent-pay-monad listening on http://127.0.0.1:${port}/`);
