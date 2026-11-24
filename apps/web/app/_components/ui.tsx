"use client";

import type { Spec } from "@json-render/core";
import { defineRegistry, JSONUIProvider, Renderer } from "@json-render/react";
import { catalog } from "../../../../agent/lib/ui";

const { registry } = defineRegistry(catalog, {
  components: {
    Products: ({ children }) => (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
    ),
    Product: ({ props: p }) => (
      <a
        className="group flex flex-col gap-1 rounded-xl border bg-card p-3 transition-colors hover:border-foreground/30"
        href={p.url}
        rel="noreferrer"
        target="_blank"
      >
        <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-white">
          {p.image ? (
            <img
              alt={p.title}
              className="size-full object-contain p-3 transition-transform group-hover:scale-105"
              src={p.image}
            />
          ) : null}
        </div>
        <span className="text-muted-foreground text-xs">{p.vendor}</span>
        <span className="line-clamp-2 font-medium text-sm">{p.title}</span>
        <span className="mt-auto pt-1 text-sm">
          <span className="font-semibold">{p.price}</span>
          {p.listPrice ? (
            <span className="ml-2 text-muted-foreground text-xs line-through">{p.listPrice}</span>
          ) : null}
        </span>
        {p.rating ? (
          <span className="text-muted-foreground text-xs">
            ★ {p.rating}
            {p.reviews ? ` · ${p.reviews.toLocaleString()} reviews` : ""}
          </span>
        ) : null}
      </a>
    ),
  },
});

/** What the agent's `show` tool draws. */
export function UI({ spec }: { readonly spec: Spec }) {
  return (
    <JSONUIProvider registry={registry}>
      <Renderer registry={registry} spec={spec} />
    </JSONUIProvider>
  );
}
