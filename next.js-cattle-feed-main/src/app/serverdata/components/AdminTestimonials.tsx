'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/Appicon';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  alt: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Testimonial>({
    id: '',
    quote: '',
    name: '',
    role: '',
    rating: 5,
    image: '',
    alt: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  // Load testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Failed to load testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload file to server
    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('An error occurred during image upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Please upload an image for the testimonial.');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save testimonial');

      const data = await response.json();

      if (editingId) {
        setTestimonials(testimonials.map(t => t.id === editingId ? data : t));
      } else {
        setTestimonials([...testimonials, data]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const resetForm = () => {
    setFormData({ id: '', quote: '', name: '', role: '', rating: 5, image: '', alt: '' });
    setImagePreview('');
    setIsAdding(false);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData(testimonial);
    setImagePreview(testimonial.image);
    setEditingId(testimonial.id);
    setIsAdding(true);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5 border-b border-border pb-3">
            <h3 className="text-lg font-bold text-foreground">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Farmer Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Ramesh Yadav"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Role / Location *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Dairy Farmer, Haryana"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Testimonial Quote *</label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Share the farmer's feedback..."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm resize-none"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Uploadable Image Input */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Upload Photo *
              </label>

              <div className="flex items-start gap-4">
                {/* Image Preview Box */}
                <div className="w-28 h-28 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden relative flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <Icon name="PhotoIcon" size={24} className="mx-auto text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground block">No image</span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Button Controls */}
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="testimonial-image-upload"
                    style={{ fontSize: '16px' }}
                  />
                  <label
                    htmlFor="testimonial-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Icon name="ArrowUpTrayIcon" size={16} />
                    {isUploading ? 'Uploading Image...' : imagePreview ? 'Change Photo' : 'Upload Image File'}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Upload PNG, JPG, or WEBP photo from your device.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Alt Description Text</label>
                <input
                  type="text"
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Photo of Ramesh Yadav"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                  style={{ fontSize: '16px' }}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-md hover:bg-accent transition-colors disabled:opacity-50"
              >
                {editingId ? 'Update Testimonial' : 'Save Testimonial'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 border border-border text-foreground font-semibold text-sm rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && (
        <div className="flex justify-between items-center">
          <h2 className="font-display font-bold text-xl text-foreground">Testimonials Management</h2>
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Icon name="PlusIcon" size={18} />
            Add Testimonial
          </button>
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-white border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-full h-44 rounded-lg overflow-hidden mb-3 bg-muted border border-border">
                <img
                  src={testimonial.image}
                  alt={testimonial.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Icon key={i} name="StarIcon" size={14} className="text-yellow-400" variant="solid" />
                ))}
              </div>
              <p className="font-bold text-sm text-foreground mb-0.5">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{testimonial.role}</p>
              <p className="text-xs text-foreground/80 mb-4 line-clamp-3 italic">"{testimonial.quote}"</p>
            </div>
            <div className="flex gap-2 border-t border-border pt-3">
              <button
                onClick={() => handleEdit(testimonial)}
                className="flex-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
              >
                <Icon name="PencilIcon" size={14} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="flex-1 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"
              >
                <Icon name="TrashIcon" size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
