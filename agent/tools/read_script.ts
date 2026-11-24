import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, reduck } from "../lib/reduck";

export default defineTool({
	description:
		"Read a script's contract: what it does, the args it takes (input_schema), and what it returns (output_schema).",
	inputSchema: z.object({ handle: z.string(), host: z.string(), slug: z.string() }),
	async execute(path) {
		const { data: s } = await reduck.getScript({ ...opts(), path });
		const v = s.current_version;
		if (!v) throw new Error(`${path.handle}/${path.host}/${path.slug} has no version to run.`);
		return {
			name: s.name,
			description: s.description,
			side_effects: v.side_effects,
			input_schema: v.input_schema,
			output_schema: v.output_schema
		};
	}
});
