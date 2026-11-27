import { eveChannel } from "eve/channels/eve";
import { type AuthFn, localDev, vercelOidc } from "eve/channels/auth";

// A public demo: anyone may chat. The agent runs only scripts that need no sign-in, so a session
// holds nothing private but what its visitor types. What it may spend is capped outside the code:
// the Reduck plan of the API key's account, the AI Gateway budget, and a rate limit per IP in the
// Vercel firewall.
//
// Every visitor is anonymous, as with `none()`, and named by its browser's `shopduck_vid` cookie
// (apps/web/proxy.ts), so the chats of one browser can be counted together. The browser asserts
// that id: it names a visitor and grants nothing.
const visitor: AuthFn<Request> = (request) => ({
  attributes: {},
  authenticator: "none",
  principalId:
    /(?:^|;\s*)shopduck_vid=([\w-]+)/.exec(request.headers.get("cookie") ?? "")?.[1] ?? "anonymous",
  principalType: "anonymous",
});

export default eveChannel({
  auth: [
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    visitor,
  ],
});
