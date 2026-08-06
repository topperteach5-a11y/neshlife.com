import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dns from 'dns';

// Set public DNS servers globally in Node.js to bypass misconfigured local OS DNS resolvers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set public DNS servers:', e);
}

// Custom lookup that uses dns.resolve4 to resolve the host using the configured DNS servers
function customLookup(
  hostname: string,
  options: any,
  callback: (err: Error | null, address: string, family: number) => void
) {
  if (typeof options === 'function') {
    callback = options as any;
    options = {};
  }

  dns.resolve4(hostname, (err, addresses) => {
    if (err || !addresses || addresses.length === 0) {
      dns.lookup(hostname, options, callback);
    } else {
      callback(null, addresses[0], 4);
    }
  });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  lookup: customLookup,
} as any);
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
