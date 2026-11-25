import * as reduck from "@reduck-ai/sdk";
import { defineState } from "eve/context";

export { reduck };

// Built on first call: eve evaluates the tools at build time, where REDUCK_API_KEY is not set.
let client: ReturnType<typeof reduck.createReduckClient> | undefined;
export function opts() {
	if (!process.env.REDUCK_API_KEY)
		throw new Error("Set REDUCK_API_KEY: create an API key on reduck.ai.");
	client ??= reduck.createReduckClient({
		apiKey: process.env.REDUCK_API_KEY,
		baseUrl: process.env.REDUCK_API_URL // unset: reduck.ai
	});
	return { client, throwOnError: true } as const;
}

// The deployer's choice, not the model's: "false" adds the scripts of the API key's account.
export const catalogueOnly = () => process.env.REDUCK_CATALOGUE_ONLY !== "false";

// Every chat runs as the API key's account, which may read any of its runs: a chat reads only the
// runs it started.
export const runIds = defineState<string[]>("shopduck.run_ids", () => []);
export function runPath(run_id: string) {
	if (!runIds.get().includes(run_id)) throw new Error(`Run ${run_id} was not started in this chat.`);
	return { run_id };
}

// A run as the model reads it: the script's own result, or its own error rather than the generic
// `external_message`, since the exact reason is what tells whether another call can succeed.
export function outcome(run: reduck.Run) {
	const done = run.finished_at !== null;
	const r = run.result;
	return {
		run_id: run.id,
		status: run.status,
		...(done && r && "result" in r ? { result: r.result } : {}),
		...(done && r && "error" in r ? { error: r.error, error_type: run.error_type } : {})
	};
}
