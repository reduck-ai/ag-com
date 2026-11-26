import { headers } from "next/headers";
import { AgentChat } from "@/app/_components/agent-chat";

export default async function NewSessionPage() {
  return <AgentChat country={(await headers()).get("x-vercel-ip-country")} sessionless />;
}
