import type { Metadata } from "next";
import { BetaNotice, CompanyAddress, LEGAL_VERSION, LegalPage, LegalSection } from "@/app/_components/legal";

export const metadata: Metadata = {
  title: "Terms of service · ShopDuck",
  description: "The terms for the ShopDuck beta, a product of Reduck, provided by Conception AI Inc.",
};

export default function Page() {
  return (
    <LegalPage title="ShopDuck Terms of Service" version={LEGAL_VERSION}>
      <BetaNotice>
        <p>
          <strong>ShopDuck is a beta.</strong> It is a fast way to compare offers across online stores, and it is
          already useful. The site at shopduck.ai is a demo version, run on a shared account and offered on a
          best-effort basis.
        </p>
        <p>
          Keep card numbers, passwords and personal details out of it: ShopDuck does not need them and cannot buy
          anything for you.
        </p>
        <p>By using ShopDuck, you agree to these terms.</p>
      </BetaNotice>

      <LegalSection title="Who we are">
        <p>
          ShopDuck is a product of <a href="https://reduck.ai">Reduck</a>. It is run by Conception AI Inc., a Delaware
          corporation, the company that makes Reduck, which is the &ldquo;we&rdquo; in these terms. ShopDuck is hosted
          Reduck browser automation, offered through a central Reduck account that we operate.
        </p>
      </LegalSection>

      <LegalSection title="What ShopDuck does">
        <p>
          ShopDuck searches online stores and other public websites and gives you links to offers and information you can compare. You open the link, check the
          offer on the website itself, and buy there if you like it. ShopDuck does not buy anything, does not log in
          to stores, and does not use your accounts.
        </p>
        <p>There are no affiliate links, we earn no commission, and no store pays to appear in results.</p>
      </LegalSection>

      <LegalSection title="Open source">
        <p>
          ShopDuck&apos;s code is open source under the MIT license:{" "}
          <a href="https://github.com/reduck-ai/shopduck">github.com/reduck-ai/shopduck</a>. Read it, run your own copy
          with your own Reduck account, or improve it. These terms cover the hosted version at shopduck.ai, not your use
          of the code.
        </p>
      </LegalSection>

      <LegalSection title="How to use it well">
        <ul>
          <li>
            Keep sensitive information out. ShopDuck does not need payment card details, bank details, passwords, ID
            numbers or other sensitive personal information.
          </li>
          <li>Use it lawfully, and respect other people and the websites it visits.</li>
          <li>
            Please do not automate bulk access to ShopDuck, resell access to it, overload it, or try to get around its
            limits.
          </li>
        </ul>
        <p>We may block or limit use that breaks these rules or puts ShopDuck at risk.</p>
      </LegalSection>

      <LegalSection title="Results are a strong lead">
        <p>
          Results are produced with AI and automation from live pages. Prices, stock and delivery times change
          constantly, so the store&apos;s own page is the reference: take a minute to check it before you decide. A
          result is not an offer or a recommendation to buy, and any purchase is between you and the store. Nothing in
          ShopDuck is financial, legal or purchasing advice.
        </p>
      </LegalSection>

      <LegalSection title="Third-party websites">
        <p>
          We are not affiliated with the stores and websites ShopDuck queries and they do not endorse it. Their names and logos
          belong to their owners. Websites may limit automated access, and we respect that: we may stop querying a website at any time, and we do so at its request. When you open a link, that website&apos;s terms and policies apply to you.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          SHOPDUCK IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;, WITHOUT WARRANTIES OF ANY KIND, TO
          THE MAXIMUM EXTENT PERMITTED BY LAW. WE DO NOT PROMISE THAT IT WILL BE AVAILABLE, ACCURATE OR ERROR-FREE, OR
          THAT EVERY STORE WILL WORK EVERY DAY. WE KEEP IMPROVING SHOPDUCK AND MAY CHANGE, LIMIT OR PAUSE IT AS WE GO.
        </p>
      </LegalSection>

      <LegalSection title="Limit of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, CONCEPTION AI INC. IS NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL OR
          CONSEQUENTIAL DAMAGES, OR FOR LOST PROFITS, ARISING FROM YOUR USE OF SHOPDUCK. OUR TOTAL LIABILITY IS LIMITED
          TO US$100.
        </p>
        <p>
          Nothing here limits liability for fraud, intentional misconduct, gross negligence, death or personal injury,
          or any liability that cannot be limited under the law that applies to you.
        </p>
      </LegalSection>

      <LegalSection title="Your responsibility">
        <p>
          You agree to indemnify Conception AI Inc. against claims and costs that come from your misuse of ShopDuck or
          your breach of these terms, to the extent the law allows.
        </p>
      </LegalSection>

      <LegalSection title="Who can use it">
        <p>You must be at least 18 years old.</p>
      </LegalSection>

      <LegalSection title="Reduck">
        <p>
          The <a href="https://reduck.ai/terms-of-service">Reduck Terms of Service</a> apply to Reduck accounts and to
          Reduck&apos;s own services. For ShopDuck, these terms apply, and where they differ on a point specific to
          ShopDuck, these terms come first. If you run your own copy of ShopDuck with your own Reduck account, the
          Reduck Terms of Service apply to you.
        </p>
      </LegalSection>

      <LegalSection title="Changes, law and disputes">
        <p>
          We may update these terms, and the date above shows the latest version. Using ShopDuck after a change means
          you accept it. These terms are governed by the laws of the State of Delaware, and disputes go to the state or
          federal courts in Delaware. If you are a consumer in the EU or UK, you keep the protection of the mandatory
          consumer law of the country where you live and may bring a claim in your local courts. If a provision is held
          invalid, the rest stays in force.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Email <a href="mailto:contact@conception.dev">contact@conception.dev</a>.
        </p>
        <CompanyAddress />
      </LegalSection>
    </LegalPage>
  );
}
