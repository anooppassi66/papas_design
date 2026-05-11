import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | PAPAS Cricket",
  description: "How PAPAS Willow Cricket Store collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    heading: "1. Who We Are",
    body: `PAPAS Willow Pty Ltd ("PAPAS", "we", "us", "our") is the data controller responsible for your personal information. We operate papaswillow.com.au — Australia's premier destination for cricket equipment, apparel, and accessories.\n\nIf you have any questions about how we handle your data, please contact us:\nEmail: support@papaswillow.com.au\nWebsite: papaswillow.com.au`,
  },
  {
    heading: "2. What Personal Data We Collect",
    body: `We collect the following categories of personal information:\n\n• Identity Information — full name, username, date of birth, gender\n• Contact Information — postal address, email address, phone number\n• Financial Information — payment card details (processed securely via our payment provider; we do not store full card numbers)\n• Order Information — items purchased, order history, returns, and correspondence\n• Technical Information — IP address, browser type and version, device identifiers, time zone, operating system\n• Usage Information — pages visited, search queries, products viewed, clickstream data\n• Profile Information — account username and password, interests, preferences, feedback\n• Marketing Preferences — your preferences for receiving marketing from us\n\nWe do not collect any special categories of sensitive personal data (such as health, racial or ethnic origin, religious beliefs, or sexual orientation).`,
  },
  {
    heading: "3. How We Collect Your Data",
    body: `We collect personal data through:\n\n• Direct interactions — when you create an account, place an order, subscribe to our newsletter, contact customer support, submit a product review, or complete a survey\n• Automated technologies — as you interact with our website we may automatically collect technical and usage data via cookies, server logs, and similar technologies\n• Third parties — we may receive data from address verification providers, analytics platforms (such as Google Analytics), and advertising partners (such as Meta and Google) to help us understand how our services are used and to deliver relevant advertising`,
  },
  {
    heading: "4. How We Use Your Data",
    body: `We use your personal data to:\n\n• Process and fulfil your orders, including managing payments, delivery, and returns\n• Create and manage your customer account\n• Send order confirmations, dispatch notifications, and service communications\n• Respond to your enquiries and provide customer support\n• Send marketing communications where you have opted in or where we have a legitimate interest (e.g. you are an existing customer who purchased similar products)\n• Improve and personalise our website, products, and services\n• Detect and prevent fraud and abuse\n• Comply with our legal and regulatory obligations\n\nWe will not use your data for purposes incompatible with those listed above without notifying you.`,
  },
  {
    heading: "5. Marketing Communications",
    body: `We may send you marketing emails or SMS messages if you have consented to receive them or if you are an existing customer who has purchased similar products. You can opt out of marketing communications at any time by:\n\n• Clicking the unsubscribe link in any marketing email\n• Emailing us at support@papaswillow.com.au\n• Updating your preferences in your account settings\n\nOpting out of marketing communications will not affect transactional messages related to your orders.`,
  },
  {
    heading: "6. Sharing Your Data",
    body: `We share your personal data only where necessary:\n\n• Delivery partners — such as Australia Post, StarTrack, and DHL — to deliver your orders\n• Payment processors — to securely process your transactions\n• E-commerce platform — we use a third-party platform to operate our online store\n• Analytics and advertising platforms — such as Google and Meta, to measure our marketing effectiveness and show you relevant content\n• Legal and regulatory authorities — where required by law or to protect our rights\n\nWe do not sell your personal data to third parties. All third parties we work with are required to handle your data securely and in accordance with applicable law.`,
  },
  {
    heading: "7. Cookies",
    body: `We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us remember your preferences, keep items in your shopping cart, and understand how visitors use our site.\n\nTypes of cookies we use:\n• Essential cookies — necessary for the website to function correctly\n• Analytics cookies — help us understand site usage (e.g. Google Analytics)\n• Marketing cookies — used to deliver relevant advertisements\n\nYou can control cookie settings through your browser. Note that disabling certain cookies may affect the functionality of our website.`,
  },
  {
    heading: "8. Data Retention",
    body: `We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy legal, accounting, or reporting obligations.\n\n• Order records are retained for 7 years for tax and accounting purposes\n• Account data is retained for as long as your account is active and for a reasonable period after closure\n• Marketing consent records are kept until you withdraw consent\n\nWhen data is no longer needed, it is securely deleted or anonymised.`,
  },
  {
    heading: "9. Your Rights",
    body: `Under the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs), you have the following rights:\n\n• Right of access — you may request a copy of the personal data we hold about you\n• Right to correction — you may ask us to correct inaccurate or incomplete information\n• Right to erasure — you may request that we delete your personal data, subject to legal requirements\n• Right to object — you may object to us processing your data for direct marketing at any time\n• Right to data portability — you may request that we provide your data in a structured, machine-readable format\n• Right to withdraw consent — where processing is based on your consent, you may withdraw it at any time\n\nTo exercise any of these rights, please contact us at support@papaswillow.com.au. We will respond within 30 days. If you are not satisfied with our response, you have the right to lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au.`,
  },
  {
    heading: "10. Data Security",
    body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, accidental loss, destruction, or damage. These include SSL/TLS encryption for data in transit, secure password hashing, and restricted internal access to personal data.\n\nWhile we take security seriously, no method of transmission over the internet is 100% secure. If you suspect that your account has been compromised, please contact us immediately at support@papaswillow.com.au.`,
  },
  {
    heading: "11. International Transfers",
    body: `Some of our service providers are located outside Australia. Where we transfer your personal data internationally, we take steps to ensure that it is protected to a standard equivalent to Australian law, including through contractual safeguards with our service providers.`,
  },
  {
    heading: "12. Children's Privacy",
    body: `Our website is not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us and we will delete it promptly.`,
  },
  {
    heading: "13. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on this page with a revised effective date. We encourage you to review this page periodically. Your continued use of our website after changes are posted constitutes your acceptance of the revised policy.`,
  },
  {
    heading: "14. Contact & Complaints",
    body: `If you have any questions, concerns, or complaints about how we handle your personal data, please contact our Privacy Officer:\n\nEmail: support@papaswillow.com.au\nWebsite: papaswillow.com.au\n\nIf you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC):\nWeb: www.oaic.gov.au\nPhone: 1300 363 992`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Header */}
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39]">Home</Link>
          <span>/</span>
          <span className="text-white">Privacy Policy</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <h1 className="text-white text-[28px] md:text-[36px] font-semibold uppercase tracking-[0.5px]">Privacy Policy</h1>
          <p className="text-[#888] text-[13px] mt-2">Last updated: May 2025</p>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-4 md:px-10 py-10">
        {/* Intro */}
        <div className="bg-[#fff8f0] border border-[#f69a39]/30 rounded-[4px] px-5 py-4 mb-8 text-[13px] text-[#666]">
          At PAPAS Willow, your privacy matters. This policy explains what personal information we collect, why we collect it, how we use it, and the choices you have. We are committed to handling your data responsibly and in compliance with the Australian Privacy Act 1988.
        </div>

        {/* Table of contents */}
        <div className="bg-white rounded-[4px] border border-[#e8e8e8] px-6 py-5 mb-8">
          <h2 className="text-[13px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-3">Contents</h2>
          <ol className="space-y-1">
            {SECTIONS.map((s, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-[12px] text-[#f69a39] hover:underline">{s.heading}</a>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <div key={s.heading} id={`section-${i}`} className="bg-white rounded-[4px] border border-[#e8e8e8] px-6 py-5">
              <h2 className="text-[15px] font-semibold text-[#1e1e21] mb-3">{s.heading}</h2>
              <p className="text-[13px] text-[#555] leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-[12px] text-[#aaa]">
          Questions about your privacy? Email us at{" "}
          <a href="mailto:support@papaswillow.com.au" className="text-[#f69a39] hover:underline">
            support@papaswillow.com.au
          </a>
        </div>
      </div>
    </div>
  );
}
