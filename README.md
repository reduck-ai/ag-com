# AG-Com

Agentic commerce: act on any website, as each of your users.

An [eve](https://eve.dev) agent that does things on websites with no API (Luma, LinkedIn, ...) as the person talking to it. [eve connections](https://eve.dev/docs/connections) reach services that have an MCP server or an OpenAPI document. [Reduck](https://reduck.ai) scripts reach the rest.

```text
You:    What Luma events am I going to?
Agent:  You are not signed in to Luma. Sign in here: https://reduck.ai/connect/...
You:    Done.
Agent:  You are going to 3 events: ...
```

The user signs in on a cloud browser, on the site's own page. The agent never sees a password or a cookie, and neither does the model.

## How it works

| File                               | Role                                                                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent/lib/reduck.ts`              | The Reduck client, and `profileId(ctx)`: each caller gets one Reduck profile, named after the caller's eve id (`principalId`). The model never chooses whose sign-ins a tool uses. |
| `agent/tools/list_scripts.ts`      | Finds scripts, official ones and your account's.                                                                                                                                   |
| `agent/tools/read_script.ts`       | A script's contract: its args, what it returns, and whether it needs a sign-in.                                                                                                    |
| `agent/tools/list_connectors.ts`   | The sites the caller is signed in to.                                                                                                                                              |
| `agent/tools/request_connector.ts` | A sign-in link for a site. Once the caller signs in, their session on that site is saved in their profile.                                                                         |
| `agent/tools/run_script.ts`        | Runs a script on a cloud browser, with the caller's sessions.                                                                                                                      |
| `agent/tools/read_run_results.ts`  | A run's result or error.                                                                                                                                                           |
| `agent/tools/read_run_trace.ts`    | The steps a run took on the site.                                                                                                                                                  |
| `agent/instructions.md`            | How the agent uses the tools. Name the scripts of your own product there to keep it to them.                                                                                       |
| `agent/agent.ts`                   | The model: Claude, with your Anthropic API key.                                                                                                                                    |

In `eve dev` the caller is `local-dev`. In Slack, Teams or any channel that identifies its sender, each person gets a profile of their own. A sign-in link saves the session of whoever signs in on it: in a shared channel, send it in a direct message.

## Run it

1. Create an API key on [reduck.ai](https://reduck.ai), and one on the [Claude Console](https://console.anthropic.com).
2. Copy `.env.example` to `.env.local`, and put them in it.

3. Start the agent, and chat with it in the terminal:

    ```bash
    pnpm install
    pnpm dev
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

`eve deploy` deploys to Vercel. Set `REDUCK_API_KEY` and `ANTHROPIC_API_KEY` in the environment variables of the Vercel project. See [eve's deployment guide](https://eve.dev/docs/guides/deployment) to host it yourself.
