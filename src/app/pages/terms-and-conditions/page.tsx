import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | PAPAS Cricket",
  description: "Terms and conditions for shopping at PAPAS Willow Cricket Store.",
};

const SECTIONS = [
  {
    heading: "1. About Us",
    body: `PAPAS Willow Pty Ltd ("PAPAS", "we", "us", "our") operates the papaswillow.com.au website and mobile applications. We are registered in Australia. By accessing our site or placing an order, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.`,
  },
  {
    heading: "2. Account Registration",
    body: `To place an order you may register an account. You must ensure that all information provided during registration is accurate, complete, and kept up to date. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. We reserve the right to suspend or terminate accounts where information is found to be false, inaccurate, or incomplete. If you are under the age of 18, you must obtain parental or guardian consent before registering.`,
  },
  {
    heading: "3. Intellectual Property",
    body: `All content on this website — including text, graphics, logos, product images, button icons, data compilations, and software — is the property of PAPAS Willow Pty Ltd or its content suppliers and is protected by Australian and international copyright and intellectual property laws. You may electronically copy or print portions of this site solely for the purpose of placing an order or using our services for personal, non-commercial purposes. Any other use of materials on this site without our prior written permission is strictly prohibited.`,
  },
  {
    heading: "4. Product Information & Pricing",
    body: `We take care to ensure product descriptions, images, and prices are accurate. However, we do not warrant that product descriptions or other content on this site is complete, reliable, current, or error-free. Prices are displayed in Australian Dollars (AUD) and include applicable GST. We reserve the right to correct pricing errors. If a product is listed at an incorrect price, we will contact you before dispatching to confirm whether you wish to proceed at the correct price.`,
  },
  {
    heading: "5. Orders & Contract Formation",
    body: `Placing an order on our website constitutes an offer to purchase. A binding contract is not formed until we accept your order by dispatching the goods and sending you a dispatch confirmation email. We reserve the right to refuse or cancel any order for reasons including product unavailability, pricing errors, or suspected fraudulent activity. Pre-order items require full payment upfront to reserve stock. Once personalised or custom items have entered production they cannot be cancelled or amended.`,
  },
  {
    heading: "6. Payment",
    body: `We accept major credit and debit cards, PayPal, and PAPAS Gift Cards. Payment is authorised at the time of order placement and captured when your goods are dispatched. All transactions are encrypted and processed securely. We do not store your full card details on our servers. If your payment is declined we will notify you and your order will not be processed.`,
  },
  {
    heading: "7. Delivery",
    body: `We offer standard and express delivery across Australia and selected international destinations. Delivery timeframes are estimates and cannot be guaranteed. Free standard delivery applies to orders over $100 AUD within Australia. We are not responsible for delays caused by circumstances outside our control, including carrier delays, customs processing, or natural events. Risk of loss or damage passes to you upon delivery.`,
  },
  {
    heading: "8. Returns & Refunds",
    body: `We want you to be completely satisfied with your purchase. You may return most items within 30 days of delivery provided they are unused, in original condition, and include all original packaging and tags. Personalised or custom items cannot be returned unless they are faulty or not as described. To initiate a return, please log into your account and submit a return request, or contact us at support@papaswillow.com.au. Refunds are processed to the original payment method within 5–10 business days of us receiving the returned item. Return postage costs are the responsibility of the customer unless the item is faulty or we made an error.`,
  },
  {
    heading: "9. Gift Cards",
    body: `PAPAS Gift Cards are redeemable for purchases on papaswillow.com.au only. Gift Cards cannot be exchanged for cash, used to purchase other Gift Cards, or transferred. Lost or stolen Gift Cards cannot be replaced. Gift Cards expire 3 years from the date of purchase. Remaining balances are non-refundable.`,
  },
  {
    heading: "10. User-Generated Content",
    body: `By submitting reviews, comments, or other content to our website you grant PAPAS Willow a non-exclusive, royalty-free, perpetual, worldwide licence to use, reproduce, modify, and display that content in connection with our business. You are responsible for ensuring that any content you submit does not infringe third-party rights, is not defamatory, and complies with applicable laws. We reserve the right to remove any user-generated content at our discretion.`,
  },
  {
    heading: "11. Limitation of Liability",
    body: `To the maximum extent permitted by Australian Consumer Law, PAPAS Willow is not liable for any indirect, incidental, special, or consequential loss or damage arising from your use of this website or from products purchased through it. Nothing in these Terms excludes, restricts, or modifies any consumer guarantee, right, or remedy that cannot be excluded under the Australian Consumer Law. Where we are liable, our liability is limited to the price paid for the relevant product or service.`,
  },
  {
    heading: "12. Fraud Prevention",
    body: `We reserve the right to request additional verification for orders that we consider at risk of fraud. Fraudulent activity may be reported to the relevant Australian authorities. Orders suspected of being placed using stolen payment credentials will be cancelled and referred to law enforcement.`,
  },
  {
    heading: "13. Changes to These Terms",
    body: `We may update these Terms and Conditions from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our website after changes are posted constitutes your acceptance of the revised Terms.`,
  },
  {
    heading: "14. Governing Law",
    body: `These Terms and Conditions are governed by the laws of the State of New South Wales, Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of New South Wales.`,
  },
  {
    heading: "15. Contact Us",
    body: `If you have any questions about these Terms and Conditions, please contact us:\n\nEmail: support@papaswillow.com.au\nWebsite: papaswillow.com.au`,
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Header */}
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39]">Home</Link>
          <span>/</span>
          <span className="text-white">Terms &amp; Conditions</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <h1 className="text-white text-[28px] md:text-[36px] font-semibold uppercase tracking-[0.5px]">Terms &amp; Conditions</h1>
          <p className="text-[#888] text-[13px] mt-2">Last updated: May 2025</p>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-4 md:px-10 py-10">
        {/* Intro */}
        <div className="bg-[#fff8f0] border border-[#f69a39]/30 rounded-[4px] px-5 py-4 mb-8 text-[13px] text-[#666]">
          Please read these Terms &amp; Conditions carefully before placing an order or using any part of the PAPAS Willow website. By using our site you agree to be legally bound by these terms.
        </div>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.heading} className="bg-white rounded-[4px] border border-[#e8e8e8] px-6 py-5">
              <h2 className="text-[15px] font-semibold text-[#1e1e21] mb-3">{s.heading}</h2>
              <p className="text-[13px] text-[#555] leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-[12px] text-[#aaa]">
          Questions? Email us at{" "}
          <a href="mailto:support@papaswillow.com.au" className="text-[#f69a39] hover:underline">
            support@papaswillow.com.au
          </a>
        </div>
      </div>
    </div>
  );
}
