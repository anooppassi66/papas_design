"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface FAQ { q: string; a: string }

const TOPIC_DATA: Record<string, {
  title: string;
  description: string;
  icon: React.ReactNode;
  faqs: FAQ[];
}> = {
  delivery: {
    title: "Delivery & Shipping",
    description: "Everything you need to know about how and when your order will arrive.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    faqs: [
      {
        q: "How long does standard delivery take?",
        a: "Standard delivery typically takes 3–5 working days from the date your order is dispatched. You will receive a dispatch confirmation email with tracking details once your order has left our warehouse.",
      },
      {
        q: "Do you offer express or next-day delivery?",
        a: "Yes! We offer express delivery (1–2 working days) and next-day delivery (order before 2 PM Monday–Thursday). These options are available at checkout. Please note next-day delivery is not available on weekends or bank holidays.",
      },
      {
        q: "How much does delivery cost?",
        a: "Standard delivery costs $4.99. Express delivery is $7.99. Next-day delivery is $12.99. We offer FREE standard delivery on all orders over $75.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to over 40 countries worldwide. International delivery times vary by destination — typically 5–14 working days. International shipping costs are calculated at checkout based on your location and order weight.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you'll receive a shipping confirmation email containing your tracking number and a link to the carrier's tracking page. You can also log into your account and view tracking from the 'My Orders' section.",
      },
      {
        q: "What happens if I'm not home for delivery?",
        a: "If you're not home, our carrier will typically attempt delivery up to 3 times, leave the parcel with a neighbour, or leave it in a safe place. A card will be left with instructions on how to rearrange delivery or collect from your local depot.",
      },
      {
        q: "Can I change my delivery address after ordering?",
        a: "We can only change the delivery address if your order has not yet been dispatched. Please contact us immediately via live chat or email. Once dispatched, we are unable to redirect parcels.",
      },
      {
        q: "My order hasn't arrived — what should I do?",
        a: "If your order hasn't arrived within the estimated timeframe, first check your tracking link from the dispatch email. If the tracking shows no movement for more than 3 working days, please contact our support team and we'll investigate with the carrier.",
      },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    description: "Our straightforward returns policy — hassle-free and customer first.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 6.36-2.64"/><path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-6.36 2.64"/><polyline points="21 3 21 12 12 12"/>
      </svg>
    ),
    faqs: [
      {
        q: "What is your returns policy?",
        a: "We offer a 30-day hassle-free returns policy. Items must be returned in their original, unused condition with all tags attached and original packaging intact. Personalised or customised items cannot be returned unless faulty.",
      },
      {
        q: "How do I return an item?",
        a: "Log into your account, go to 'My Orders', select the order and click 'Return Item'. Choose the reason for return, then print your prepaid returns label. Drop the parcel at any post office or courier drop-off point. You'll receive confirmation when we receive it.",
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive and inspect your return (usually within 2 working days), your refund will be processed within 3–5 working days back to your original payment method. You'll receive an email confirmation when the refund is issued.",
      },
      {
        q: "Can I exchange an item for a different size?",
        a: "Yes! For size exchanges, simply return the original item and place a new order for the correct size. This is the fastest way to ensure you get the size you need. The refund for the returned item will be issued once received.",
      },
      {
        q: "What if my item is faulty or damaged?",
        a: "We're sorry to hear that. If your item arrives damaged or faulty, please contact us within 48 hours of receipt with photos of the fault. We'll arrange a free return and send a replacement or issue a full refund — whichever you prefer.",
      },
      {
        q: "Do I have to pay for returns?",
        a: "Returns are FREE for orders over $75 or if the item is faulty. For orders under $75, a $3.99 returns label fee is deducted from your refund. We recommend using our prepaid label to ensure your return is tracked.",
      },
      {
        q: "Can I return sale or clearance items?",
        a: "Yes, sale items can be returned within 14 days (rather than the standard 30 days). Items marked 'Final Sale' cannot be returned unless they arrive faulty.",
      },
    ],
  },
  orders: {
    title: "Orders & Tracking",
    description: "Manage, track, amend or cancel your orders.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
      </svg>
    ),
    faqs: [
      {
        q: "How do I track my order?",
        a: "You'll receive a dispatch confirmation email with your tracking number and a direct link to track your parcel. Alternatively, log into your account and visit 'My Orders' — tracking information appears once your order is dispatched.",
      },
      {
        q: "Can I amend my order after placing it?",
        a: "We process orders quickly, but if you need to make a change, contact us immediately via live chat. We can amend delivery addresses, sizes, or quantities if the order hasn't been dispatched. Once dispatched, changes are not possible.",
      },
      {
        q: "How do I cancel my order?",
        a: "To cancel, contact us as soon as possible via live chat or email. If your order hasn't been dispatched, we'll cancel it and issue a full refund. If it has already been dispatched, you'll need to return the item when it arrives.",
      },
      {
        q: "I received the wrong item — what do I do?",
        a: "We sincerely apologise! Please contact our team within 48 hours with your order number and a photo of the incorrect item. We'll arrange collection at no cost and send the correct item via express delivery.",
      },
      {
        q: "Why is part of my order missing?",
        a: "If items are missing from your order, it's possible they were dispatched separately (especially from different brands). Check your dispatch email for multiple tracking numbers. If an item is still missing after 5 working days, please contact us.",
      },
      {
        q: "Where can I find my order confirmation?",
        a: "Your order confirmation is sent to the email address used at checkout immediately after placing your order. Check your spam/junk folder if you can't find it. You can also view all orders in the 'My Orders' section of your account.",
      },
      {
        q: "What does my order status mean?",
        a: "'Processing' — we've received your order and are preparing it. 'Dispatched' — your order is on its way with tracking available. 'Delivered' — your carrier has confirmed delivery. 'Returned' — your return has been received.",
      },
    ],
  },
  payments: {
    title: "Payment & Billing",
    description: "Payment methods, security, invoices and billing queries.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and PAPAS Gift Cards. All payments are processed securely via our encrypted checkout.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and do not store your card details on our servers. All payments are processed through PCI-DSS compliant payment processors. Look for the padlock icon in your browser's address bar.",
      },
      {
        q: "When will my card be charged?",
        a: "Your card is charged at the time of placing your order. If an item is out of stock and we cannot fulfil part of your order, a full refund for that item will be issued within 3–5 working days.",
      },
      {
        q: "Can I use multiple payment methods?",
        a: "You can combine a PAPAS Gift Card with any other payment method. Unfortunately, we cannot split a payment between two credit/debit cards.",
      },
      {
        q: "How do I get a VAT receipt or invoice?",
        a: "Your order confirmation email includes a full itemised receipt. To download a VAT invoice, log into your account, go to 'My Orders', select the order and click 'Download Invoice'.",
      },
      {
        q: "My payment was declined — what should I do?",
        a: "First, check your card details are entered correctly and that you have sufficient funds. If the issue persists, contact your bank as they may be blocking the transaction. You can also try an alternative payment method.",
      },
      {
        q: "Do you offer buy now, pay later?",
        a: "We are actively working on integrating Klarna and other BNPL options. In the meantime, PayPal Pay Later may be available depending on your PayPal account eligibility.",
      },
    ],
  },
  account: {
    title: "My Account",
    description: "Manage your PAPAS account settings, addresses and preferences.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Account' in the top navigation and select 'Create Account'. Enter your name, email address and a password. You'll receive a verification email — click the link inside to activate your account.",
      },
      {
        q: "I've forgotten my password — how do I reset it?",
        a: "On the login page, click 'Forgot Password'. Enter your email address and we'll send you a password reset link. The link is valid for 24 hours. If you don't receive it, check your spam folder.",
      },
      {
        q: "How do I update my email address?",
        a: "Log into your account, go to 'Account Settings' and update your email under the 'Personal Details' section. You'll need to verify the new email address before the change takes effect.",
      },
      {
        q: "How do I add or change a delivery address?",
        a: "Log into your account and go to 'My Addresses'. You can add multiple addresses and set a default delivery address. Addresses can be edited or deleted at any time.",
      },
      {
        q: "Can I see my full order history?",
        a: "Yes. Log into your account and go to 'My Orders'. All past orders are listed with their status, tracking information and the option to initiate a return.",
      },
      {
        q: "How do I delete my account?",
        a: "To delete your account and all associated data, please contact our support team via email at support@papaswillow.com with the subject line 'Account Deletion Request'. We'll process this within 30 days in accordance with our privacy policy.",
      },
      {
        q: "How do I manage my email preferences?",
        a: "Go to 'Account Settings' and click 'Email Preferences'. You can opt out of marketing emails while still receiving order confirmations and important account notifications.",
      },
    ],
  },
  products: {
    title: "Products & Sizing",
    description: "Size guides, product advice and cricket equipment information.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    faqs: [
      {
        q: "What bat size should I buy?",
        a: "Bat size depends on the player's height. Size 6 (up to 4'9\"), Harrow (4'9\"–5'2\"), Short Handle (5'2\"–6'2\"), Long Handle (over 6'2\"). For juniors, measure from the ground to just below the hip while wearing cricket shoes.",
      },
      {
        q: "What is the difference between English Willow and Kashmir Willow?",
        a: "English Willow is lighter, has superior performance, better pick-up and is used by professional and serious club cricketers. Kashmir Willow is harder, heavier and more durable — ideal for beginners and juniors as it's more affordable and withstands hard use.",
      },
      {
        q: "Does my new bat need knocking in?",
        a: "Yes — all new English Willow bats require knocking in before use in match play. We recommend knocking in for a minimum of 4–6 hours with a bat mallet, starting gently. Apply linseed oil before knocking in. Kashmir Willow bats do not require the same level of knocking in.",
      },
      {
        q: "How do I care for my cricket bat?",
        a: "Apply a thin coat of raw linseed oil to the face and edges every 6–8 weeks during the season. Never oil the splice or handle. Store your bat in a cool, dry place — avoid extreme temperatures. Use a bat cover when not in use.",
      },
      {
        q: "Can I get a product that's not on the website?",
        a: "We are constantly expanding our range. If you're looking for a specific product or brand, contact us and we'll check availability. We can often source items on request, especially for bulk or team orders.",
      },
      {
        q: "Are all products genuine and authentic?",
        a: "Yes — 100%. We are an authorised retailer for all brands we sell. Every product comes with the manufacturer's warranty and authenticity guarantee. We never sell replica or counterfeit goods.",
      },
      {
        q: "What glove size should I buy?",
        a: "Cricket gloves are sized Junior Small, Junior, Youth, Small Adult, Medium Adult and Large Adult. As a guide, measure the circumference of your palm (excluding the thumb) at its widest point. Contact our team if you're unsure — we're happy to help.",
      },
    ],
  },
  "gift-cards": {
    title: "Gift Cards",
    description: "Buying, redeeming and checking your PAPAS Gift Card balance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><path d="M8 7V5a2 2 0 0 1 4 0v2"/><line x1="12" y1="7" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
    faqs: [
      {
        q: "Where can I buy a PAPAS Gift Card?",
        a: "PAPAS Gift Cards can be purchased online via the Gift Cards page on our website. They are delivered digitally to the recipient's email address within minutes of purchase.",
      },
      {
        q: "What denominations are available?",
        a: "Gift cards are available in $25, $50, $75, $100, $150 and $200 denominations. You can also choose a custom amount between $10 and $500.",
      },
      {
        q: "How do I redeem a gift card?",
        a: "At checkout, click 'Add Gift Card' in the payment section and enter your unique code. The gift card value will be applied to your order. If your order total exceeds the gift card value, you can pay the remainder with any other payment method.",
      },
      {
        q: "Can I check my gift card balance?",
        a: "Yes — visit the Gift Cards page and click 'Check Balance'. Enter your gift card code to see the remaining balance.",
      },
      {
        q: "Do gift cards expire?",
        a: "PAPAS Gift Cards are valid for 24 months from the date of purchase. Any unused balance after this period will expire.",
      },
      {
        q: "Can I use multiple gift cards on one order?",
        a: "Yes, you can apply up to 2 gift cards per order.",
      },
      {
        q: "What if my gift card code doesn't work?",
        a: "Double-check the code was entered correctly (codes are case-sensitive). If the issue persists, please contact our support team with your gift card details and proof of purchase.",
      },
    ],
  },
  contact: {
    title: "Contact Us",
    description: "Reach our expert team — we're here to help 7 days a week.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    faqs: [
      {
        q: "What are your customer service hours?",
        a: "Our team is available Monday to Friday 9 AM – 6 PM and Saturday to Sunday 10 AM – 4 PM (GMT). Live chat and email are monitored 7 days a week during these hours.",
      },
      {
        q: "How quickly will you respond to my email?",
        a: "We aim to respond to all emails within 24 hours on working days. During peak periods (sale events, new season launches) response times may be slightly longer — we appreciate your patience.",
      },
      {
        q: "Can I speak to someone on the phone?",
        a: "Yes! Call us on 409-344-3513. Our phone lines are open Monday to Friday 9 AM – 5 PM. Outside these hours, please use live chat or email and we'll get back to you first thing.",
      },
      {
        q: "Do you have a physical store?",
        a: "Yes — PAPAS Willow HQ is located at 10 Cricket Lane, Birmingham. We welcome visitors by appointment. Contact us to arrange a visit, especially for team kit fittings and bulk orders.",
      },
      {
        q: "Can you help with team or bulk orders?",
        a: "Absolutely. We offer team discounts, custom embroidery and bespoke kit packages for clubs, schools and academies. Contact our team sales department at teams@papaswillow.com for a bespoke quote.",
      },
      {
        q: "I have a complaint — who do I contact?",
        a: "We take all feedback seriously. Please email us at complaints@papaswillow.com with full details of your issue. A senior team member will respond within 2 working days. If you're not satisfied with the outcome, you may escalate to our managing director.",
      },
    ],
  },
};

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`border rounded-[6px] transition-all ${isOpen ? "border-[#f69a39] shadow-sm" : "border-[#e8e8e8]"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className={`text-[14px] font-medium leading-snug pr-4 transition-colors ${isOpen ? "text-[#f69a39]" : "text-[#1e1e21]"}`}>
          {faq.q}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-[#f69a39] text-white" : "bg-[#f4f4f4] text-[#888]"}`}>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="h-px bg-[#f0f0f0] mb-4" />
          <p className="text-[13px] text-[#555] leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

