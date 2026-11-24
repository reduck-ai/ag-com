import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, reduck } from "../lib/reduck";

export default defineTool({
	description:
		"Find Reduck scripts: the official ones and those of your account. Each script does one thing on one website. Read a script's contract with read_script before you run it.",
	inputSchema: z.object({
		q: z.string().optional().describe("Words that describe the task."),
		host: z.string().optional().describe("The website, such as luma.com."),
		catalogue_only: z
			.boolean()
			.default(true)
			.describe("Only the official scripts. False adds those of your account.")
	}),
	async execute({ q, host, catalogue_only }) {
		const { data } = await reduck.listAllScripts({
			...opts(),
			query: { q, host, catalogue_only: `${catalogue_only}`, promoted: "true", page_size: 20 }
		});
		// Only what run_script accepts: no script that needs a sign-in, none that writes.
		return data.data
			.filter((s) => s.current_version?.logged_in === false)
			.filter((s) => s.current_version?.side_effects === "none")
			.map((s) => ({
				handle: s.author.handle,
				host: s.host,
				slug: s.slug,
				name: s.name,
				description: s.description
			}));
	}
});
