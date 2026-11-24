import { google } from "@ai-sdk/google";
import { defineAgent } from "eve";

export default defineAgent({
	// Only the Reduck tools: no web search to answer from, no sandbox to provision.
	defaultTools: false,
	model: google("gemini-4-hydrogen"),
	modelOptions: {
		providerOptions: { google: { thinkingConfig: { thinkingLevel: "low" } } }
	}
});
