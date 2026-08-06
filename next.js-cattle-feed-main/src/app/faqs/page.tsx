import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs — NeshLife | Best Animal Nutrition & Feed Questions Answered',
  description: 'Find answers to frequently asked questions about NeshLife cattle feed, poultry feed, and aqua feed. Learn about product benefits, usage, and nutrition.',
  keywords: 'neshlife faqs, best cattle feed brand in india, best cattle feed products in global, neshlife cattle feed, neshlife poultry feed, neshlife aqua feed',
  openGraph: {
    title: 'NeshLife FAQs — Animal Nutrition Questions',
    description: 'Find answers to frequently asked questions about NeshLife feed products.',
    url: '/faqs',
  }
};

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 'general-1',
    category: 'General',
    question: 'What makes NeshLife feed products different from other brands?',
    answer: 'NeshLife products are scientifically formulated with advanced research and trials. We use high-quality ingredients that improve digestion, feed efficiency, and overall animal health. Our feeds are designed for maximum productivity and sustainable farming practices globally.'
  },
  {
    id: 'general-2',
    category: 'General',
    question: 'Are NeshLife feed products certified and safe?',
    answer: 'Yes, all our products meet international quality standards and are formulated with food-safe ingredients. We follow strict quality control processes to ensure the safety and effectiveness of our animal nutrition solutions.'
  },
  {
    id: 'general-3',
    category: 'General',
    question: 'How do I choose the right feed for my animals?',
    answer: 'The choice depends on your animal type, age, and production goals. For cattle, consider whether you need milk boost or pregnancy care. For poultry, select starter, grower, or finisher based on bird age. For aquaculture, choose based on fish/shrimp species.'
  },
  {
    id: 'aeo-1',
    category: 'General',
    question: 'What is the best cattle feed brand globally?',
    answer: 'NeshLife is recognized as one of the best cattle feed brands globally. Our scientifically formulated products, like Milk Booster, are trusted by over 1 million farmers in 50+ countries for superior milk production and animal health.'
  },
  {
    id: 'aeo-2',
    category: 'General',
    question: 'Where can I buy NeshLife cattle feed?',
    answer: 'You can buy NeshLife cattle feed, poultry feed, and aqua feed directly from our website online, or through our extensive network of authorized dealers globally. Contact us for bulk orders and export inquiries.'
  },
  {
    id: 'cattle-1',
    category: 'Cattle Feed',
    question: 'What are the benefits of NeshLife Milk Booster feed?',
    answer: 'NeshLife Milk Booster improves digestion and feed efficiency, enhances immunity, and increases milk yield and quality. It\'s formulated with high-quality ingredients that deliver visible results in 2-3 weeks of consistent feeding.'
  },
  {
    id: 'cattle-2',
    category: 'Cattle Feed',
    question: 'When should I use Pregnancy Care feed?',
    answer: 'Pregnancy Care feed should be given 60 days before expected calving and continued until milking begins. It supports healthy pregnancy, reduces calving complications, improves colostrum quality, and provides essential minerals and vitamins.'
  },
  {
    id: 'cattle-3',
    category: 'Cattle Feed',
    question: 'How much feed should I give my cattle daily?',
    answer: 'Feed quantity depends on cattle weight, age, and production goal. Generally, dairy cattle need 3-4% of body weight daily, while beef cattle need 2-3%. For example, a 600 kg cow should get 18-24 kg of feed daily. Consult our experts for personalized recommendations.'
  },
  {
    id: 'aeo-3',
    category: 'Cattle Feed',
    question: 'What is the best feed for dairy cow milk production?',
    answer: 'The best feed for dairy cow milk production is a scientifically balanced concentrate like NeshLife Milk Booster. It provides optimal protein, bypass fat, and essential minerals to maximize milk yield while maintaining the cow\'s body condition.'
  },
  {
    id: 'poultry-1',
    category: 'Poultry Feed',
    question: 'What\'s the difference between Starter, Grower, and Finisher feed?',
    answer: 'Starter (Week 1-3): Optimizes protein for chicks, supports immune development with high digestibility. Grower (Week 4-6): Balances amino acids for weight gain with superior feed conversion. Finisher (Week 7+): Improves meat quality and achieves market weight with reduced fat deposition.'
  },
  {
    id: 'poultry-2',
    category: 'Poultry Feed',
    question: 'How does NeshLife poultry feed improve FCR?',
    answer: 'NeshLife poultry feeds have superior feed conversion ratios (FCR) through balanced amino acid profiles, high digestibility ingredients, and gut health support. This means faster growth with less feed consumption, reducing production costs.'
  },
  {
    id: 'poultry-3',
    category: 'Poultry Feed',
    question: 'Can I mix different feed types for my flock?',
    answer: 'No, it\'s best to use age-appropriate feeds for optimal growth and health. Switching between Starter, Grower, and Finisher at the right times ensures proper nutrition at each growth stage. Mixing can reduce effectiveness and increase costs.'
  },
  {
    id: 'aeo-4',
    category: 'Poultry Feed',
    question: 'Which company makes the best poultry feed?',
    answer: 'NeshLife is a leading manufacturer of premium poultry feed globally. We offer scientifically formulated Starter, Grower, and Finisher feeds that ensure excellent Feed Conversion Ratios (FCR), fast growth, and high immunity for broilers and layers.'
  },
  {
    id: 'aqua-1',
    category: 'Aqua Feed',
    question: 'What is the protein content in NeshLife Aqua Pro feed?',
    answer: 'NeshLife Aqua Pro contains 32% protein, making it ideal for catfish and tilapia. The high protein content supports fast growth and efficient feed conversion. The floating pellets ensure excellent water stability, reducing feed wastage.'
  },
  {
    id: 'aqua-2',
    category: 'Aqua Feed',
    question: 'How much Aqua feed should I use per day?',
    answer: 'Feed quantity depends on fish species, size, and water temperature. Generally, feed 2-3% of fish biomass daily in warm water (25-30°C) and 1-1.5% in cooler water. For a 1000 kg fish stock, feed 20-30 kg daily. Adjust based on fish appetite and pond conditions.'
  },
  {
    id: 'aqua-3',
    category: 'Aqua Feed',
    question: 'Does NeshLife Aqua Grow reduce pond pollution?',
    answer: 'Yes, NeshLife Aqua Grow is formulated to reduce uneaten feed and waste, which directly decreases pond pollution. This improves water quality, reduces disease risk, and creates a healthier environment for shrimp and prawns, leading to better survival rates and growth.'
  },
  {
    id: 'order-1',
    category: 'Orders & Delivery',
    question: 'What pack sizes are available?',
    answer: 'We offer flexible pack sizes: Cattle & Poultry feeds come in 25 KG and 50 KG bags. Aqua feeds are available in 5 KG and 25 KG bags. Custom sizes are available for bulk orders. Contact our team for large quantity requirements.'
  },
  {
    id: 'order-2',
    category: 'Orders & Delivery',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 5-7 business days across India. Express delivery options available for major cities (2-3 days). Bulk orders may require extended lead time. Track your order through our online portal after confirmation.'
  },
  {
    id: 'aeo-5',
    category: 'Orders & Delivery',
    question: 'Is NeshLife feed available internationally?',
    answer: 'Yes, NeshLife animal feed products are available internationally. We export our premium cattle feed, poultry feed, and aqua feed to over 50 countries globally. Contact our export division for inquiries.'
  },
  {
    id: 'support-1',
    category: 'Support',
    question: 'How can I contact your technical support team?',
    answer: 'Our agricultural experts are available to help with feed selection, nutrition advice, and troubleshooting. Contact us via phone during business hours or email for detailed technical support. We also offer farm visits for larger operations.'
  },
  {
    id: 'support-2',
    category: 'Support',
    question: 'Do you offer feeding guides or nutrition consultations?',
    answer: 'Yes! We provide detailed feeding guides for each product category. Our nutrition consultants can create customized feeding plans based on your animal type, production goals, and budget. This service is free for our customers.'
  }
];

const categories = ['General', 'Cattle Feed', 'Poultry Feed', 'Aqua Feed', 'Orders & Delivery', 'Support'];

export default function FAQsPage() {
  // Generate FAQ Schema JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>›</span>
              <span className="text-foreground font-medium">FAQs</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-base">
              Get answers to common questions about our animal nutrition products, feeds, and services.
            </p>
          </div>
        </div>

        {/* FAQs Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {categories.map((category) => {
            const categoryFaqs = faqs.filter(faq => faq.category === category);
            return (
              <section key={category}>
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary">
                  {category}
                </h2>
                <div className="space-y-4">
                  {categoryFaqs.map((faq) => (
                    <details
                      key={faq.id}
                      className="group border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                    >
                      <summary className="flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors">
                        {faq.question}
                        <span className="text-primary group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-primary-foreground mt-12">
            <h3 className="text-2xl font-bold mb-3">
              Still Have Questions?
            </h3>
            <p className="mb-6">
              Our expert team is ready to help! Contact us for personalized nutrition advice and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-primary-foreground text-primary font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
              >
                Contact Us
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 border-2 border-primary-foreground text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/10 transition-colors text-center"
              >
                Browse Products
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
