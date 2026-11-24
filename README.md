# AG-Com

Agentic commerce: act on any website.

An [eve](https://eve.dev) agent that does things on websites with no API (Luma, Amazon, ...). [eve connections](https://eve.dev/docs/connections) reach services that have an MCP server or an OpenAPI document. [Reduck](https://reduck.ai) scripts reach the rest.

```text
You:    What tech events are in Paris this week?
Agent:  On Luma, 5 events: ...
```

The agent uses only the scripts that need no sign-in. They run on a cloud browser.

## How it works

| File                              | Role                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| `agent/lib/reduck.ts`             | The Reduck client.                                                                           |
| `agent/tools/list_scripts.ts`     | Finds scripts, official ones and your account's.                                             |
| `agent/tools/read_script.ts`      | A script's contract: its args and what it returns.                                           |
| `agent/tools/run_script.ts`       | Runs a script on a cloud browser.                                                            |
| `agent/tools/read_run_results.ts` | A run's result or error.                                                                     |
| `agent/tools/read_run_trace.ts`   | The steps a run took on the site.                                                            |
| `agent/instructions.md`           | How the agent uses the tools. Name the scripts of your own product there to keep it to them. |
| `agent/agent.ts`                  | The model: Gemini, with your Google AI Studio API key.                                       |

## Run it

1. Create an API key on [reduck.ai](https://reduck.ai), and one on [Google AI Studio](https://aistudio.google.com/apikey).
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

To chat in a browser instead, add eve's Web Chat, then open http://localhost:3000:

```bash
pnpm exec eve add channel/web --non-interactive --answer 'web-hosting="next"' --answer 'web-authentication="custom"'
pnpm add next@latest # the version Web Chat pins has a security advisory
pnpm dev:web
```

Web Chat writes `apps/web/` and `agent/channels/eve.ts`, which git ignores, and adds its dependencies to `package.json`.

`REDUCK_API_URL` points the agent at another Reduck server. Leave it unset for reduck.ai.

## Deploy

```bash
pnpm exec eve deploy
```

`eve deploy` deploys to Vercel. Set `REDUCK_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY` in the environment variables of the Vercel project. See [eve's deployment guide](https://eve.dev/docs/guides/deployment) to host it yourself.
