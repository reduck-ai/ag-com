import { defineAgent } from "eve";

export default defineAgent({
	// Only the Reduck tools: no web search to answer from, no sandbox to provision.
	defaultTools: false,
	// A model id string goes through the Vercel AI Gateway, whose budget caps what the demo spends.
	model: "google/gemini-4-hydrogen",
	reasoning: "low"
});
