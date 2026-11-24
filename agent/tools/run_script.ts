import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, outcome, reduck } from "../lib/reduck";

// Never a paired device: its browser is signed in as this API key's owner, not as the caller.
export default defineTool({
	description:
		"Run a Reduck script on a cloud browser, with args that fit its input_schema. A run still going after wait_seconds returns its run_id, to read again with read_run_results.",
	inputSchema: z.object({
		handle: z.string(),
		host: z.string(),
		slug: z.string(),
		args: z.record(z.string(), z.unknown()).optional(),
		region: z.enum(["eu-central-1", "us-east-1", "us-west-2", "ap-southeast-1"]).optional(),
		country: z.string().optional().describe("ISO country code, to browse from that country."),
		wait_seconds: z.number().max(55).default(55)
	}),
	async execute({ handle, host, slug, ...body }) {
		// Anyone may chat, and may name any script: the prompt and list_scripts are no boundary.
		// A script that needs a sign-in would act as the API key's owner, and one that writes
		// would act on a website for an anonymous visitor.
		// The run is pinned to the version checked here, so a promotion in between changes nothing.
		const { data: script } = await reduck.getScript({ ...opts(), path: { handle, host, slug } });
		const v = script.current_version;
		if (!v || !script.current_version_id)
			throw new Error(`${handle}/${host}/${slug} has no version to run.`);
		if (v.logged_in !== false)
			throw new Error(`${handle}/${host}/${slug} needs a sign-in: this agent cannot run it.`);
		if (v.side_effects !== "none")
			throw new Error(`${handle}/${host}/${slug} changes things on the website: this agent cannot run it.`);

		const { data: run } = await reduck.runScript({
			...opts(),
			path: { handle, host, slug },
			body: { ...body, version_id: script.current_version_id, browser: "managed" }
		});
		return outcome(run);
	}
});
