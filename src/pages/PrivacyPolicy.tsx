import PolicyLayout, { B, CONTACT_EMAIL, P, UL, type PolicySection } from "../components/PolicyLayout";
import { useSEO } from "../utils/seo";

const sections: PolicySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <P>
        This policy explains what personal information Vedyara collects when you use vedyara.in,
        why we collect it, and the choices you have. By using the website you agree to the
        practices described here.
      </P>
    ),
  },
  {
    id: "information",
    title: "Information we collect",
    content: (
      <>
        <P><B>Information you give us</B></P>
        <UL
          items={[
            "Name, email address and phone number when you sign in, place an order or contact us.",
            "Shipping address for delivering your orders.",
            "Business details you share in a bulk order enquiry.",
            "Messages you send us through forms, email or WhatsApp.",
          ]}
        />
        <P><B>Information collected automatically</B></P>
        <UL
          items={[
            "Device and browser type, pages visited and time spent, collected through analytics tools such as Microsoft Clarity.",
            "Cart, wishlist and sign-in information stored in your browser so the site works as expected.",
          ]}
        />
        <P>
          We do not store your card, UPI or net-banking details. Online payments are processed
          securely by Razorpay under its own privacy policy.
        </P>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    content: (
      <UL
        items={[
          "To process, ship and support your orders, including order confirmation and delivery updates.",
          "To verify your email with a one-time password when you sign in.",
          "To answer your questions, bulk enquiries and return requests.",
          "To understand how the site is used and improve it.",
          "To prevent fraud and meet legal and tax obligations.",
          "To send offers or news, only if you have agreed. You can unsubscribe at any time.",
        ]}
      />
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <P>We never sell your personal information. We share it only with:</P>
        <UL
          items={[
            <><B>Courier partners</B>, who need your name, phone and address to deliver.</>,
            <><B>Payment gateway</B> (Razorpay), to process online payments.</>,
            <><B>Service providers</B> for hosting, email delivery and analytics, who process data on our behalf.</>,
            <><B>Authorities</B>, when required by law.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    content: (
      <P>
        We use cookies and your browser's local storage to keep you signed in, remember your cart
        and wishlist, and measure site usage. You can clear or block them in your browser
        settings, but some features may then stop working.
      </P>
    ),
  },
  {
    id: "security",
    title: "Data security and retention",
    content: (
      <P>
        We use HTTPS, access controls and trusted providers to protect your information. No system
        is completely secure, but we work to keep your data safe. We keep order records as long as
        tax and accounting laws require, and other data only as long as it is needed for the
        purposes above.
      </P>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    content: (
      <>
        <P>Under applicable Indian law, including the Digital Personal Data Protection Act, 2023, you can ask us to:</P>
        <UL
          items={[
            "Show you the personal data we hold about you.",
            "Correct or update inaccurate information.",
            "Delete your data, unless we must keep it by law.",
            "Withdraw consent for marketing messages.",
          ]}
        />
        <P>
          Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-medium" style={{ color: "#2D4A1E" }}>
            {CONTACT_EMAIL}
          </a>{" "}
          and we will respond within 30 days.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <P>
        We may update this policy from time to time. The latest version will always be on this
        page with the date it was last updated.
      </P>
    ),
  },
];

export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy | Vedyara",
    description: "How Vedyara collects, uses and protects your personal information.",
    canonical: "https://vedyara.in/privacy-policy",
  });

  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Your trust matters to us. Here is exactly what we collect, why, and how you stay in control."
      updated="October 2026"
      sections={sections}
    />
  );
}
