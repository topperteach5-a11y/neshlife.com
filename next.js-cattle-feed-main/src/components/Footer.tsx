import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/Applogo';
import fs from 'fs/promises';
import path from 'path';

const footerLinks = [
  { group: ['Home', '/'], links: [['About Us', '/#about'], ['Products', '/products']] },
  { group: ['Our Products', ''], links: [['Cattle Feed', '/products?category=Cattle%20Feed'], ['Poultry Feed', '/products?category=Poultry%20Feed'], ['Aqua Feed', '/products?category=Aqua%20Feed']] },
  { group: ['Support', ''], links: [['FAQs', '/faqs'], ['Terms & Conditions', '/terms'], ['Privacy Policy', '/privacy']] },
];

export default async function Footer() {
  let instagramUrl = 'https://instagram.com/neshlife.com_';
  try {
    const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');
    const data = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(data);
    if (settings.instagramUrl) instagramUrl = settings.instagramUrl;
  } catch (e) {}

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-primary-foreground/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={36} />
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-4 max-w-xs">
              NeshLife provides science-based animal nutrition solutions globally for better health, productivity, and sustainable farming. Trusted by farmers worldwide.
            </p>
            <div className="mb-4">
              <p className="text-sm font-semibold text-primary-foreground mb-1">Contact Us:</p>
              <p className="text-xs text-primary-foreground/70 mb-0.5">Phone: +9178967 21160</p>
              <p className="text-xs text-primary-foreground/70 mb-0.5">Email: export@neshlife.com</p>
              <p className="text-xs text-primary-foreground/70">Address: Head Office, Mumbai or 20-22 Wenlock Road, London, United Kingdom, N1 7GU.</p>
            </div>
            <p className="text-sm font-semibold text-primary-foreground mb-2">Follow us on:</p>
            <div className="flex gap-3">
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border border-primary-foreground/30 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                >
                  Instagram
                </a>
              ) : (
                <span className="px-4 py-2 rounded-lg border border-primary-foreground/30 text-sm font-semibold text-primary-foreground/50">
                  Instagram link not set
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['About Us', '/#about'], ['Products', '/products'], ['News', '/#news'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">Our Products</h4>
            <ul className="space-y-2">
              {footerLinks[1].links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">Support</h4>
            <ul className="space-y-2 mb-6">
              {footerLinks[2].links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-center py-4">
          <p className="text-xs text-primary-foreground/50">© 2026 Neshlife. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
