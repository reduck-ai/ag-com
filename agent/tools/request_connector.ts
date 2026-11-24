import { defineTool } from "eve/tools";
import { z } from "zod";
import { opts, profileId, reduck } from "../lib/reduck";

export default defineTool({
	description:
		"Get a link where the user signs in to a website on a cloud browser. The session is then saved for this user only. Give the link to the user; do not open it.",
	inputSchema: z.object({ start_url: z.string().url().describe("The website's sign-in page.") }),
	async execute(body, ctx) {
		return (
			await reduck.createConnectorLink({
				...opts(),
				body: { ...body, profile_id: await profileId(ctx) }
			})
		).data;
	}
});
