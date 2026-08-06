'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const emptyProduct = {
    name: '',
    category: 'Cattle Feed',
    weight: '50 KG',
    price: '' as number | '',
    stock: 0,
    description: '',
    features: '',
    packSizes: ''
  };

  const [formData, setFormData] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      weight: product.weight,
      price: product.price ?? '',
      stock: product.stock,
      description: product.description || '',
      features: Array.isArray(product.features) ? product.features.join(', ') : product.features || '',
      packSizes: Array.isArray(product.packSizes) ? product.packSizes.join(', ') : product.packSizes || '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setIsSubmitting(true);

    const body = new FormData();
    body.append('name', formData.name);
    body.append('category', formData.category);
    body.append('weight', formData.weight);
    body.append('price', (formData.price || 0).toString());
    body.append('stock', formData.stock.toString());
    body.append('description', formData.description);
    body.append('features', formData.features);
    body.append('packSizes', formData.packSizes);

    if (imageFile) {
      body.append('image', imageFile);
    }

    try {
      let res;
      if (editingProduct) {
        body.append('id', editingProduct.id.toString());
        res = await fetch('/api/admin/products', {
          method: 'PUT',
          body,
        });
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          body,
        });
      }

      if (res.ok) {
        const savedProduct = await res.json();
        if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
        } else {
          setProducts(prev => [savedProduct, ...prev]);
        }
        setFormData(emptyProduct);
        setImageFile(null);
        setEditingProduct(null);
        setShowForm(false);
      } else {
        console.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    Active: 'bg-green-100 text-green-700',
    'Low Stock': 'bg-yellow-100 text-yellow-700',
    Inactive: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display font-bold text-xl text-foreground">Products Management</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent transition-colors"
        >
          <Icon name="PlusIcon" size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-border rounded-md pl-9 pr-3 py-2 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Add / Edit Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">
            {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Milk Booster Pro"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  style={{ fontSize: '16px' }}
                >
                  <option>Cattle Feed</option>
                  <option>Poultry Feed</option>
                  <option>Aqua Feed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Default Pack Weight</label>
                <select
                  value={formData.weight}
                  onChange={e => setFormData(p => ({ ...p, weight: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  style={{ fontSize: '16px' }}
                >
                  <option>25 KG</option>
                  <option>50 KG</option>
                  <option>5 KG</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData(p => ({ ...p, price: e.target.value === '' ? '' : parseFloat(e.target.value) }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  min={0}
                  step={0.01}
                  placeholder="e.g. 1350"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  min={0}
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  placeholder="Product description..."
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={e => setFormData(p => ({ ...p, features: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="High quality, Better yield, ..."
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Available Pack Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.packSizes}
                  onChange={e => setFormData(p => ({ ...p, packSizes: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="25 KG, 50 KG"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Upload Product Image {editingProduct ? '(leave empty to keep current photo)' : '*'}
                </label>
                <div className="flex items-center gap-4">
                  {(imageFile || editingProduct?.imageUrl) && (
                    <div className="w-16 h-16 rounded-lg border border-border bg-white overflow-hidden flex-shrink-0">
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : editingProduct.imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-accent cursor-pointer"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingProduct(null); }}
                className="border border-border px-5 py-2 rounded-md text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading products from database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {['Product', 'Category', 'Weight', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-white">
                          <AppImage
                            src={product.imageUrl || '/assets/images/no_image.png'}
                            alt={`${product.name} product thumbnail`}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                            unoptimized
                          />
                        </div>
                        <span className="font-medium text-foreground whitespace-nowrap">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{product.category}</td>
                    <td className="px-5 py-3 text-muted-foreground">{product.weight}</td>
                    <td className="px-5 py-3 font-semibold text-primary">₹{(product.price ?? 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">{product.stock}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[product.status] || statusColors.Inactive}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Icon name="PencilIcon" size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Icon name="TrashIcon" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                      No products found. Start by adding one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">{filtered.length} products shown</p>
        </div>
      </div>
    </div>
  );
}