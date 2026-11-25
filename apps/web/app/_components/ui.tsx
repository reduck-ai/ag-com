"use client";

import type { Spec } from "@json-render/core";
import { defineRegistry, JSONUIProvider, Renderer } from "@json-render/react";
import { TagIcon } from "@/components/icons";
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
        "relative flex min-w-0 flex-col gap-1 rounded-xl border bg-background p-3 transition-colors [&>img]:mb-2";
      const host = hostOf(props.href);
      return props.href ? (
        <a
          className={cn(className, "hover:border-muted-foreground/60")}
          href={props.href}
          rel="noreferrer"
          target="_blank"
        >
          {children}
          {host ? <Shop host={host} /> : null}
        </a>
      ) : (
        <div className={className}>{children}</div>
      );
    },
    Row: ({ children }) => <div className="flex flex-wrap items-baseline gap-2">{children}</div>,
    Image: ({ props }) => (
      <img
        alt={props.alt}
        className="aspect-square w-full rounded-sm bg-white object-contain p-3"
        src={props.src}
      />
    ),
    Text: ({ props }) => <span className={TEXT[props.style]}>{props.text}</span>,
    Badge: ({ props }) =>
      props.tone === "highlight" ? (
        <span className="flex w-fit items-center gap-1 rounded-md bg-deal px-2 py-0.5 font-semibold text-deal-foreground text-xs">
          <TagIcon className="size-3" />
          {props.text}
        </span>
      ) : (
        <span className="w-fit rounded-md border px-1.5 py-0.5 font-medium text-muted-foreground text-xs">
          {props.text}
        </span>
      ),
  },
});

function hostOf(href: string | null): string | undefined {
  if (!href) return undefined;
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

/** The shop an item links to, as its favicon and its name. */
function Shop({ host }: { readonly host: string }) {
  return (
    <span className="mt-auto flex min-w-0 items-center gap-1.5 pt-2 text-muted-foreground text-xs">
      <img
        alt=""
        className="size-4 shrink-0 rounded-xs"
        height={16}
        src={`https://www.google.com/s2/favicons?domain=${host}&sz=32`}
        width={16}
      />
      <span className="truncate">{host}</span>
    </span>
  );
}

/** What the agent's `show` tool draws. */
export function UI({ spec }: { readonly spec: Spec }) {
  return (
    <JSONUIProvider registry={registry}>
      <Renderer registry={registry} spec={spec} />
    </JSONUIProvider>
  );
}
