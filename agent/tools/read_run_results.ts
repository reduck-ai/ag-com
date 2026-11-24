import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, outcome, reduck } from "../lib/reduck";

export default defineTool({
	description: "Read a run: its status, and its result or error.",
	inputSchema: z.object({ run_id: z.string() }),
	async execute(path) {
		return outcome((await reduck.getRun({ ...opts(), path })).data);
	}
});
