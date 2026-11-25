import { defineTool } from "eve/tools";
import { z } from "zod";
import { catalogueOnly, opts, reduck } from "../lib/reduck";

export default defineTool({
	description:
		"Find Reduck scripts. Each script does one thing on one website. Read a script's contract with read_script before you run it.",
	inputSchema: z.object({
		q: z
			.string()
			.optional()
			.describe(
				"Words for what the script does on the site, such as \"search products\". Not the item you look for: give that to the script."
			),
		host: z.string().optional().describe("The website, such as luma.com.")
	}),
	async execute({ q, host }) {
		const { data } = await reduck.listAllScripts({
			...opts(),
			query: { q, host, catalogue_only: `${catalogueOnly()}`, promoted: "true", page_size: 20 }
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