const TOPIC_ORDER = ["delivery", "returns", "orders", "payments", "account", "products", "gift-cards", "contact"];

export default function HelpTopicPage() {
  const params = useParams();
  const slug = params?.topic as string;
  const topic = TOPIC_DATA[slug];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!topic) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#1e1e21] mb-3">Topic not found</h1>
          <Link href="/help" className="text-[#f69a39] underline text-[14px]">Back to Help Centre</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#1e1e21]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 flex items-center gap-2 text-[11px] text-[#888]">
          <Link href="/" className="hover:text-[#f69a39] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/help" className="hover:text-[#f69a39] transition-colors">Help Centre</Link>
          <span>/</span>
          <span className="text-white">{topic.title}</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[6px] bg-[#f69a39] flex items-center justify-center text-white flex-shrink-0">
              {topic.icon}
            </div>
            <div>
              <h1 className="text-white text-[26px] md:text-[34px] font-bold">{topic.title}</h1>
              <p className="text-[#888] text-[13px] mt-0.5">{topic.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar nav */}
          <aside className="lg:w-[220px] flex-shrink-0">
            <div className="bg-white rounded-[6px] border border-[#e8e8e8] overflow-hidden sticky top-24">
              <div className="px-4 py-3 border-b border-[#f0f0f0]">
                <p className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Help Topics</p>
              </div>
              {TOPIC_ORDER.map((s) => {
                const t = TOPIC_DATA[s];
                if (!t) return null;
                return (
                  <Link
                    key={s}
                    href={`/help/${s}`}
                    className={`flex items-center gap-3 px-4 py-3 text-[13px] border-b border-[#f5f5f5] last:border-0 transition-colors ${
                      s === slug
                        ? "bg-[#fff8f0] text-[#f69a39] font-semibold border-l-[3px] border-l-[#f69a39]"
                        : "text-[#444] hover:bg-[#fafafa] hover:text-[#1e1e21]"
                    }`}
                  >
                    {t.title}
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* FAQ accordion */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[6px] border border-[#e8e8e8] p-5 md:p-7 mb-5">
              <h2 className="text-[16px] font-semibold text-[#1e1e21] mb-5 uppercase tracking-[0.4px]">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {topic.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    faq={faq}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </div>
            </div>

            {/* Still need help */}
            <div className="bg-[#1e1e21] rounded-[6px] p-6 md:p-8">
              <h3 className="text-white text-[18px] font-semibold mb-1.5">Still need help?</h3>
              <p className="text-[#888] text-[13px] mb-6">Can&apos;t find your answer above? Our team is ready to help.</p>
              <div className="flex flex-wrap gap-3">
                {/* <Link
                  href="/help/contact"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#f69a39] text-white text-[13px] font-semibold rounded-[4px] hover:bg-[#e8880d] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Live Chat
                </Link> */}
                <a
                  href="mailto:support@papaswillow.com"
                  className="flex items-center gap-2 px-5 py-2.5 border border-[#444] text-white text-[13px] font-semibold rounded-[4px] hover:border-[#f69a39] hover:text-[#f69a39] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
