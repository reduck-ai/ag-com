import * as reduck from "@reduck-ai/sdk";

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
