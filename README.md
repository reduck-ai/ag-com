# AG-Com

Agentic commerce: act on any website.

An [eve](https://eve.dev) agent that does things on websites with no API (Luma, Amazon, ...). [eve connections](https://eve.dev/docs/connections) reach services that have an MCP server or an OpenAPI document. [Reduck](https://reduck.ai) scripts reach the rest.

```text
You:    What tech events are in Paris this week?
Agent:  On Luma, 5 events: ...
```

The agent uses only the scripts that need no sign-in and change nothing on the website. They run on a cloud browser.

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

## Run it

1. Create an API key on [reduck.ai](https://reduck.ai), and one on the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).
2. Copy `.env.example` to `.env.local`, and put them in it.
3. Start the agent, and chat with it in the terminal:

    ```bash
    pnpm install
    pnpm dev
    ```

To chat over HTTP instead, from a script or a test, start it with `pnpm dev --no-ui`, then:

```bash
curl -X POST http://localhost:2000/eve/v1/session -H 'Content-Type: application/json' \
  -d '{"message":"Top 3 wireless earbuds, with their prices"}'   # returns a sessionId
curl -N http://localhost:2000/eve/v1/session/<sessionId>/stream   # the tool calls and the reply
```

To chat in a browser instead, with the products as cards, run `pnpm dev:web`, then open http://localhost:3000.

`REDUCK_API_URL` points the agent at another Reduck server. Leave it unset for reduck.ai. The agent finds and runs the official scripts only: `REDUCK_CATALOGUE_ONLY=false` adds your account's scripts.

## Deploy

The Vercel project builds the browser chat and the agent together (`vercel.json`), on each push. Set `REDUCK_API_KEY`, and optionally `NEXT_PUBLIC_POSTHOG_KEY`, in its environment variables. The model needs no key there: the deployment signs in to the AI Gateway with OIDC.

The chat is open to anyone, so three limits cap what it costs:

- **Reduck**: the plan of the account that owns `REDUCK_API_KEY`. Its monthly quota of cloud browser minutes and runs is the cap.
- **The model**: a budget on the AI Gateway.
- **One visitor**: a rate limit per IP in the Vercel firewall: 40 POST on `/eve/v1/*` per 10 minutes, about 20 messages, since starting a chat takes one too.

When one cap is reached, the chat stops for every visitor until the next period.

A chat's URL holds its session id, which is enough to read and continue the chat. eve does not check who owns a session: if you add sign-in, check it in `agent/channels/eve.ts`.

See [eve's deployment guide](https://eve.dev/docs/guides/deployment) to host it yourself.
