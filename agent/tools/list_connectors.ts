import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, profileId, reduck } from "../lib/reduck";

export default defineTool({
	description: "List the websites the user is signed in to.",
	inputSchema: z.object({}),
	async execute(_input, ctx) {
		return (
			await reduck.listConnectors({ ...opts(), query: { profile_id: await profileId(ctx) } })
		).data;
	}
});
