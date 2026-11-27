"use client";

import type { CallState, SessionView } from "eve/events";
import { callState, call, part, showsActivity } from "eve/events";
import type {
  Interaction,
  EveInteractionPart,
  EveMessage,
  EveMessagePart,
  EveToolPart,
} from "eve/react";
import { signInEnding } from "eve/events";
import type { Spec } from "@json-render/core";
import { Fragment, useState, type FormEvent, type ReactNode } from "react";
import {
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileIcon,
  KeyRoundIcon,
  XCircleIcon,
} from "@/components/icons";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { BashToolContent, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { Button } from "@/components/ui/button";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import { cn } from "@/lib/utils";
import { UI } from "./ui";

export type AgentAnswer = {
  readonly optionId?: string;
  readonly interactionId: string;
  readonly text?: string;
};

/** How a message answers what the agent asks. */
interface Asks {
  readonly canRespond: (interactionId: string) => boolean;
  readonly onAnswers: (answers: readonly AgentAnswer[]) => void | Promise<void>;
  /** Every question a call asked; its part holds only the latest. */
  readonly questionsFor: (callId: string) => readonly Interaction[];
}

type EveFilePart = Extract<EveMessagePart, { type: "file" }>;
type Step = Extract<EveMessagePart, { type: "reasoning" | "tool" }>;

export function AgentMessage({
  last,
  live,
  message,
  view,
  ...asks
}: Asks & {
  // The finished last message keeps its actions in view; the others show them on hover.
  readonly last: boolean;
  /** The agent still works on this message. */
  readonly live: boolean;
  readonly message: EveMessage;
  readonly view: SessionView;
}) {
  const text = message.parts.flatMap((p) => (p.type === "text" ? [p.text] : [])).join("\n\n");
  // An image with a URL shows above the bubble, as itself; the bubble holds the rest.
  const isImage = (p: EveMessagePart) => p.type === "file" && p.url !== undefined;
  const blocks = blocksOf(message.parts.filter((p) => !isImage(p)), asks);
  return (
    <Message
      data-optimistic={message.metadata?.optimistic ? "true" : undefined}
      from={message.role}
    >
      {message.parts.filter(isImage).map((image, index) => (
        <ImagePart image={image as EveFilePart} key={`image:${index}`} />
      ))}
      {blocks.length > 0 ? (
        <MessageContent>
          {blocks.map((block, index) =>
            Array.isArray(block) ? (
              <Steps
                asks={asks}
                key={partKey(block[0]!, index)}
                // Between two calls no step runs, but the agent still works on this list.
                live={live && index === blocks.length - 1}
                steps={block}
                view={view}
              />
            ) : (
              <AgentMessagePart asks={asks} key={partKey(block, index)} part={block} />
            ),
          )}
        </MessageContent>
      ) : null}
      {text ? (
        <MessageActions
          className={cn(
            "-ml-1.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 group-[.is-user]:-mr-1.5 group-[.is-user]:self-end pointer-coarse:opacity-100",
            last && "opacity-100",
          )}
        >
          <CopyAction text={text} />
        </MessageActions>
      ) : null}
    </Message>
  );
}

/** Copies a message's words, in markdown; the cards it shows stay out. */
function CopyAction({ text }: { readonly text: string }) {
  const [copied, setCopied] = useState(false);
  const Icon = copied ? CheckIcon : CopyIcon;
  return (
    <MessageAction
      className="rounded-md text-muted-foreground"
      onClick={() =>
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
      }
      size="icon-xs"
      tooltip="Copy"
    >
      <Icon className="size-3.5" />
    </MessageAction>
  );
}

/**
 * A message's parts, with each run of steps (reasoning and calls) gathered into one list. A call
 * that asks a question shows as that question instead, and a call eve hides (`label: false`, or
 * the model waiting on its own tasks) isn't activity to show.
 */
function blocksOf(parts: readonly EveMessagePart[], asks: Asks): (EveMessagePart | Step[])[] {
  const blocks: (EveMessagePart | Step[])[] = [];
  for (const part of parts) {
    if (part.type === "tool" && !showsActivity(part)) continue;
    const isStep =
      part.type === "reasoning" ||
      (part.type === "tool" && part.name !== "show" && asks.questionsFor(part.callId).length === 0);
    const last = blocks.at(-1);
    if (!isStep) blocks.push(part);
    else if (Array.isArray(last)) last.push(part as Step);
    else blocks.push([part as Step]);
  }
  return blocks;
}

function AgentMessagePart({ asks, part }: { readonly asks: Asks; readonly part: EveMessagePart }) {
  switch (part.type) {
    case "text":
      return (
        <MessageResponse caret="block" isAnimating={part.state === "streaming"}>
          {part.text}
        </MessageResponse>
      );
    case "file":
      return <AttachmentPart part={part} />;
    case "interaction":
      return <InteractionPrompt asks={asks} part={part} />;
    case "tool":
      // Drawn once eve has run the call: its input then fits the catalog.
      if (part.name === "show")
        return part.output === undefined ? null : <UI spec={part.input as Spec} />;
      return (
        <div className="space-y-4">
          {asks.questionsFor(part.callId).map((question) => {
            // The call's part shows an answer this client sent at once; the view, once eve has it.
            const { answer, ...request } =
              part.interaction?.interactionId === question.interactionId
                ? part.interaction
                : question;
            return (
              <QuestionRequest
                answer={answer}
                canRespond={asks.canRespond(request.interactionId)}
                interaction={request}
                key={request.interactionId}
                onAnswers={asks.onAnswers}
              />
            );
          })}
        </div>
      );
    default:
      return null;
  }
}

/**
 * A run of steps. Several fold into one line that names the running step while they work, and
 * opens only to wait for the user; an approval waits below them, so it stays in view.
 */
function Steps({
  asks,
  live,
  steps,
  view,
}: {
  readonly asks: Asks;
  readonly live: boolean;
  readonly steps: readonly Step[];
  readonly view: SessionView;
}) {
  const [open, setOpen] = useState<boolean>();
  const states = steps.map((step) => stepState(step, view));
  const running = steps.findLast((_, index) => states[index] === "working");
  const working = live || running !== undefined;
  const waiting = states.some((state) => state === "waiting");
  const toolLines = (call: EveToolPart): ReactNode => {
    const nested = steps.filter(
      (step): step is EveToolPart => step.type === "tool" && parentCallIdOf(step) === call.callId,
    );
    return (
      <Fragment key={call.callId}>
        <ToolLine part={call} state={callState(view, call.callId)} />
        {nested.length > 0 ? (
          <div className="ml-[calc(--spacing(2)-1px)] border-l pl-4">
            <Trace>{nested.map(toolLines)}</Trace>
          </div>
        ) : null}
      </Fragment>
    );
  };
  const lines = (
    <Trace>
      {steps.map((step, index) =>
        step.type === "reasoning" ? (
          <ReasoningLine key={partKey(step, index)} part={step} />
        ) : isNested(step, steps) ? null : (
          toolLines(step)
        ),
      )}
    </Trace>
  );
  const approvals = steps.flatMap((step) =>
    step.type === "tool" &&
    step.interaction?.request.kind === "approval" &&
    step.interaction.status !== "settled"
      ? [step.interaction]
      : [],
  );

  return (
    <>
      {steps.length === 1 ? (
        lines
      ) : (
        <TraceCollapsible onOpenChange={setOpen} open={open ?? waiting}>
          <TraceCollapsibleTrigger>
            <TraceLine status={working ? "running" : undefined}>
              <TraceTitle>
                {working
                  ? running?.type === "tool"
                    ? running.label
                    : "Thinking"
                  : waiting
                    ? "Waiting for you"
                    : `Worked${duration(steps, view) ?? ""}`}
              </TraceTitle>
              {working ? null : <TraceDescription>{`${steps.length} steps`}</TraceDescription>}
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>{lines}</TraceCollapsibleContent>
        </TraceCollapsible>
      )}
      {approvals.map((interaction) => (
        <InteractionActions
          answer={interaction.answer}
          asks={asks}
          interaction={interaction}
          key={interaction.interactionId}
        />
      ))}
    </>
  );
}

/**
 * Whether a call shows under another call of its run: the one it was made inside, such as a
 * `workflow()` program call.
 */
function isNested(step: Step, steps: readonly Step[]): boolean {
  if (step.type !== "tool") return false;
  const parent = parentCallIdOf(step);
  return steps.some((other) => other.type === "tool" && other.callId === parent);
}

/** The call a call was made inside. Earlier eve releases report none. */
function parentCallIdOf(part: EveToolPart): string | undefined {
  const parent = "parentCallId" in part ? part.parentCallId : undefined;
  return typeof parent === "string" ? parent : undefined;
}

function stepState(step: Step, view: SessionView): "working" | "waiting" | "done" {
  if (step.type === "reasoning") return step.state === "streaming" ? "working" : "done";
  const state = callState(view, step.callId);
  if (state === "approval" || state === "blocked") return "waiting";
  const status = state === undefined ? "running" : CALL_LINES[state].status;
  return status === undefined ? "done" : "working";
}

/** " for 12s": from the first step's start to the last one's end, when facts report times. */
function duration(steps: readonly Step[], view: SessionView): string | undefined {
  const times = steps.flatMap((step) => {
    const observed = step.type === "tool" ? call(view, step.callId) : part(view, step.id ?? "");
    if (observed?.startedAt === undefined) return [];
    return [Date.parse(observed.startedAt), Date.parse(observed.endedAt ?? observed.startedAt)];
  });
  if (times.length === 0) return undefined;
  const seconds = Math.round((Math.max(...times) - Math.min(...times)) / 1000);
  if (seconds < 1) return undefined;
  return seconds < 60 ? ` for ${seconds}s` : ` for ${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

/**
 * How a call's line reads in each state: its status, and a word on why. A failed call is the
 * agent's to retry, so it reads as a word, not as an alarm.
 */
const CALL_LINES: Record<
  CallState,
  { readonly status?: "running" | "pending"; readonly note?: string }
> = {
  approval: { note: "Needs approval", status: "pending" },
  blocked: { note: "Waiting for you", status: "running" },
  cancelled: { note: "Stopped" },
  completed: {},
  failed: { note: "Failed" },
  rejected: { note: "Denied" },
  requested: { status: "pending" },
  running: { status: "running" },
};

function ToolLine({
  part,
  state,
}: {
  readonly part: EveToolPart;
  readonly state: CallState | undefined;
}) {
  // A call the model is still writing has no row yet.
  const { note, status } = state === undefined ? { status: "running" as const } : CALL_LINES[state];
  // An answer waits on its approval until every approval asked with it is decided.
  const answered =
    state === "approval" && part.interaction?.answer !== undefined
      ? "Response submitted"
      : undefined;
  const line = (
    <TraceLine status={status}>
      <TraceTitle>{part.label}</TraceTitle>
      {(answered ?? note) ? <TraceDescription>{answered ?? note}</TraceDescription> : null}
    </TraceLine>
  );
  if (part.input === undefined && part.output === undefined && part.error === undefined)
    return line;

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="space-y-2 text-foreground">
        {part.name === "bash" ? (
          <BashToolContent
            errorText={part.error?.message}
            input={part.input}
            output={part.output}
          />
        ) : (
          <>
            {part.input === undefined ? null : <ToolInput input={part.input} />}
            <ToolOutput errorText={part.error?.message} output={part.output} />
          </>
        )}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

function ReasoningLine({ part }: { readonly part: Extract<Step, { type: "reasoning" }> }) {
  const [open, setOpen] = useState<boolean>();
  const running = part.state === "streaming";
  const line = (
    <TraceLine status={running ? "running" : undefined}>
      <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
    </TraceLine>
  );
  if (part.text.length === 0) return line;

  return (
    <TraceCollapsible onOpenChange={setOpen} open={open ?? running}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">{part.text}</TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

function QuestionRequest({
  canRespond,
  interaction,
  answer,
  onAnswers,
}: {
  readonly canRespond: boolean;
  readonly interaction: Interaction;
  readonly answer?: AgentAnswer;
  readonly onAnswers: (responses: readonly AgentAnswer[]) => void | Promise<void>;
}) {
  const options = interaction.request.options ?? [];
  const acceptsFreeform = interaction.request.allowFreeform === true || options.length === 0;
  const disabled = !canRespond || answer !== undefined;

  const submitResponse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get(interaction.interactionId);
    if (typeof value !== "string") {
      return;
    }

    const option = options.find(({ id }) => id === value);
    void onAnswers([
      option === undefined
        ? { interactionId: interaction.interactionId, text: value.trim() }
        : { optionId: option.id, interactionId: interaction.interactionId },
    ]);
  };

  return (
    <Questionnaire
      className="gap-4 rounded-xl border bg-card p-4"
      // Validation reads disabled answers as missing, so locking a submitted form in place would
      // flag it invalid. Remounting restores the answer from the response instead.
      key={disabled ? "locked" : "open"}
      onSubmit={submitResponse}
      shortcuts="numbers"
    >
      <QuestionnaireItem name={interaction.interactionId} required>
        <QuestionnaireTitle className="text-sm font-medium">
          {interaction.request.prompt}
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          {options.map((option) => (
            <QuestionnaireChoice
              className={cn(answer?.optionId === option.id && "data-disabled:opacity-100")}
              defaultChecked={answer?.optionId === option.id}
              disabled={disabled}
              key={option.id}
              value={option.id}
            >
              {option.label}
              {option.description ? (
                <QuestionnaireChoiceDescription>
                  {option.description}
                </QuestionnaireChoiceDescription>
              ) : null}
            </QuestionnaireChoice>
          ))}
          {acceptsFreeform ? (
            <QuestionnaireInput
              aria-label="Answer"
              className={cn(answer?.text !== undefined && "disabled:opacity-100")}
              defaultValue={answer?.text}
              disabled={disabled}
              placeholder="Type your answer…"
            />
          ) : null}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      {disabled ? null : (
        <QuestionnaireActions>
          <QuestionnaireSubmit size="sm">Answer</QuestionnaireSubmit>
        </QuestionnaireActions>
      )}
    </Questionnaire>
  );
}

function ImagePart({ image }: { readonly image: EveFilePart }) {
  return (
    <a className="w-fit group-[.is-user]:self-end" href={image.url} rel="noreferrer" target="_blank">
      <img alt={image.filename ?? ""} className="max-h-80 rounded-lg border" src={image.url} />
    </a>
  );
}

/** A file whose bytes eve keeps no URL for: its name. */
function AttachmentPart({ part }: { readonly part: EveFilePart }) {
  const detail = [part.mediaType, formatBytes(part.size)].filter(Boolean).join(" - ");
  return (
    <span className="flex max-w-sm items-center gap-3 rounded-md border bg-background/60 p-2 text-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground">
        <FileIcon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{part.filename ?? "Attachment"}</span>
        {detail ? <span className="block truncate text-muted-foreground">{detail}</span> : null}
      </span>
    </span>
  );
}

/** An interaction no call carries: a sign-in, the budget prompt, or a question of its own. */
function InteractionPrompt({
  asks,
  part,
}: {
  readonly asks: Asks;
  readonly part: EveInteractionPart;
}) {
  const { request } = part;
  if (request.signIn !== undefined) return <SignInPrompt part={part} />;
  if (request.kind === "question") {
    return (
      <QuestionRequest
        answer={part.answer}
        canRespond={asks.canRespond(part.interactionId)}
        interaction={part}
        onAnswers={asks.onAnswers}
      />
    );
  }
  return <InteractionActions answer={part.answer} asks={asks} interaction={part} />;
}

function SignInPrompt({ part }: { readonly part: EveInteractionPart }) {
  const signIn = part.request.signIn;
  const name = signIn?.displayName ?? signIn?.name ?? "the service";
  const isAuthorized = part.outcome === "accepted";
  const isCompleted = part.status === "settled";
  const Icon = isAuthorized ? CheckCircleIcon : isCompleted ? XCircleIcon : KeyRoundIcon;
  const instructions = signIn?.instructions;
  const description = isCompleted
    ? isAuthorized
      ? `${name} connected.`
      : `${name} authorization ${signInEnding(part.outcome ?? "withdrawn")}${
          part.reason !== undefined ? ` (${part.reason})` : ""
        }.`
    : part.request.prompt;

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg p-3",
        isAuthorized ? "bg-success" : isCompleted ? "bg-danger" : "bg-info",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
            isAuthorized
              ? "text-success-foreground"
              : isCompleted
                ? "text-destructive"
                : "text-info-foreground",
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-medium text-sm">
            {isCompleted
              ? isAuthorized
                ? `${name} connected`
                : `${name} authorization ${signInEnding(part.outcome ?? "withdrawn")}`
              : `Connect ${name}`}
          </p>
          <p className="text-muted-foreground text-sm">{description}</p>
          {!isCompleted && instructions !== undefined && instructions !== description ? (
            <p className="text-muted-foreground text-sm">{instructions}</p>
          ) : null}
          {!isCompleted && signIn?.userCode ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Code</span>
              <code className="rounded-md bg-background px-2 py-1 font-mono">
                {signIn.userCode}
              </code>
            </div>
          ) : null}
          {!isCompleted && signIn?.url ? (
            <Button asChild size="sm">
              <a href={signIn.url} rel="noreferrer" target="_blank">
                <ExternalLinkIcon className="size-4" />
                Sign in with {name}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatBytes(size: number | undefined): string | undefined {
  if (size === undefined) {
    return undefined;
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/** An interaction's prompt with a button for each option, or how it was answered. */
function InteractionActions({
  answer,
  asks,
  interaction,
}: {
  readonly answer?: AgentAnswer;
  readonly asks: Asks;
  readonly interaction: Interaction;
}) {
  const selectedOption = interaction.request.options?.find(
    (option) => option.id === answer?.optionId,
  );

  return (
    <div className="space-y-3 rounded-lg bg-warning p-3">
      <p className="text-muted-foreground text-sm">{interaction.request.prompt}</p>
      {answer ? (
        <p className="font-medium text-sm">
          Responded: {selectedOption?.label ?? answer.text ?? answer.optionId}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {interaction.request.options?.map((option, index) => (
            <Button
              disabled={!asks.canRespond(interaction.interactionId)}
              key={option.id}
              onClick={() => {
                void asks.onAnswers([
                  {
                    optionId: option.id,
                    interactionId: interaction.interactionId,
                  },
                ]);
              }}
              size="sm"
              type="button"
              variant={
                option.style === "danger" ? "destructive" : index === 0 ? "default" : "outline"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function partKey(part: EveMessagePart, index: number): string {
  switch (part.type) {
    case "interaction":
      return `interaction:${part.interactionId}`;
    case "tool":
      return part.callId;
    case "reasoning":
    case "text":
      return `${part.type}:${part.id ?? index}`;
    default:
      return `${part.type}:${index}`;
  }
}
