import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

// The blocks the model composes. How each one looks is fixed in apps/web/app/_components/ui.tsx.
export const catalog = defineCatalog(schema, {
	components: {
		Grid: {
			props: z.object({ columns: z.number().int().min(1).max(4) }),
			slots: ["default"],
			description: "Items side by side."
		},
		Card: {
			props: z.object({ href: z.string().nullable() }),
			slots: ["default"],
			description: "One item. With href, the whole card links to its page and shows its shop."
		},
		Row: { props: z.object({}), slots: ["default"], description: "Elements on one line." },
		Image: { props: z.object({ src: z.string(), alt: z.string() }), description: "A picture." },
		Text: {
			props: z.object({
				text: z.string(),
				style: z.enum(["title", "body", "muted", "strong", "struck"])
			}),
			description: "title: an item's name. strong: a value that matters, such as a price. struck: a value that no longer applies, such as the price before a discount."
		},
		Badge: {
			props: z.object({ text: z.string(), tone: z.enum(["highlight", "neutral"]) }),
			description: "A short label, such as a deal."
		}
	},
	actions: {}
});

// The catalog's own spec schema leaves props untyped: this one gives the model each component's
// props, and lets eve reject a spec that does not fit them.
const element = Object.entries(catalog.data.components).map(([type, c]) =>
	z
		.object({ type: z.literal(type), props: c.props, children: z.array(z.string()).optional() })
		.describe(c.description)
);
export const spec = z.object({
	root: z.string(),
	elements: z.record(
		z.string(),
		z.discriminatedUnion("type", element as [(typeof element)[0], ...typeof element])
	)
});
