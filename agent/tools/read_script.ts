import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, reduck } from "../lib/reduck";

export default defineTool({
	description:
		"Read a script's contract: what it does, the args it takes (input_schema), what it returns (output_schema), and whether the user must be signed in to its website (logged_in).",
	inputSchema: z.object({ handle: z.string(), host: z.string(), slug: z.string() }),
	async execute(path) {
		const { data: s } = await reduck.getScript({ ...opts(), path });
		const v = s.current_version;
		if (!v) throw new Error(`${path.handle}/${path.host}/${path.slug} has no version to run.`);
		return {
			name: s.name,
			description: s.description,
			logged_in: v.logged_in,
			side_effects: v.side_effects,
			input_schema: v.input_schema,
			output_schema: v.output_schema
		};
	}
});
