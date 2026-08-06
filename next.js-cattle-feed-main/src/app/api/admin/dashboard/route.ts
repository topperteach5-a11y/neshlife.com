import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  // Verify admin authentication
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Total Products
    const totalProducts = await prisma.product.count();

    // 2. Orders Today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const ordersToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfToday
        }
      }
    });

    // 3. Monthly Revenue (sum of totalAmount for delivered orders this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        createdAt: {
          gte: startOfMonth
        },
        status: 'Delivered'
      }
    });
    
    const monthlyRevenueRaw = revenueResult._sum.totalAmount || 0;
    // Format to INR display string like "₹4.2L" or "₹42,000"
    let formattedRevenue = `₹${monthlyRevenueRaw.toLocaleString('en-IN')}`;
    if (monthlyRevenueRaw >= 100000) {
      formattedRevenue = `₹${(monthlyRevenueRaw / 100000).toFixed(1)}L`;
    } else if (monthlyRevenueRaw >= 1000) {
      formattedRevenue = `₹${(monthlyRevenueRaw / 1000).toFixed(1)}K`;
    }

    // 4. Low Stock Alerts
    const allProducts = await prisma.product.findMany({
      select: { stock: true }
    });
    const lowStockCount = allProducts.filter(p => p.stock <= 50).length;

    // 5. Recent Orders (top 5)
    const recentOrdersDb = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const recentOrders = recentOrdersDb.map(order => {
      // Create a summary product string like "Milk Booster 50KG + 2 more"
      const firstItem = order.items[0];
      let productStr = 'N/A';
      if (firstItem) {
        productStr = `${firstItem.product.name} ${firstItem.packSize}`;
        if (order.items.length > 1) {
          productStr += ` + ${order.items.length - 1} more`;
        }
      }

      return {
        id: `#CF-${order.id.slice(0, 6).toUpperCase()}`,
        realId: order.id,
        customer: order.customerName,
        product: productStr,
        status: order.status,
        amount: `₹${order.totalAmount.toLocaleString('en-IN')}`,
        date: order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    });

    const stats = [
      { label: 'Total Products', value: totalProducts.toString(), change: 'Live from DB', icon: 'CubeIcon', color: 'bg-primary/10 text-primary' },
      { label: 'Orders Today', value: ordersToday.toString(), change: 'Since midnight', icon: 'ShoppingCartIcon', color: 'bg-blue-50 text-blue-600' },
      { label: 'Monthly Revenue', value: formattedRevenue, change: 'Delivered this month', icon: 'BanknotesIcon', color: 'bg-green-50 text-green-600' },
      { label: 'Low Stock Alerts', value: lowStockCount.toString(), change: 'Action needed', icon: 'ExclamationTriangleIcon', color: 'bg-yellow-50 text-yellow-600' },
    ];

    // Get unhandled orders for notifications
    const pendingOrdersCount = await prisma.order.count({
      where: { status: 'Pending' }
    });

    return NextResponse.json({
      stats,
      recentOrders,
      lowStockCount,
      pendingOrdersCount
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
