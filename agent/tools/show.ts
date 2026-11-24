import { defineTool } from "eve/tools";
import { spec } from "../lib/ui";

export default defineTool({
	description:
		"Show the user a UI in the chat, built from blocks. The input is a flat map of elements: each container names its children by key, from root.",
	inputSchema: spec,
	execute: () => "Shown to the user."
});
