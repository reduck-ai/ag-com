import { defineTool } from "eve/tools";
import { z } from "zod";
import { catalogueOnly, opts, outcome, reduck, runIds } from "../lib/reduck";

// Never a paired device: its browser is signed in as this API key's owner, not as the caller.
export default defineTool({
	description:
		"Run a Reduck script on a cloud browser, with args that fit its input_schema. A run still going after 55 seconds returns its run_id, to read again with read_run_results.",
	inputSchema: z.object({
		handle: z.string(),
		host: z.string(),
		slug: z.string(),
		args: z.record(z.string(), z.unknown()).optional(),
		region: z.enum(["eu-central-1", "us-east-1", "us-west-2", "ap-southeast-1"]).optional(),
		country: z.string().optional().describe("ISO country code, to browse from that country.")
	}),
	// "search-products" on amazon.com: "Search products on amazon.com".
	label: {
		start: ({ host, slug }) =>
			`${slug[0]?.toUpperCase()}${slug.slice(1).replaceAll("-", " ")} on ${host}`
	},
	async execute({ handle, host, slug, ...body }) {
		// Anyone may chat, and may name any script: the prompt and list_scripts are no boundary.
		// A script that needs a sign-in would act as the API key's owner, and one that writes
		// would act on a website for an anonymous visitor.
		// The run cannot be pinned to the version checked here: the API refuses a version_id on an
		// official script to anyone outside its project. A promotion between this check and the run
		// is the one gap left.
		const { data: script } = await reduck.getScript({ ...opts(), path: { handle, host, slug } });
		const v = script.current_version;
		if (!v)
			throw new Error(`${handle}/${host}/${slug} has no version to run.`);
		if (catalogueOnly() && script.author.approval !== "official")
			throw new Error(`${handle}/${host}/${slug} is not an official script: this agent cannot run it.`);
		if (v.logged_in !== false)
			throw new Error(`${handle}/${host}/${slug} needs a sign-in: this agent cannot run it.`);
		if (v.side_effects !== "none")
			throw new Error(`${handle}/${host}/${slug} changes things on the website: this agent cannot run it.`);

		const { data: run } = await reduck.runScript({
			...opts(),
			path: { handle, host, slug },
			body: { ...body, browser: "managed", wait_seconds: 55 }
		});
		runIds.update((ids) => [...ids, run.id]);
		return outcome(run);
	}
});
