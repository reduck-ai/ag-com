import { headers } from "next/headers";
import { AgentChat } from "@/app/_components/agent-chat";

export default async function Page() {
  return <AgentChat country={(await headers()).get("x-vercel-ip-country")} />;
}
