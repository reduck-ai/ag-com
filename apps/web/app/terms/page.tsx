import type { Metadata } from "next";
import { BetaNotice, CompanyAddress, LEGAL_VERSION, LegalPage, LegalSection } from "@/app/_components/legal";

export const metadata: Metadata = {
  title: "Terms of service · ShopDuck",
  description: "The terms for the ShopDuck demo, a product of Reduck, provided by Conception AI Inc.",
};

export default function Page() {
  return (
    <LegalPage title="ShopDuck Terms of Service" version={LEGAL_VERSION}>
      <BetaNotice>
        <p>
          <strong>ShopDuck is a small demo, in beta.</strong> It is a showcase, offered on a best-effort basis. Please
          do not expect more than that for now.
        </p>
        <p>Never enter a card number, a password or personal details. ShopDuck cannot buy anything for you.</p>
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
          ShopDuck searches online stores and gives you links to offers you can compare. It does not buy anything, does
          not log in to stores, and does not use your accounts.
        </p>
        <p>There are no affiliate links, we earn no commission, and no store pays to appear in results.</p>
      </LegalSection>

      <LegalSection title="What not to do">
        <ul>
          <li>
            Do not enter payment card details, bank details, passwords, ID numbers or other sensitive personal
            information.
          </li>
          <li>Do not use ShopDuck to break the law or harm others, or to interfere with a store&apos;s website.</li>
          <li>Do not script, scrape or resell access to ShopDuck, overload it, or try to get around its limits.</li>
        </ul>
        <p>We may block or limit any use that we think breaks these rules.</p>
      </LegalSection>

      <LegalSection title="Results are information only">
        <p>
          Results are produced with AI and automation. They can be wrong, incomplete, out of date, or missing. A result
          is not an offer or a recommendation to buy. The store&apos;s own page is the only reference, so please check
          it yourself before you decide. Any purchase is between you and the store.
        </p>
      </LegalSection>

      <LegalSection title="Third-party stores">
        <p>
          We are not affiliated with the stores ShopDuck queries and they do not endorse it. Their names and logos
          belong to their owners. Stores may limit or refuse automated access, and we may stop querying a store at any
          time, including at its request. When you open a store&apos;s link, that store&apos;s terms and policies apply
          to you.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          SHOPDUCK IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;, WITHOUT WARRANTIES OF ANY KIND, TO
          THE MAXIMUM EXTENT PERMITTED BY LAW. WE DO NOT PROMISE THAT IT WILL BE AVAILABLE, ACCURATE OR ERROR-FREE, OR
          THAT ANY STORE WILL WORK. WE MAY CHANGE OR STOP SHOPDUCK AT ANY TIME.
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
          Email <strong>contact@conception.dev</strong>.
        </p>
        <CompanyAddress />
      </LegalSection>
    </LegalPage>
  );
}
