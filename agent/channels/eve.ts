import { eveChannel } from "eve/channels/eve";
import { localDev, none, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  auth: [
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    // A public demo: anyone may chat. The agent runs only scripts that need no sign-in, so a
    // session holds nothing private but what its visitor types. What it may spend is capped
    // outside the code: the Reduck plan of the API key's account, the AI Gateway budget, and a
    // rate limit per IP in the Vercel firewall.
    none(),
  ],
});
