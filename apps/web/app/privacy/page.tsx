import type { Metadata } from "next";
import { BetaNotice, CompanyAddress, LEGAL_VERSION, LegalPage, LegalSection } from "@/app/_components/legal";

export const metadata: Metadata = {
  title: "Privacy policy · ShopDuck",
  description: "How the ShopDuck demo, a product of Reduck, handles your information.",
};

export default function Page() {
  return (
    <LegalPage title="ShopDuck Privacy Policy" version={LEGAL_VERSION}>
      <BetaNotice>
        <p>
          <strong>ShopDuck is a demo, in beta.</strong> Please do not put card numbers, passwords or personal details in
          it. What you type is logged and our team can read it.
        </p>
      </BetaNotice>

      <LegalSection title="Who we are">
        <p>
          ShopDuck is a product of <a href="https://reduck.ai">Reduck</a>, run by Conception AI Inc. (&ldquo;we&rdquo;),
          the company that makes Reduck. We are responsible for the personal information described here. The{" "}
          <a href="https://reduck.ai/privacy-policy">Reduck Privacy Policy</a> also applies to ShopDuck. If the two
          differ on a point specific to ShopDuck, this policy comes first.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <ul>
          <li>
            <strong>What you type and what comes back:</strong> your questions, and the results, links and data
            returned.
          </li>
          <li>
            <strong>Technical data:</strong> for example your IP address, browser and device type, and when you used
            ShopDuck.
          </li>
          <li>
            <strong>Run records:</strong> how ShopDuck ran on stores for your request, including which scripts were
            called, what they returned, errors, and what our browsers displayed.
          </li>
          <li>
            <strong>Usage analytics:</strong> page views and clicks, collected with a cookie and browser storage. They
            do not include the text you type or the answers you receive.
          </li>
        </ul>
        <p>
          ShopDuck does not ask for your name, email or payment details and does not need them. If you type them
          anyway, they may be recorded like anything else you type. Please don&apos;t.
        </p>
        <p>ShopDuck does not log in to stores with your accounts.</p>
        <p>
          The list of your past chats is kept in your browser only. Each chat has its own link, and anyone who has that
          link can read the chat, so do not share it.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <ul>
          <li>To run ShopDuck and return results.</li>
          <li>To fix problems, keep it secure and prevent abuse.</li>
          <li>To improve ShopDuck and Reduck.</li>
          <li>To meet legal obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Who can see it">
        <ul>
          <li>
            <strong>Our team.</strong> ShopDuck is in beta, and we may read questions, results and run records to debug
            and improve it.
          </li>
          <li>
            <strong>Service providers</strong> that help us run it, such as hosting, browser infrastructure, analytics
            and AI model providers. They get what they need to do their job and are bound by confidentiality and
            security obligations.
          </li>
          <li>
            <strong>Stores.</strong> To search a store, our browsers visit it and send what is needed, such as the
            search terms you typed. When you open a store&apos;s link afterwards, you visit that store directly and its
            own policy applies.
          </li>
          <li>
            <strong>Others</strong> where the law requires it, to protect our rights and safety, or in a business
            transfer.
          </li>
        </ul>
        <p>We do not sell personal information. ShopDuck has no affiliate links and earns no commission.</p>
      </LegalSection>

      <LegalSection title="AI">
        <p>
          ShopDuck uses AI models from third-party providers to understand your questions and prepare answers. Your
          questions, the data collected from stores and the results are sent to them for that purpose.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep it as long as needed for the purposes above, and we may delete it earlier. The retention and deletion
          rules of the <a href="https://reduck.ai/privacy-policy">Reduck Privacy Policy</a> apply.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on where you live, you may have the right to access, correct, delete, restrict or port your
          information, to object to some uses, and to complain to a data protection authority. Write to us at the
          address below. ShopDuck has no accounts, so we may ask you for details, such as the approximate time you used
          it, to find your records.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We use reasonable technical and organizational measures. No system is fully secure, and ShopDuck is a beta
          demo, so we cannot guarantee the security of what you send.
        </p>
      </LegalSection>

      <LegalSection title="Age and location">
        <p>
          ShopDuck is for people 18 and over. We are based in the United States, and information may be processed there
          and in other countries.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>We may update this policy, and the date above shows the latest version.</p>
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
