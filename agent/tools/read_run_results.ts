import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, outcome, reduck, runPath } from "../lib/reduck";

export default defineTool({
	description: "Read a run: its status, and its result or error.",
	// Reading a contract or a run is how the agent works, not what a shopper sees it do.
	label: false,
	inputSchema: z.object({ run_id: z.string() }),
	async execute({ run_id }) {
		return outcome((await reduck.getRun({ ...opts(), path: runPath(run_id) })).data);
	}
});
