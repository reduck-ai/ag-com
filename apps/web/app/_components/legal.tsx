import type { ReactNode } from "react";
import "./legal.css";

/** Same page model as reduck.ai's terms and privacy pages: centered title, version line, numbered sections. */
export function LegalPage({
  title,
  version,
  children,
}: {
  readonly title: string;
  readonly version: string;
  readonly children: ReactNode;
}) {
  return (
    <main className="legal">
      <div className="legal-content">
        <h1>{title}</h1>
        <p className="legal-version">Version effective {version}</p>
        {children}
        <p className="legal-copyright">
          ShopDuck is a product of <a href="https://reduck.ai">Reduck</a>, by Conception AI Inc.
        </p>
        <nav aria-label="Legal pages" className="legal-nav">
          <a href="/">ShopDuck</a>
          <a href="/terms">Terms of service</a>
          <a href="/privacy">Privacy policy</a>
        </nav>
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/** The demo notice at the top of both pages. */
export function BetaNotice({ children }: { readonly children: ReactNode }) {
  return <div className="legal-notice">{children}</div>;
}

export const LEGAL_VERSION = "November 25, 2026 (v0.1)";

export function CompanyAddress() {
  return (
    <address>
      Conception AI Inc.
      <br />
      2261 Market Street STE 85701
      <br />
      San Francisco, CA 94114, United States
    </address>
  );
}
