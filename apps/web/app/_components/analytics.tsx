"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * PostHog, in Reduck's project, its events marked `app: ag-com`. ag-com.ai shares no cookie with
 * reduck.ai, so a visitor here and the same person there are two people to PostHog. Off when no
 * key is set, as in local dev.
 */
export function Analytics() {
  useEffect(() => {
    if (!KEY || posthog.__loaded) return;
    posthog.init(KEY, {
      api_host: "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      defaults: "2026-01-30",
      persistence: "localStorage+cookie",
      disable_surveys: true,
      // The page shows what each visitor types to the agent and what the agent answers: no
      // recording of it, and clicks are captured without the text they hold.
      disable_session_recording: true,
      mask_all_text: true,
    });
    posthog.register({ app: "ag-com" });
  }, []);
  return null;
}

/** An event without the message itself: what a visitor types stays out of PostHog. */
export function captureMessageSent(props: { readonly withFiles: boolean; readonly steer: boolean }) {
  if (posthog.__loaded) posthog.capture("ag_com_message_sent", props);
}
