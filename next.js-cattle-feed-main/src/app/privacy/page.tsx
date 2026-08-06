import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Neshlife | Animal Nutrition',
  description: 'Learn how Neshlife collects, uses, and protects your personal information. Our commitment to your data privacy and security.',
};

export default function PrivacyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Privacy Policy',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/privacy`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <div className="pt-16 md:pt-18">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>›</span>
              <span className="text-foreground font-medium">Privacy Policy</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-primary text-primary-foreground py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
              Privacy Policy
            </h1>
            <p className="text-primary-foreground/70 text-sm md:text-base max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we handle your personal information.
            </p>
            <p className="text-primary-foreground/50 text-xs mt-4">
              Effective Date: July 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="prose prose-green max-w-none space-y-10">

            {/* Introduction */}
            <section className="bg-secondary/50 rounded-2xl p-6 border border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Neshlife (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy of our customers, dealers, partners, and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, place orders, or interact with our services.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">1</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Information We Collect</h2>
              </div>
              <div className="pl-11 space-y-4 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="mb-2">We may collect the following personal information when you interact with us:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Full name, email address, and phone number</li>
                    <li>Business name and address (for dealers and distributors)</li>
                    <li>Shipping and billing addresses</li>
                    <li>Payment information (processed securely through third-party payment gateways)</li>
                    <li>Communication preferences and inquiry history</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                  <p className="mb-2">When you visit our website, we may automatically collect:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited, time spent, and navigation patterns</li>
                    <li>Referring website URL</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">2</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">How We Use Your Information</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>To process and fulfill your orders and inquiries</li>
                  <li>To communicate about products, promotions, and updates</li>
                  <li>To improve our website, products, and customer experience</li>
                  <li>To manage dealer and distributor relationships</li>
                  <li>To comply with legal obligations and resolve disputes</li>
                  <li>To detect and prevent fraud or unauthorized access</li>
                  <li>To respond to your export-related inquiries via <a href="mailto:export@neshlife.com" className="text-primary font-medium hover:underline">export@neshlife.com</a></li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">3</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Information Sharing &amp; Disclosure</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in order fulfillment, payment processing, shipping, and website analytics.</li>
                  <li><strong>Legal Requirements:</strong> When required by law, regulation, court order, or governmental authority.</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
                  <li><strong>Consent:</strong> When you have provided explicit consent for sharing.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">4</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Cookies &amp; Tracking</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device.
                </p>
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cookie Type</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 font-medium text-foreground">Essential</td>
                        <td className="px-4 py-3">Required for website functionality and security</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-foreground">Analytics</td>
                        <td className="px-4 py-3">Help us understand how visitors interact with our site</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-foreground">Preferences</td>
                        <td className="px-4 py-3">Remember your settings and preferences</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  You can manage cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">5</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Data Security</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These include:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure server infrastructure with access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection practices</li>
                </ul>
                <p>
                  However, no method of electronic transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">6</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Your Rights</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal obligations.</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
                  <li><strong>Data Portability:</strong> Request your data in a structured, commonly used format.</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:export@neshlife.com" className="text-primary font-medium hover:underline">export@neshlife.com</a>.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">7</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Third-Party Links</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites. We encourage you to review the privacy policies of any third-party websites you visit.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">8</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Changes to This Policy</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
                </p>
              </div>
            </section>

            {/* Contact Box */}
            <section className="bg-secondary rounded-2xl p-6 md:p-8 border border-border mt-12">
              <h3 className="font-display text-lg font-bold text-foreground mb-2">Contact Us About Privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please reach out:
              </p>
              <div className="space-y-2">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Email:</span>{' '}
                  <a href="mailto:export@neshlife.com" className="text-primary font-medium hover:underline">
                    export@neshlife.com
                  </a>
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Address:</span> Barpeta Road, Assam, India — 781315
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
