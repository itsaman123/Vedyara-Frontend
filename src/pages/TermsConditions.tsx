import { Link } from "react-router-dom";
import PolicyLayout, { B, CONTACT_EMAIL, P, UL, type PolicySection } from "../components/PolicyLayout";
import { useSEO } from "../utils/seo";

const linkStyle = { color: "#2D4A1E" };

const sections: PolicySection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    content: (
      <P>
        These terms apply to your use of vedyara.in and any purchase you make from Vedyara. By
        using the website or placing an order, you agree to them. If you do not agree, please do
        not use the website.
      </P>
    ),
  },
  {
    id: "products",
    title: "Products and descriptions",
    content: (
      <>
        <P>
          Our honey, spices and other products are natural and made in small batches. Colour,
          texture, aroma and taste can vary slightly from batch to batch, and honey may
          crystallise naturally. Product photos are for illustration and the packaging you receive
          may differ slightly.
        </P>
        <P>
          Nutritional and health information on the site is for general guidance only. It is not
          medical advice. Please consult a doctor if you have allergies, diabetes or other health
          conditions. Honey should not be given to infants under 12 months.
        </P>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing and payment",
    content: (
      <UL
        items={[
          "All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise.",
          "Shipping charges, if any, are shown at checkout before you pay.",
          "We may change prices at any time, but the price shown when you place an order is the price you pay.",
          "If a product is listed at a clearly wrong price because of an error, we may cancel the order and refund you in full.",
          "Online payments are processed by Razorpay. Cash on Delivery may be available for selected pincodes.",
        ]}
      />
    ),
  },
  {
    id: "orders",
    title: "Orders and acceptance",
    content: (
      <P>
        An order is confirmed once you receive an order confirmation from us. We may refuse or
        cancel an order because of stock availability, delivery limits, suspected fraud or pricing
        errors. If this happens after payment, we refund the full amount.
      </P>
    ),
  },
  {
    id: "shipping",
    title: "Shipping and delivery",
    content: (
      <>
        <UL
          items={[
            "We ship across India through trusted courier partners.",
            "Delivery times shown are estimates and may change because of location, weather, holidays or courier delays.",
            "Please check your parcel when it arrives and report any damage within 48 hours.",
          ]}
        />
        <P>
          You can follow your order on the{" "}
          <Link to="/track-order" className="underline font-medium" style={linkStyle}>Track Order</Link>{" "}
          page.
        </P>
      </>
    ),
  },
  {
    id: "returns",
    title: "Returns, cancellations and refunds",
    content: (
      <P>
        Cancellations, returns and refunds follow our{" "}
        <Link to="/returns-cancellations" className="underline font-medium" style={linkStyle}>
          Returns &amp; Cancellations policy
        </Link>
        . Orders placed on Amazon or Meesho follow that marketplace's policy.
      </P>
    ),
  },
  {
    id: "bulk",
    title: "Bulk and business orders",
    content: (
      <P>
        Prices, packaging, delivery timelines and payment terms for{" "}
        <Link to="/bulk-order" className="underline font-medium" style={linkStyle}>bulk orders</Link>{" "}
        are agreed separately in writing with each customer. Those agreed terms take priority over
        these general terms where they differ.
      </P>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    content: (
      <UL
        items={[
          "Give accurate information when signing in or ordering.",
          "Keep access to your email account secure, as we use it to verify sign-ins.",
          "Do not misuse the site, attempt unauthorised access, or place fake orders.",
        ]}
      />
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    content: (
      <P>
        The Vedyara name, logo, product photos, designs and text on this site belong to Vedyara.
        You may not copy, reproduce or use them for commercial purposes without our written
        permission.
      </P>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <P>
        To the extent allowed by law, Vedyara is not liable for indirect or consequential losses
        arising from use of the website or products. Our total liability for any order is limited
        to the amount you paid for that order.
      </P>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    content: (
      <P>
        These terms are governed by the laws of India. Any dispute will first be addressed through
        good-faith discussion. If it cannot be resolved, it will be subject to the jurisdiction of
        the courts where Vedyara is registered.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Changes and contact",
    content: (
      <P>
        We may update these terms from time to time, and the latest version will always be on this
        page. For questions, write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-medium" style={linkStyle}>
          {CONTACT_EMAIL}
        </a>
        . <B>Thank you for choosing Vedyara.</B>
      </P>
    ),
  },
];

export default function TermsConditions() {
  useSEO({
    title: "Terms & Conditions | Vedyara",
    description: "Terms and conditions for using vedyara.in and buying Vedyara products.",
    canonical: "https://vedyara.in/terms-and-conditions",
  });

  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="The ground rules for using our website and ordering from Vedyara, written in plain language."
      updated="October 2026"
      sections={sections}
    />
  );
}
