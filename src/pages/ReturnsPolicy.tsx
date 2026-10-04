import { Link } from "react-router-dom";
import PolicyLayout, { B, Callout, CONTACT_EMAIL, P, UL, type PolicySection } from "../components/PolicyLayout";
import { useSEO } from "../utils/seo";

const sections: PolicySection[] = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <>
        <P>
          Every Vedyara product is packed by hand and sealed for freshness. Because we sell food,
          returns follow food-safety rules: we can take back products that are sealed and unused,
          and we will always make things right if an order arrives damaged, tampered with or wrong.
        </P>
        <Callout>
          Ordered on <B>Amazon</B> or <B>Meesho</B>? Please raise the request through that
          marketplace's return portal. Their policy applies to those orders and it is the fastest
          way to get it resolved.
        </Callout>
      </>
    ),
  },
  {
    id: "cancellations",
    title: "Cancelling an order",
    content: (
      <>
        <UL
          items={[
            <><B>Before dispatch:</B> you can cancel at any time free of charge. Write to us with your order number and we will cancel it.</>,
            <><B>After dispatch:</B> the order can no longer be cancelled. You can refuse the parcel at delivery, or request a return once it arrives if it qualifies.</>,
            <><B>Cash on Delivery:</B> repeatedly refusing COD parcels may lead to COD being disabled for your account.</>,
          ]}
        />
        <P>
          We may cancel an order ourselves if a product goes out of stock, the address cannot be
          serviced, or the payment looks suspicious. If you have already paid, you get a full refund.
        </P>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "What can be returned",
    content: (
      <>
        <P>A return or replacement is accepted when:</P>
        <UL
          items={[
            <>The product arrived <B>damaged, leaking, tampered with or expired</B>.</>,
            <>You received the <B>wrong product</B> or the wrong quantity.</>,
            <>The product is <B>sealed and unused</B>, and you ask within <B>7 days</B> of delivery.</>,
          ]}
        />
        <P>We cannot accept returns for:</P>
        <UL
          items={[
            "Opened or partly used products, for hygiene and food-safety reasons.",
            "Natural changes such as honey crystallising or slight colour and aroma differences between batches. These are signs of a raw, unprocessed product, not defects.",
            "Products damaged after delivery through improper storage.",
          ]}
        />
        <Callout>
          Not happy with the quality of an opened product? Send us a photo or video within{" "}
          <B>48 hours</B> of delivery and we will review it case by case.
        </Callout>
      </>
    ),
  },
  {
    id: "how-to",
    title: "How to request a return",
    content: (
      <UL
        items={[
          <>Email <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-medium" style={{ color: "#2D4A1E" }}>{CONTACT_EMAIL}</a> or WhatsApp us with your <B>order number</B>.</>,
          <>Attach clear <B>photos or an unboxing video</B> showing the product, the seal and the outer box.</>,
          "We confirm whether the return is approved, usually within 1 to 2 working days.",
          "For approved returns we arrange a pickup where available, or tell you how to send the item back.",
        ]}
      />
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    content: (
      <>
        <UL
          items={[
            <><B>Prepaid orders:</B> refunded to the original payment method within 5 to 7 working days after we approve the return or receive the item.</>,
            <><B>Cash on Delivery orders:</B> refunded by bank transfer or UPI. We will ask for your details by email.</>,
            <><B>Damaged or wrong items:</B> you can choose a free replacement instead of a refund.</>,
          ]}
        />
        <P>
          Your bank may take a few extra days to show the credit. If it has been more than 10
          working days, contact us and we will chase it.
        </P>
      </>
    ),
  },
  {
    id: "shipping-costs",
    title: "Shipping costs",
    content: (
      <P>
        If the return is due to our mistake (damaged, wrong or expired product), we cover all
        shipping. For other eligible returns of sealed products, the original shipping charge is
        not refundable. You can check where your order is on the{" "}
        <Link to="/track-order" className="underline font-medium" style={{ color: "#2D4A1E" }}>
          Track Order
        </Link>{" "}
        page.
      </P>
    ),
  },
];

export default function ReturnsPolicy() {
  useSEO({
    title: "Returns & Cancellations | Vedyara",
    description:
      "Vedyara returns, cancellations and refunds policy. Free replacements for damaged or wrong items, 7-day returns on sealed products.",
    canonical: "https://vedyara.in/returns-cancellations",
  });

  return (
    <PolicyLayout
      eyebrow="Help & Support"
      title="Returns & Cancellations"
      intro="Simple, fair rules for cancelling an order, returning a product and getting your money back."
      updated="October 2026"
      sections={sections}
    />
  );
}
