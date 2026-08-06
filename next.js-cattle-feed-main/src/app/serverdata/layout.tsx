import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — NeshLife CattleFeed',
  description: 'NeshLife CattleFeed admin panel for managing products, orders, inventory, and content.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-area">{children}</div>;
}
