import type { Metadata } from "next";
import { BetaNotice, CompanyAddress, LEGAL_VERSION, LegalPage, LegalSection } from "@/app/_components/legal";

export const metadata: Metadata = {
  title: "Privacy policy · ShopDuck",
  description: "How the ShopDuck beta, a product of Reduck, handles your information.",
};

export default function Page() {
  return (
    <LegalPage title="ShopDuck Privacy Policy" version={LEGAL_VERSION}>
      <BetaNotice>
        <p>
          <strong>ShopDuck is a beta: no account, no name, no email, you just ask.</strong> We log what you ask and what
          comes back to make it work and make it better, and our team can read it, so please keep card numbers,
          passwords and personal details out of your questions. We do not sell your information, and the code is open
          on <a href="https://github.com/reduck-ai/shopduck">GitHub</a>.
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
            <strong>What you type and what comes back:</strong> your questions, any files you add to a message, and the results, links and data returned.
          </li>
          <li>
            <strong>Technical data:</strong> for example your IP address, browser and device type, and when you used
            ShopDuck.
          </li>
          <li>
            <strong>Run records:</strong> how ShopDuck ran on websites for your request, including which scripts were
            called, what they returned, errors, and what our browsers displayed.
          </li>
          <li>
            <strong>Usage analytics:</strong> page views and clicks, collected without cookies and without browser storage. They do not include the text you type. A click on a link in an answer may record the address of the page it opens.
          </li>
          <li>
            <strong>One cookie, set by ShopDuck:</strong> a random id, kept for about 13 months, that tells us which chats come from the same browser. It holds nothing else.
          </li>
        </ul>
        <p>
          ShopDuck does not need your name, email or payment details and does not ask for them. If you type them
          anyway, they may be recorded like anything else you type, so it is best to leave them out.
        </p>
        <p>ShopDuck does not log in to websites with your accounts.</p>
        <p>
          The list of your past chats is kept in your browser only. Each chat has its own link, and anyone who has that link can read and continue the chat, so do not share it.
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
            <strong>Our team.</strong> During the beta, we may read questions, results and run records to debug
            and improve it.
          </li>
          <li>
            <strong>Service providers</strong> that help us run it, such as hosting, browser infrastructure, analytics
            and AI model providers. They get what they need to do their job and are bound by confidentiality and
            security obligations.
          </li>
          <li>
            <strong>Websites we query.</strong> To search a store or another website, our browsers visit it and send what is needed, such as the search terms you typed. When you open a link afterwards, you visit that website directly and its own policy applies.
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
          ShopDuck uses AI models from third-party providers to understand your questions and prepare answers. Your questions, the files you add, the data collected from websites and the results are sent to them for that purpose.
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
          address below. ShopDuck has no accounts, so we may need a few details from you, such as the approximate time you used
          it, to find your records.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We protect what we hold with reasonable technical and organizational measures. No system is perfectly
          secure, and ShopDuck is a beta, which is one more reason to keep sensitive details out of your questions.
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
          Email <a href="mailto:contact@conception.dev">contact@conception.dev</a>.
        </p>
        <CompanyAddress />
      </LegalSection>
    </LegalPage>
  );
}
