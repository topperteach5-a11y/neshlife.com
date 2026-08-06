'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/Applogo';
import Icon from '@/components/ui/Appicon';
import AdminProducts from '@/app/serverdata/components/AdminProducts';
import AdminOrders from '@/app/serverdata/components/AdminOrders';
import AdminInventory from '@/app/serverdata/components/AdminInventory';
import AdminTestimonials from '@/app/serverdata/components/AdminTestimonials';
import AdminNews from '@/app/serverdata/components/AdminNews';
import AdminMessages from '@/app/serverdata/components/AdminMessages';
import AdminSettings from '@/app/serverdata/components/AdminSettings';
import AdminLogin from '@/app/serverdata/components/AdminLogin';

type Tab = 'dashboard' | 'products' | 'orders' | 'inventory' | 'content' | 'news' | 'messages' | 'settings';

const stats = [
  { label: 'Total Products', value: '0', change: 'Loading...', icon: 'CubeIcon', color: 'bg-primary/10 text-primary' },
  { label: 'Orders Today', value: '0', change: 'Loading...', icon: 'ShoppingCartIcon', color: 'bg-blue-50 text-blue-600' },
  { label: 'Monthly Revenue', value: '₹0', change: 'Loading...', icon: 'BanknotesIcon', color: 'bg-green-50 text-green-600' },
  { label: 'Low Stock Alerts', value: '0', change: 'Loading...', icon: 'ExclamationTriangleIcon', color: 'bg-yellow-50 text-yellow-600' },
];

