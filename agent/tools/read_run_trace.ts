import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, reduck, runPath } from "../lib/reduck";

// A stored step carries screenshots and the page's HTML: the model gets what the step did and how
// it ended, not those.
type Step = { name: string; args: unknown[]; error?: string; t0: number; t1: number };

export default defineTool({
	description: "Read the steps a run took on the website, to find where a failed run stopped.",
	// Reading a contract or a run is how the agent works, not what a shopper sees it do.
	label: false,
	inputSchema: z.object({ run_id: z.string() }),
	async execute({ run_id }) {
		const { data, response } = await reduck.getRunTrace({
			...opts(),
			throwOnError: false,
			path: runPath(run_id)
		});
		// A run that recorded no trace answers 404.
		if (!data && response?.status !== 404)
			throw new Error(`Trace of run ${run_id}: HTTP ${response?.status}`);
		return ((data ?? []) as Step[]).map((s) => ({
			name: s.name,
			args: JSON.stringify(s.args).slice(0, 200),
			ms: Math.round(s.t1 - s.t0),
			...(s.error ? { error: s.error } : {})
		}));
	}
});
