import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

// What the model may show. How each component looks is fixed in apps/web/app/_components/ui.tsx.
export const catalog = defineCatalog(schema, {
	components: {
		Products: {
			props: z.object({}),
			slots: ["default"],
			description: "A grid of Product elements."
		},
		Product: {
			props: z.object({
				title: z.string(),
				vendor: z.string().describe("The website that sells it, such as Amazon."),
				url: z.string(),
				image: z.string().nullable(),
				price: z.string().describe("With its currency, such as $149.99."),
				listPrice: z.string().nullable().describe("The price before a discount."),
				rating: z.number().nullable(),
				reviews: z.number().nullable()
			}),
			description: "A product for sale, linking to its page."
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
