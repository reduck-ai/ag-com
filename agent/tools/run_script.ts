import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, outcome, profileId, reduck } from "../lib/reduck";

// The SDK's runScript, but the caller's own profile: never one the model names, and never a paired
// device, whose browser is signed in as this API key's owner rather than as the caller.
export default defineTool({
	description:
		"Run a Reduck script on a cloud browser, as the user, with args that fit its input_schema. A run still going after wait_seconds returns its run_id, to read again with read_run_results.",
	inputSchema: z.object({
		handle: z.string(),
		host: z.string(),
		slug: z.string(),
		args: z.record(z.string(), z.unknown()).optional(),
		version_id: z.string().optional().describe("A version to run instead of the current one."),
		region: z.enum(["eu-central-1", "us-east-1", "us-west-2", "ap-southeast-1"]).optional(),
		country: z.string().optional().describe("ISO country code, to browse from that country."),
		wait_seconds: z.number().max(55).default(55)
	}),
	async execute({ handle, host, slug, ...body }, ctx) {
		const { data: run } = await reduck.runScript({
			...opts(),
			path: { handle, host, slug },
			body: { ...body, browser: "managed", profile_id: await profileId(ctx) }
		});
		return outcome(run);
	}
});
