import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Neshlife | Animal Nutrition',
  description: 'Read the terms and conditions governing the use of Neshlife products, services, and website. Understand your rights and responsibilities.',
};

export default function TermsPage() {
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
        name: 'Terms & Conditions',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/terms`
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
              <span className="text-foreground font-medium">Terms &amp; Conditions</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-primary text-primary-foreground py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
              Terms &amp; Conditions
            </h1>
            <p className="text-primary-foreground/70 text-sm md:text-base max-w-2xl mx-auto">
              Please read these terms carefully before using our products and services.
            </p>
            <p className="text-primary-foreground/50 text-xs mt-4">
              Last Updated: July 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="prose prose-green max-w-none space-y-10">

            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">1</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Acceptance of Terms</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  By accessing and using the Neshlife website, placing orders, or using any of our products and services, you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, please do not use our services.
                </p>
                <p>
                  These terms apply to all visitors, users, customers, distributors, and dealers who access or use our website and services.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">2</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Products &amp; Services</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Neshlife manufactures and distributes scientifically formulated animal nutrition products including cattle feed, poultry feed, and aqua feed. All product descriptions, images, and specifications provided on this website are for informational purposes.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Product images are representative and actual packaging may vary.</li>
                  <li>We reserve the right to modify product formulations, packaging, or pricing without prior notice.</li>
                  <li>Product availability may vary by region. Contact us at <a href="mailto:export@neshlife.com" className="text-primary font-medium hover:underline">export@neshlife.com</a> for availability in your area.</li>
                  <li>All feed products must be stored according to the instructions on the packaging to maintain quality.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">3</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Orders &amp; Payments</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  All orders placed through the website or through authorized dealers are subject to acceptance by Neshlife. We reserve the right to refuse or cancel any order at our discretion.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Prices displayed are in the local currency and may exclude taxes, duties, and shipping charges unless otherwise stated.</li>
                  <li>Payment terms for bulk and dealer orders will be communicated separately upon inquiry.</li>
                  <li>For export orders, please contact <a href="mailto:export@neshlife.com" className="text-primary font-medium hover:underline">export@neshlife.com</a> for pricing, minimum order quantities, and payment terms.</li>
                  <li>We accept payments through bank transfers, UPI, and other modes as communicated at the time of order.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">4</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Shipping &amp; Delivery</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Delivery timelines are estimated and may vary based on location, order volume, and logistics conditions. Neshlife is not liable for delays caused by factors beyond our control.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Shipping charges, if applicable, will be communicated before order confirmation.</li>
                  <li>Risk of loss or damage passes to the buyer upon delivery to the shipping carrier.</li>
                  <li>For international shipments, the buyer is responsible for all customs duties, taxes, and import regulations.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">5</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Returns &amp; Refunds</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Due to the perishable nature of our products, returns are accepted only in cases of manufacturing defects or delivery of incorrect products.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Claims must be raised within 48 hours of delivery with photographic evidence.</li>
                  <li>Refunds or replacements will be processed within 7–10 business days after verification.</li>
                  <li>Custom or bulk orders may not be eligible for returns.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">6</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Intellectual Property</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  All content on this website, including but not limited to text, graphics, logos, images, product names, and software, is the property of Neshlife and is protected by applicable intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, or use any of our intellectual property without prior written consent from Neshlife.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">7</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Limitation of Liability</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Neshlife shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use of our products or services. Our total liability shall not exceed the amount paid by you for the specific product or service in question.
                </p>
                <p>
                  While we ensure our products meet the highest quality standards, results may vary based on animal breed, health conditions, and feeding practices. We recommend consulting a veterinary nutritionist for specific dietary advice.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-secondary text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">8</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Governing Law</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Assam, India.
                </p>
              </div>
            </section>

            {/* Contact Box */}
            <section className="bg-secondary rounded-2xl p-6 md:p-8 border border-border mt-12">
              <h3 className="font-display text-lg font-bold text-foreground mb-2">Have Questions?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms &amp; Conditions, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Email:</span>{' '}
                  <a href="mailto:export@neshlife.com" className="text-primary font-medium hover:underline">
                    export@neshlife.com
                  </a>
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Address:</span> HQ: Barpeta Road, Assam, India — 781315
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
