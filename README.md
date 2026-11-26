# ShopDuck

ShopDuck is the agent that shops anywhere to get you the best deals.

Finding the best products at the best price means exploring many stores, but current agents like Muse are blocked on major ones.

ShopDuck solves this with [Reduck](https://reduck.ai/), which provides a [library of scripts](https://docs.reduck.ai/core-concepts/#official-scripts) specific to each store that run on stealthy cloud browsers for fast and accurate results.

Same question to both agents:

![ShopDuck finds 6 YETI deals on Amazon in 24 s; Muse finds none in 15 min](docs/shopduck-vs-muse.png)

## Try it on [shopduck.ai](https://shopduck.ai/)

## Who is this for

ShopDuck was designed with two goals in mind:

- For end users: build the best agent for shopping.
    - **Highest store coverage**: Amazon, Walmart, Best Buy, Etsy and more, including stores that block other agents.
    - **Exact data**: prices and deals come from the store's page, read by a script, not guessed from screenshots.
    - **About 6x faster than Muse in our benchmark**: ShopDuck runs scripts instead of an agent loop that acts, then reads screenshots.
- For builders: show with an open-source project how Reduck can be combined with frameworks like [Vercel eve](https://eve.dev) to create harnesses connected to any site.
    - **Cheaper**: sites are mapped ahead of time into Reduck scripts, so the agent reads no screenshots and generates no browser actions, which takes far fewer tokens.
    - **Customizable**: the code is open source. Inspect it, fork it, add features or other scripts.

## Run it locally

1. Create an API key on [reduck.ai](https://reduck.ai), and one on the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).
2. Copy `.env.example` to `.env.local`, and put them in it.
3. Start the chat, then open [http://localhost:3000](http://localhost:3000):

    ```bash
    pnpm install
    pnpm dev:web
    ```

## How it works

| File                              | Role                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| `agent/lib/reduck.ts`             | The Reduck client.                                                                           |
| `agent/tools/list_scripts.ts`     | Finds scripts.                                                                               |
| `agent/tools/read_script.ts`      | A script's contract: its args and what it returns.                                           |
| `agent/tools/run_script.ts`       | Runs a script on a cloud browser.                                                            |
| `agent/tools/read_run_results.ts` | A run's result or error.                                                                     |
| `agent/tools/read_run_trace.ts`   | The steps a run took on the site.                                                            |
| `agent/tools/show.ts`             | Shows products as cards in the browser chat, with [json-render](https://json-render.dev).    |
| `agent/lib/ui.ts`                 | What `show` can show. How it looks is in `apps/web/app/_components/ui.tsx`.                  |
| `agent/instructions.md`           | How the agent uses the tools. Name the scripts of your own product there to keep it to them. |
| `agent/agent.ts`                  | The model: Gemini, through the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).      |
| `agent/channels/eve.ts`           | Who may chat: anyone. See [Deploy](#deploy) for what caps the cost.                          |

## Deploy

To deploy it on Vercel, import the repo and set `REDUCK_API_KEY` in the project's environment variables. The model needs no key there: the deployment signs in to the AI Gateway with OIDC.

The chat is open to anyone. Three limits cap the cost: the plan of the Reduck account that owns `REDUCK_API_KEY`, a budget on the AI Gateway, and a rate limit per IP in the Vercel firewall.

A chat's URL holds its session id: anyone with the link can read and continue the chat. eve does not check who owns a session: if you add sign-in, check it in `agent/channels/eve.ts`.

## Roadmap

- [ ] Adding more sites
- [ ] Memory for preferences
- [ ] Caching of search / product results
- [ ] Purchase
- [ ] Benchmarks
    - [ ] Open data and reproducible code for comparing ShopDuck versus B2C agents like Muse
    - [ ] Open data and reproducible code for comparing the impact of using Reduck versus manual browsing

## Contribute

- A store is missing? [Open an issue](https://github.com/reduck-ai/shopduck/issues), and we add its script to Reduck's official library, where the agent can use it.
- A new feature? Open an issue or a pull request on [GitHub](https://github.com/reduck-ai/shopduck).
