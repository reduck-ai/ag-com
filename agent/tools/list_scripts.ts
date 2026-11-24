import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, reduck } from "../lib/reduck";

export default defineTool({
	description:
		"Find Reduck scripts: the official ones and those of your account. Each script does one thing on one website. Read a script's contract with read_script before you run it.",
	inputSchema: z.object({
		q: z.string().optional().describe("Words that describe the task."),
		host: z.string().optional().describe("The website, such as luma.com.")
	}),
	async execute({ q, host }) {
		const { data } = await reduck.listAllScripts({
			...opts(),
			query: { q, host, promoted: "true", page_size: 20 }
		});
		// The agent holds no sign-in, so a script that needs one cannot run.
		return data.data
			.filter((s) => !s.current_version?.logged_in)
			.map((s) => ({
				handle: s.author.handle,
				host: s.host,
				slug: s.slug,
				name: s.name,
				description: s.description
			}));
	}
});
