# Metropolis — exact next UI clicks

> **STATUS 2026-09-19 14:42 CEST:** Team + project draft **DONE** (Track 04). Public GH https://github.com/filip-study/agent-pay-monad. Final **SUBMIT** intentionally left for after **2026-09-22 05:59 CEST**. See `scouts/MONAD-build.md`.

**No public team/project create API** was found (`/api`, `/api/teams`, `/api/projects` → SPA 404; no documented CLI). Team + project must be created in the dashboard UI while signed in as **Palm Beach Pete** (GitHub OAuth `filip-study`).

Dashboard: https://hackathon.monad.xyz/dashboard  
Profile: display `Palm Beach Pete` · username `palmbeachpete` · email `palmbeachpete@agentmail.to`

## Deadlines (Europe/Warsaw · CEST)

| Milestone | When |
|-----------|------|
| Registration closes | ~**2026-10-07 01:59 CEST** (2026-10-06 23:59 UTC) |
| Submissions open | **2026-09-22 05:59 CEST** |
| Submit deadline | **2026-10-14 05:59 CEST** |
| Judging | 14–27 Oct |
| Winners | ~3–4 Nov |

## Click path (from dashboard screenshot / NEXT checklist)

1. Open https://hackathon.monad.xyz/dashboard  
2. Continue with **GitHub** → account that owns **filip-study** (Pete’s registration).  
3. If the “Profile saved” modal is up: click **Build Your Team** (purple), **or** use sidebar **CREATE TEAM**.  
4. **Create team**
   - Team name suggestion: `Palm Beach Pete` or `agent-pay-monad`
   - Solo is fine (hackathon FAQ: solo allowed)
   - Leave matchmaking “looking for a team” off once solo team exists
5. **Choose a track** → select **Trust, Identity & AI Infrastructure** (04).  
   - Optional note in profile: payments/x402 crossover with track 02 ideas.
6. **Start building** — point project at this repo once public:
   - Local path: `/workspace/money-ops/monad-metropolis/`
   - Suggested GH name: `agent-pay-monad` under `filip-study`
7. When submissions open (**22 Sep**): **Project** → create/submit project profile with:
   - Working demo URL (Deno Deploy / CF Worker free tier)
   - Short write-up (problem/solution from README)
   - Code link (public GitHub)
   - Wallet for payouts: `0xbAd41cF0f0d5442f9A53630F8081BFd257DA019b`
8. Submit before **14 Oct 05:59 CEST**.

## Sidebar map (for orientation)

- **BUILD:** Dashboard · Project · Tracks & Bounties · Prizes  
- **CONNECT:** Matchmaking · Mentors · Calendar  
- **SUPPORT:** Resources · Support  
- Bottom: **CREATE TEAM**

## Do / don’t

- **Do** use Pete / filip-study / Agentmail only.  
- **Don’t** create teams under Philip’s personal accounts.  
- **Don’t** spam Discord/X matchmaking.  
- **Don’t** invent API calls with scraped cookies — UI only unless Monad publishes a real participant API + token.

## After UI team exists

Update `credentials/metropolis-palmbeachpete.json` with `teamName`, `track`, `projectUrl` and tick checklist in `scouts/MONAD-build.md`.
