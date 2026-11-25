"use client";

import { ClientError, SessionNotActiveError, type MessagePart } from "eve/client";
import {
  activeTurn,
  activity,
  failure,
  interaction,
  interactions,
  turns,
  type Activity,
} from "eve/events";
import { useEveAgent } from "eve/react";
import { AlertCircleIcon, BrainIcon, HistoryIcon, PlusIcon, SquareIcon } from "@/components/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationTopFade,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace";
import { cn } from "@/lib/utils";
import { AgentMessage } from "./agent-message";
import { captureMessageSent } from "./analytics";
import { WEB_CHAT_AGENT } from "@/app/eve-agent";

const DEFAULT_AGENT_NAME = "ShopDuck";
const AGENT_NAME = WEB_CHAT_AGENT ?? DEFAULT_AGENT_NAME;

// A chat's URL holds its session id, and anyone holding a session id may read and continue it,
// since every visitor is anonymous. The browser that started a chat lists it; eve keeps its
// messages.
export function AgentChat({
  sessionless = false,
  sessionId,
}: {
  readonly sessionless?: boolean;
  readonly sessionId?: string;
}) {
  const [cancellationError, setCancellationError] = useState<string>();
  const [hasInputText, setHasInputText] = useState(false);
  const [chats, setChats] = useState<readonly SavedChat[]>([]);
  useEffect(() => setChats(savedChats()), []);
  const agent = useEveAgent({
    agent: WEB_CHAT_AGENT,
    initialSession: sessionId === undefined ? undefined : { sessionId, streamIndex: 0 },
    prewarm: hasInputText,
    resume: sessionId !== undefined,
  });

  const isBusy = agent.status === "busy";
  // A turn waiting on a person is open while the store is idle; it still takes steering and Stop.
  const turnOpen = activeTurn(agent.view) !== undefined;
  const isResuming = agent.status === "resuming";
  const isEmpty = agent.messages.length === 0;
  const lastMessage = agent.messages.at(-1);
  const isPendingAssistantShell =
    lastMessage?.role === "assistant" && lastMessage.parts.length === 0;
  const now = activity(agent.view);
  // Show what the agent is doing until its message has something to show, unless it waits on you.
  const showPendingThinking =
    isBusy &&
    now.kind !== "waiting-on-interaction" &&
    (lastMessage?.role !== "assistant" || isPendingAssistantShell);
  const failed =
    isBusy || isResuming ? undefined : failure(agent.view, turns(agent.view).at(-1)?.turnId);
  const turnFailure =
    failed?.code === "MODEL_CALL_FAILED"
      ? "The model is temporarily unavailable. Please try again."
      : failed?.message;
  // 429 is the Vercel firewall's rate limit per IP, which caps what one visitor spends.
  const rateLimited = ClientError.is(agent.error) && agent.error.status === 429;
  const errorMessage =
    cancellationError ??
    (rateLimited
      ? "You sent too many messages. Wait a few minutes, then try again."
      : agent.error?.message) ??
    turnFailure;
  const hasConversationContent = sessionless || !isEmpty || errorMessage !== undefined;
  const showConversationLayout = isResuming || hasConversationContent;
  const activeSessionId = agent.session?.sessionId;
  // A session that ended outside eve never settles its requests, so they stay open, yet it
  // accepts no answer. Once the server says so, stop offering them.
  const sessionEnded =
    SessionNotActiveError.is(agent.error) && agent.error.code === "session_not_active";
  // Answers are accepted while work runs; the server's settlement closes each request.
  const canRespond = (interactionId: string) =>
    !isResuming && !sessionEnded && interaction(agent.view, interactionId)?.status === "open";
  // A tool call can ask several questions at once, and its message part holds only the latest.
  const questionsFor = (callId: string) =>
    interactions(agent.view).filter(
      (input) => input.request.kind === "question" && input.call?.callId === callId,
    );

  const requestCancellation = () => {
    setCancellationError(undefined);
    void agent.cancel().catch((error: unknown) => {
      setCancellationError(toErrorMessage(error));
    });
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if ((text.length === 0 && message.files.length === 0) || isResuming) return;

    setHasInputText(false);
    setCancellationError(undefined);
    const options = turnOpen ? { turnPolicy: "steer" as const } : undefined;
    captureMessageSent({ withFiles: message.files.length > 0, steer: turnOpen });

    const parts: MessagePart[] = [];
    if (text.length > 0) {
      parts.push({ text, type: "text" });
    }
    for (const file of message.files) {
      parts.push({
        data: file.url,
        filename: file.filename,
        mediaType: file.mediaType,
        type: "file",
      });
    }

    const delivery = await agent.send(message.files.length === 0 ? text : parts, options);
    if (!isEmpty) return;
    saveChat({ sessionId: delivery.sessionId, title: text || "Files" });
    // Next.js patches `history`: its router would remount the page and cut off the reply.
    History.prototype.replaceState.call(
      window.history,
      window.history.state,
      "",
      `/s/${encodeURIComponent(delivery.sessionId)}`,
    );
  };

  const composer = (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        className={showConversationLayout ? undefined : "min-h-24 px-3.5 py-3.5 md:text-base"}
        disabled={isResuming}
        onChange={(event) => setHasInputText(event.currentTarget.value.trim().length > 0)}
        placeholder={isEmpty ? "What are you looking for?" : "Send a message…"}
      />
      <ComposerAction
        hasInputText={hasInputText}
        canCancel={turnOpen}
        isResuming={isResuming}
        onCancel={requestCancellation}
      />
    </PromptInput>
  );

  return (
    <main className="flex h-dvh flex-col overflow-hidden text-foreground">
      {showConversationLayout ? null : <div aria-hidden className="dot-ground" />}
      {showConversationLayout || chats.length > 0 ? (
        <ChatHeader
          canStartNewChat={activeSessionId !== undefined}
          chats={chats}
          showLogo={showConversationLayout}
        />
      ) : null}

      {showConversationLayout ? (
        <Conversation
          className="min-h-0 flex-1"
          resize={activeSessionId === undefined ? "smooth" : "instant"}
          scrollRestorationKey={
            isEmpty || activeSessionId === undefined
              ? undefined
              : `eve:web-chat-scroll:${activeSessionId}`
          }
        >
          <ConversationTopFade className="top-14" />
          <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 pt-20 pb-36 sm:px-6">
            {agent.messages.map((message) =>
              showPendingThinking &&
              isPendingAssistantShell &&
              message.id === lastMessage.id ? null : (
                <AgentMessage
                  canRespond={canRespond}
                  key={message.id}
                  message={message}
                  questionsFor={questionsFor}
                  view={agent.view}
                  onAnswers={async (answers) => {
                    setCancellationError(undefined);
                    await agent.respond(answers).catch((cause: unknown) => {
                      setCancellationError(
                        cause instanceof Error ? cause.message : "Unable to submit the answer.",
                      );
                    });
                  }}
                />
              ),
            )}
            {showPendingThinking ? <PendingActivity activity={now} /> : null}
            {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      ) : null}

      <div
        className={cn(
          "mx-auto w-full px-4 sm:px-6",
          showConversationLayout
            ? "fixed bottom-0 left-1/2 z-20 flex max-w-3xl -translate-x-1/2 flex-col items-center gap-2 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-3"
            : "flex max-w-[39rem] flex-1 flex-col items-center justify-center gap-8 pb-[10vh]",
        )}
      >
        {showConversationLayout ? null : (
          <h1 className="m-0">
            <img alt={AGENT_NAME} className="h-9 w-auto sm:h-11" src="/brand/shopduck-logo.svg" />
          </h1>
        )}
        <div className="w-full">{composer}</div>
        {showConversationLayout ? <PoweredByReduck /> : null}
      </div>
      {showConversationLayout ? null : (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <PoweredByReduck />
        </div>
      )}
    </main>
  );
}

function ComposerAction({
  hasInputText,
  canCancel,
  isResuming,
  onCancel,
}: {
  readonly hasInputText: boolean;
  readonly canCancel: boolean;
  readonly isResuming: boolean;
  readonly onCancel: () => void;
}) {
  const attachments = usePromptInputAttachments();
  const canSubmit = hasInputText || attachments.files.length > 0;

  if (!canCancel || canSubmit) {
    return <PromptInputSubmit disabled={isResuming} />;
  }

  return (
    <PromptInputButton
      aria-label="Stop"
      className="absolute right-2 bottom-2"
      onClick={onCancel}
      variant="outline"
    >
      <SquareIcon className="size-3 fill-current" />
    </PromptInputButton>
  );
}

function ErrorMessage({ message }: { readonly message: string }) {
  return (
    <Message className="max-w-full" from="assistant">
      <MessageContent>
        <div
          className="flex w-full items-start gap-3 rounded-lg bg-danger px-3 py-2.5 text-sm"
          role="alert"
        >
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">Request failed</p>
            <p className="mt-0.5 text-muted-foreground">{message}</p>
          </div>
        </div>
      </MessageContent>
    </Message>
  );
}

function ChatHeader({
  canStartNewChat,
  chats,
  showLogo,
}: {
  readonly canStartNewChat: boolean;
  readonly chats: readonly SavedChat[];
  // The empty page shows the logo large, under the header.
  readonly showLogo: boolean;
}) {
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-20 h-14">
      <div className="relative mx-auto flex h-full w-full max-w-3xl items-center justify-center bg-background px-24">
        {chats.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open a past chat"
                className="pointer-events-auto fixed top-3 left-6"
                size="sm"
                type="button"
                variant="ghost"
              >
                <HistoryIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-w-72">
              {chats.map((chat) => (
                <DropdownMenuItem asChild key={chat.sessionId}>
                  <Link href={`/s/${encodeURIComponent(chat.sessionId)}`}>
                    <span className="truncate">{chat.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {showLogo ? (
          <a
            aria-label={AGENT_NAME}
            className="pointer-events-auto flex items-center rounded-md"
            href="/"
          >
            <img alt="" className="h-5 w-auto" src="/brand/shopduck-logo.svg" />
          </a>
        ) : null}
        {canStartNewChat ? (
          <Button
            aria-label="Start a new chat"
            className="pointer-events-auto fixed top-3 right-6 pr-4"
            onClick={() => window.location.assign("/s")}
            size="sm"
            type="button"
            variant="ghost"
          >
            <PlusIcon className="size-4" />
            <span className="hidden font-normal text-sm sm:inline">New chat</span>
          </Button>
        ) : null}
      </div>
    </header>
  );
}

function PoweredByReduck() {
  return (
    <a
      className="flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
      href="https://reduck.ai"
      rel="noreferrer"
      target="_blank"
    >
      Powered by
      <img alt="Reduck" className="h-4 w-auto" src="/brand/reduck-logo.png" />
    </a>
  );
}

function PendingActivity({ activity }: { readonly activity: Activity }) {
  return (
    <Message aria-live="polite" from="assistant">
      <MessageContent>
        <Trace>
          <TraceLine status="running">
            <TraceIcon>
              <BrainIcon />
            </TraceIcon>
            <TraceTitle>{activityLabel(activity)}</TraceTitle>
          </TraceLine>
        </Trace>
      </MessageContent>
    </Message>
  );
}

function activityLabel(activity: Activity): string {
  switch (activity.kind) {
    case "calling":
      return activity.names.join(", ");
    case "waiting-on-tasks":
      return `Waiting on ${activity.tasks.map((task) => task.name).join(", ")}`;
    case "compacting":
      return "Compacting the conversation";
    default:
      return "Thinking";
  }
}

type SavedChat = { readonly sessionId: string; readonly title: string };

// In the browser only: a session id is all it takes to read the chat.
const CHATS = "ag-com:chats";
function savedChats(): SavedChat[] {
  return JSON.parse(localStorage.getItem(CHATS) ?? "[]");
}
function saveChat(chat: SavedChat) {
  localStorage.setItem(CHATS, JSON.stringify([chat, ...savedChats()]));
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to cancel the response.";
}
