import { defineTool } from "eve/tools";
import { z } from "zod";

// Where a request goes is the deployer's: a POST of `{ host }` to their URL, with their key as
// the bearer. What they do with it is not this repo's.
export default defineTool({
	description: "Ask for a website to be covered, when no script does what the user wants on it.",
	inputSchema: z.object({ host: z.string().describe("The website, such as luma.com.") }),
	async execute({ host }) {
		const url = process.env.REQUEST_COVERAGE_URL;
		if (!url) return "This deployment takes no requests.";
		const res = await fetch(url, {
			method: "POST",
			headers: {
				authorization: `Bearer ${process.env.REQUEST_COVERAGE_KEY}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({ host })
		});
		if (!res.ok) throw new Error(`Request for ${host}: HTTP ${res.status}`);
		return "Requested.";
	}
});
