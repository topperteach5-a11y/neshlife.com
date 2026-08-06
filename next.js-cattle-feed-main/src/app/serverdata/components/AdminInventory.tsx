'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/Appicon';

export default function AdminInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        // The API maps packSizes appropriately or we just use unit
        // We'll normalize unit from packSizes or default to 50KG
        const normalizedData = data.map((item: any) => ({
          ...item,
          unit: item.packSizes?.[0] || 'Bags (50KG)'
        }));
        setInventory(normalizedData);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= minStock) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const getStockBarWidth = (stock: number, minStock: number) => {
    const max = Math.max(stock, minStock) * 2;
    return Math.min((stock / max) * 100, 100);
  };

  const getStockBarColor = (stock: number, minStock: number) => {
    if (stock <= 0) return 'bg-red-500';
    if (stock <= minStock) return 'bg-yellow-500';
    return 'bg-primary';
  };

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);

  const updateStock = async (id: number, delta: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const newStock = Math.max(0, item.stock + delta);
    
    // Optimistic UI update
    setInventory(prev =>
      prev.map(i =>
        i.id === id ? { ...i, stock: newStock } : i
      )
    );

    try {
      await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newStock })
      });
    } catch (error) {
      console.error('Failed to update stock', error);
      // Revert on error
      fetchInventory();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="font-display font-bold text-xl text-foreground">Inventory Management</h2>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ExclamationTriangleIcon" size={18} className="text-yellow-600" />
            <h3 className="font-semibold text-yellow-800 text-sm">
              {lowStockItems.length} Low Stock Alert{lowStockItems.length > 1 ? 's' : ''}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200">
                {item.name} — {item.stock} bags left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total SKUs', value: inventory.length, icon: 'CubeIcon', color: 'text-primary bg-primary/10' },
          { label: 'In Stock', value: inventory.filter(i => i.stock > i.minStock).length, icon: 'CheckCircleIcon', color: 'text-green-600 bg-green-50' },
          { label: 'Low Stock', value: inventory.filter(i => i.stock > 0 && i.stock <= i.minStock).length, icon: 'ExclamationTriangleIcon', color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Out of Stock', value: inventory.filter(i => i.stock <= 0).length, icon: 'XCircleIcon', color: 'text-red-600 bg-red-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-border p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
              <Icon name={card.icon as any} size={18} />
            </div>
            <div className="font-display text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Stock Levels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {['Product', 'Category', 'Location', 'Stock Level', 'Status', 'Adjust'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const status = getStockStatus(item.stock, item.minStock);
                const barWidth = getStockBarWidth(item.stock, item.minStock);
                const barColor = getStockBarColor(item.stock, item.minStock);
                return (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground whitespace-nowrap">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs whitespace-nowrap">{item.category}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs whitespace-nowrap">{item.location}</td>
                    <td className="px-5 py-3 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="font-semibold text-foreground text-xs w-8 text-right flex-shrink-0">
                          {item.stock}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Min: {item.minStock}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateStock(item.id, -10)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          aria-label={`Decrease stock for ${item.name}`}
                        >
                          <Icon name="MinusIcon" size={12} />
                        </button>
                        <button
                          onClick={() => updateStock(item.id, 50)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-secondary hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                          aria-label={`Increase stock for ${item.name}`}
                        >
                          <Icon name="PlusIcon" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{inventory.length} products tracked</p>
          <p className="text-xs text-muted-foreground">Last updated: Jul 16, 2026</p>
        </div>
      </div>
    </div>
  );
}