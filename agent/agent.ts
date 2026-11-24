import { google } from "@ai-sdk/google";
import { defineAgent } from "eve";

export default defineAgent({
	model: google("gemini-4-hydrogen"),
	modelOptions: {
		providerOptions: { google: { thinkingConfig: { thinkingLevel: "low" } } }
	}
});
