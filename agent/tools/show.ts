import { defineTool } from "eve/tools";
import { spec } from "../lib/ui";

export default defineTool({
	description: `Show the user products to compare, from one or more websites: a Products element as root, with the keys of its Product elements as children. Example: ${JSON.stringify(
		{
			root: "grid",
			elements: {
				grid: { type: "Products", props: {}, children: ["p1"] },
				p1: {
					type: "Product",
					props: {
						title: "Apple AirPods 4",
						vendor: "Best Buy",
						url: "https://www.bestbuy.com/product/apple-airpods-4-white/JJGCQ83JQ5",
						image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/ed0cfc76.jpg",
						price: "$114.99",
						listPrice: "$155.00",
						rating: 4.7,
						reviews: 11488
					}
				}
			}
		}
	)}`,
	inputSchema: spec,
	execute: () => "Shown to the user."
});
