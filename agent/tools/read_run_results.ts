import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, outcome, reduck, runPath } from "../lib/reduck";

export default defineTool({
	description: "Read a run: its status, and its result or error.",
	inputSchema: z.object({ run_id: z.string() }),
	async execute({ run_id }) {
		return outcome((await reduck.getRun({ ...opts(), path: runPath(run_id) })).data);
	}
});