const navItems: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Squares2X2Icon' },
  { id: 'products', label: 'Products', icon: 'CubeIcon' },
  { id: 'orders', label: 'Orders', icon: 'ShoppingCartIcon' },
  { id: 'inventory', label: 'Inventory', icon: 'ArchiveBoxIcon' },
  { id: 'content', label: 'Testimonials', icon: 'DocumentTextIcon' },
  { id: 'news', label: 'News & Updates', icon: 'NewspaperIcon' },
  { id: 'messages', label: 'Messages', icon: 'EnvelopeIcon' },
  { id: 'settings', label: 'Settings', icon: 'Cog6ToothIcon' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  
  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<any>({
    stats: [],
    recentOrders: [],
    lowStockCount: 0,
    pendingOrdersCount: 0
  });
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to fetch notifications');
    }
  };

  // Derive unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Check session and load dashboard data on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/session');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setAdminEmail(data.email || '');
        await Promise.all([fetchDashboardData(), fetchNotifications()]);
      }
    } catch {
      // Session invalid or network error
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoadingDashboard(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore logout API errors
    }
    setIsAuthenticated(false);
    setAdminEmail('');
  };

  const markNotificationAsRead = async (id: string, tabToOpen?: Tab) => {
    // Optimistic UI
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    
    if (tabToOpen) {
      setActiveTab(tabToOpen);
      setIsNotificationsOpen(false);
    }
    
    try {
      await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true })
      });
    } catch (e) {
      // Restore on failure
      fetchNotifications();
    }
  };

  const clearReadNotifications = async () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
    try {
      await fetch('/api/admin/notifications', { method: 'DELETE' });
    } catch (e) {
      fetchNotifications();
    }
  };

  // Show loading spinner while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #134e4a 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          checkSession(); // Re-fetch to get email & dashboard data
        }}
      />
    );
  }

  // Authenticated — show dashboard
  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-primary flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-primary-foreground/10">
          <AppLogo size={32} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
            aria-label="Close sidebar"
          >
            <Icon name="XMarkIcon" size={18} className="text-primary-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary-foreground/15 text-primary-foreground'
                  : 'text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              <Icon name={item.icon as any} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-primary-foreground/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={18} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300/70 hover:text-red-200 hover:bg-red-500/15 transition-colors"
          >
            <Icon name="ArrowRightOnRectangleIcon" size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Open sidebar"
            >
              <Icon name="Bars3Icon" size={20} className="text-foreground" />
            </button>
            <h1 className="font-display font-bold text-lg text-foreground capitalize">
              {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Icon name="BellIcon" size={20} className="text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 rounded-full bg-red-500 text-[10px] font-semibold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50 flex flex-col max-h-[400px]">
                  <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between sticky top-0 z-10">
                    <h3 className="text-sm font-semibold text-foreground">Notifications ({unreadCount})</h3>
                    {notifications.some(n => n.isRead) && (
                      <button 
                        onClick={clearReadNotifications}
                        className="text-[10px] font-semibold text-primary hover:underline"
                      >
                        Clear Read
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No notifications yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {notifications.map((notif: any) => (
                          <div 
                            key={notif.id}
                            className={`p-4 transition-colors cursor-pointer ${notif.isRead ? 'opacity-60 hover:bg-muted/30' : 'bg-blue-50/30 hover:bg-muted/50'}`}
                            onClick={() => markNotificationAsRead(notif.id, notif.type === 'ORDER' ? 'orders' : notif.type === 'STOCK' ? 'inventory' : notif.type === 'MESSAGE' ? 'messages' : undefined)}
                          >
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notif.type === 'ORDER' ? 'bg-blue-100' :
                                notif.type === 'STOCK' ? 'bg-yellow-100' : 
                                notif.type === 'MESSAGE' ? 'bg-purple-100' : 'bg-gray-100'
                              }`}>
                                <Icon 
                                  name={notif.type === 'ORDER' ? 'ShoppingCartIcon' : notif.type === 'STOCK' ? 'ExclamationTriangleIcon' : notif.type === 'MESSAGE' ? 'EnvelopeIcon' : 'BellIcon' as any} 
                                  size={16} 
                                  className={notif.type === 'ORDER' ? 'text-blue-600' : notif.type === 'STOCK' ? 'text-yellow-600' : notif.type === 'MESSAGE' ? 'text-purple-600' : 'text-gray-600'} 
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${notif.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 pr-2">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1.5 opacity-70">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {!notif.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">AD</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-foreground block leading-tight">Admin</span>
                {adminEmail && (
                  <span className="text-[10px] text-muted-foreground leading-tight">{adminEmail}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              stats={dashboardData.stats.length > 0 ? dashboardData.stats : stats} 
              recentOrders={dashboardData.recentOrders}
              setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab === 'content' && <AdminTestimonials />}
          {activeTab === 'news' && <AdminNews />}
          {activeTab === 'messages' && <AdminMessages />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

function DashboardOverview({
  stats,
  recentOrders,
  setActiveTab,
}: {
  stats: any[];
  recentOrders?: any[];
  setActiveTab: (tab: Tab) => void;
}) {
  const ordersList = recentOrders?.length ? recentOrders : [
    { id: '#CF-1024', customer: 'No orders yet', product: '-', status: 'Pending', amount: '-', date: '-' }
  ];

  const statusColors: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Pending: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s: any) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon as any} size={20} />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-foreground mb-0.5">{s.value}</div>
            <div className="text-sm font-medium text-muted-foreground">{s.label}</div>
            <div className="text-xs text-accent mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Product', icon: 'PlusCircleIcon', tab: 'products' as Tab },
          { label: 'View Orders', icon: 'ClipboardDocumentListIcon', tab: 'orders' as Tab },
          { label: 'Check Inventory', icon: 'ArchiveBoxIcon', tab: 'inventory' as Tab },
          { label: 'Manage Content', icon: 'DocumentTextIcon', tab: 'content' as Tab },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => setActiveTab(action.tab)}
            className="bg-white border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary transition-colors">
              <Icon name={action.icon as any} size={18} className="text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Orders</h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs text-primary font-semibold flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            View All <Icon name="ArrowRightIcon" size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Order ID', 'Customer', 'Product', 'Status', 'Amount', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordersList.map((order: any, idx: number) => (
                <tr key={order.realId || idx} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-primary font-semibold">{order.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground whitespace-nowrap">{order.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{order.product}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-foreground">{order.amount}</td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
