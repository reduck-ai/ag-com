"use client";

import type { Spec } from "@json-render/core";
import { defineRegistry, JSONUIProvider, Renderer } from "@json-render/react";
import { cn } from "@/lib/utils";
import { catalog } from "../../../../agent/lib/ui";

const COLUMNS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-2 sm:grid-cols-3", "grid-cols-2 sm:grid-cols-4"];
const TEXT = {
  title: "line-clamp-2 font-medium text-sm",
  body: "text-sm",
  muted: "text-muted-foreground text-xs",
  strong: "font-semibold text-sm",
  struck: "text-muted-foreground text-xs line-through",
};

const { registry } = defineRegistry(catalog, {
  components: {
    Grid: ({ props, children }) => (
      <div className={cn("grid gap-3", COLUMNS[props.columns])}>{children}</div>
    ),
    Card: ({ props, children }) => {
      const className =
        "group flex flex-col gap-1 rounded-xl border bg-card p-3 transition-colors [&>img]:mb-2";
      return props.href ? (
        <a
          className={cn(className, "hover:border-foreground/30")}
          href={props.href}
          rel="noreferrer"
          target="_blank"
        >
          {children}
        </a>
      ) : (
        <div className={className}>{children}</div>
      );
    },
    Row: ({ children }) => <div className="flex flex-wrap items-baseline gap-2">{children}</div>,
    Image: ({ props }) => (
      <img
        alt={props.alt}
        className="aspect-square w-full rounded-lg bg-white object-contain p-3"
        src={props.src}
      />
    ),
    Text: ({ props }) => <span className={TEXT[props.style]}>{props.text}</span>,
    Badge: ({ props }) => (
      <span
        className={cn(
          "w-fit rounded-md px-1.5 py-0.5 font-medium text-xs",
          props.tone === "highlight" ? "bg-red-600 text-white" : "bg-muted text-muted-foreground",
        )}
      >
        {props.text}
      </span>
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
