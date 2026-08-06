'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/Appicon';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: CTA + Contact Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Contact Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Let&apos;s Build a Better Tomorrow Together
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Partner with NeshLife for expert nutrition solutions and dedicated support. Our team is ready to help you achieve better outcomes for your animals.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="PhoneIcon" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Phone</p>
                  <a href="tel:+917351059967" className="text-foreground font-medium text-sm hover:text-primary transition-colors">
                    +9178967 21160
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="EnvelopeIcon" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Email</p>
                  <a href="mailto:export@neshlife.com" className="text-foreground font-medium text-sm hover:text-primary transition-colors">
                    export@neshlife.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPinIcon" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Manufacturing for fish feed</p>
                  <p className="text-foreground font-medium text-sm">
                    CHC6+693, R.S.NO.49 P, Autonagar, Mangalagiri, Chinnakakani, Andhra Pradesh 522503

                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPinIcon" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Manufacturing for cattle feed</p>
                  <p className="text-foreground font-medium text-sm">
                    Kothe Chand Singh Wale, Bajakhana Road, Jaito, Punjab 151202
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-muted rounded-2xl p-6 md:p-8 border border-border">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">Send us a Message</h3>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="CheckCircleIcon" size={32} className="text-primary" variant="solid" />
                </div>
                <p className="font-semibold text-foreground">Message Sent!</p>
                <p className="text-muted-foreground text-sm text-center">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white border border-border rounded-md px-3 py-2.5 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Ramesh Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white border border-border rounded-md px-3 py-2.5 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="ramesh@farm.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white border border-border rounded-md px-3 py-2.5 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="+9178967 21160"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-white border border-border rounded-md px-3 py-2.5 text-base text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Choose a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="dealer">Become a Dealer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Your Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-white border border-border rounded-md px-3 py-2.5 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your farm and requirements..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold text-base hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon name="PaperAirplaneIcon" size={16} />
                      Send Message
                    </>
                  )}
                </button>
                {error && (
                  <p className="text-red-500 text-xs text-center mt-2">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
