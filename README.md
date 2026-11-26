<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/shopduck-logo-dark.svg">
    <img src="docs/shopduck-logo-light.svg" alt="ShopDuck" height="56">
  </picture>
</p>
<h3 align="center">The agent that shops anywhere to get you the best deals</h3>
<p align="center"><sub>Powered by <a href="https://reduck.ai">Reduck</a></sub></p>

Finding the best products at the best price means exploring many stores, but current agents like Muse are blocked on major ones.

ShopDuck solves this with [Reduck](https://reduck.ai/), which provides a [library of scripts](https://docs.reduck.ai/core-concepts/#official-scripts) specific to each store that run on stealthy cloud browsers for fast and accurate results.

ShopDuck works on stores where agents like Muse are blocked, starting with Amazon:

<p align="center">
  <img src="docs/shopduck-vs-muse.png" alt="ShopDuck finds 6 YETI deals on Amazon in 38 s; Muse finds none in 307 s">
  <br>
  <sub>ShopDuck runs scripts like <a href="https://reduck.ai/explore/scripts/reduck/amazon.com/search-products">Amazon search</a> on a stealthy browser, which return full data, deals included. Muse is blocked on Amazon.</sub>
</p>

## Try it on [shopduck.ai](https://shopduck.ai/)

## Who is this for

ShopDuck was designed with two goals in mind:

- For end users: build the best agent for shopping.
    - **Highest store coverage**: Amazon, Walmart, Best Buy, Etsy and more, including stores that block other agents.
    - **No hallucinated data**: data like prices are extracted programmatically with scripts versus other agents reading manually.
    - **6x faster than Muse**: ShopDuck runs scripts instead of an agent loop that acts, then reads screenshots.
- For builders: show with an open-source project how Reduck can be combined with frameworks like Vercel [eve](https://eve.dev) to create harnesses connected to any site.
    - **3x cheaper with Reduck scripts vs manual browsing**: sites are mapped ahead of time into Reduck scripts, so the agent reads no screenshots and generates no browser actions, which takes far fewer tokens.
    - **Customizable**: the code is open source. Inspect it, fork it, add features or other scripts.

## Run it locally

1. Create an API key on [reduck.ai](https://reduck.ai), and one on the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).
2. Copy `.env.example` to `.env.local`, and put them in it.
3. Start the chat, then open [http://localhost:3000](http://localhost:3000):

    ```bash
    pnpm install
    pnpm dev:web
    ```

## Feature roadmap

- [ ] Core stores covered
    - [x] Amazon
    - [x] Walmart
    - [x] Target
    - [x] Best Buy
    - [x] Lowe's
    - [x] Etsy
    - [x] Nike
    - [x] Newegg
    - [x] Apple
    - [ ] eBay
    - [ ] Home Depot
    - [ ] Costco
    - [ ] Wayfair
- [x] Country detection and setup for relevant suggestions
- [x] Read only flows like search, product description and review
- [ ] Write flows like adding to cart and checkout
- [ ] Memory for shopping preferences
- [ ] Caching of search / product results
- [ ] Benchmarks with open data and reproducible code
    - [ ] ShopDuck versus B2C agents like Muse
    - [ ] ShopDuck with Reduck versus manual browsing

## Contribute

- A store is missing? [Open an issue](https://github.com/reduck-ai/shopduck/issues), and we add its script to Reduck's official library, where the agent can use it.
- A new feature? Open an issue or a pull request on [GitHub](https://github.com/reduck-ai/shopduck).
