'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/Appicon';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface NewsPost {
  id: string;
  tag: string;
  title: string;
  date: string;
  image: string;
  alt: string;
  excerpt: string;
  content?: string;
}

const TAG_OPTIONS = ['News', 'Article', 'Event', 'Update'];

const tagColors: Record<string, string> = {
  News: 'bg-primary/10 text-primary',
  Article: 'bg-accent/10 text-accent',
  Event: 'bg-yellow-100 text-yellow-700',
  Update: 'bg-blue-100 text-blue-700',
};

export default function AdminNews() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<NewsPost>({
    id: '',
    tag: 'News',
    title: '',
    date: '',
    image: '',
    alt: '',
    excerpt: '',
    content: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const formatForInput = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const formatForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Load news posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      alert('Please upload an image for the news post.');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/news/${editingId}` : '/api/news';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save news post');

      const data = await response.json();

      if (editingId) {
        setPosts(posts.map(p => p.id === editingId ? data : p));
      } else {
        setPosts([data, ...posts]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving news post:', error);
      alert('Failed to save news post');
    }
  };

  const resetForm = () => {
    setFormData({ id: '', tag: 'News', title: '', date: '', image: '', alt: '', excerpt: '', content: '' });
    setImagePreview('');
    setIsAdding(false);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news post?')) return;

    try {
      const response = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting news post:', error);
      alert('Failed to delete news post');
    }
  };

  const handleEdit = (post: NewsPost) => {
    setFormData(post);
    setImagePreview(post.image);
    setEditingId(post.id);
    setIsAdding(true);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading news posts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5 border-b border-border pb-3">
            <h3 className="text-lg font-bold text-foreground">{editingId ? 'Edit News Post' : 'Add New News Post'}</h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Post Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. NeshLife Expands Global Presence with New Distribution Partners"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Tag & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Category / Tag *</label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                  style={{ fontSize: '16px' }}
                >
                  {TAG_OPTIONS.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Publish Date & Time <span className="text-muted-foreground/60">(auto-filled if empty)</span>
                </label>
                <input
                                  type="datetime-local"
                                  name="date"
                                  value={formatForInput(formData.date) || ''}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Short Excerpt / Summary *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows={2}
                placeholder="Write a brief summary of this news post..."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm resize-none"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Article Content *</label>
              <div className="bg-white [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm [&_.ql-container]:border-border [&_.ql-toolbar]:border-border rounded-md overflow-hidden">
                <ReactQuill 
                  theme="snow"
                  value={formData.content || ''}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Write your full article here..."
                />
              </div>
            </div>

            {/* Uploadable Image Input */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Upload Cover Image *
              </label>

              <div className="flex items-start gap-4">
                {/* Image Preview Box */}
                <div className="w-40 h-24 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden relative flex-shrink-0">
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
                    id="news-image-upload"
                    style={{ fontSize: '16px' }}
                  />
                  <label
                    htmlFor="news-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Icon name="ArrowUpTrayIcon" size={16} />
                    {isUploading ? 'Uploading Image...' : imagePreview ? 'Change Image' : 'Upload Cover Image'}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Upload PNG, JPG, or WEBP cover image. Recommended: 16:9 aspect ratio.
                  </p>
                </div>
              </div>
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Image Alt Description</label>
              <input
                type="text"
                name="alt"
                value={formData.alt}
                onChange={handleInputChange}
                placeholder="e.g. Cattle herd on farmland, golden sunlight"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-md hover:bg-accent transition-colors disabled:opacity-50"
              >
                {editingId ? 'Update Post' : 'Publish Post'}
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
          <h2 className="font-display font-bold text-xl text-foreground">News & Updates Management</h2>
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Icon name="PlusIcon" size={18} />
            Add News Post
          </button>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 && !isAdding ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <Icon name="NewspaperIcon" size={48} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium mb-1">No news posts yet</p>
          <p className="text-xs text-muted-foreground">Click &quot;Add News Post&quot; to create your first update.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                {/* Cover Image */}
                <div className="w-full aspect-[16/9] overflow-hidden bg-muted border-b border-border">
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  {/* Tag & Date */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${tagColors[post.tag] || 'bg-gray-100 text-gray-600'}`}>
                      {post.tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatForDisplay(post.date)}</span>
                  </div>
                  {/* Title */}
                  <h3 className="font-bold text-sm text-foreground mb-1.5 line-clamp-2">{post.title}</h3>
                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2 border-t border-border px-4 py-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
                >
                  <Icon name="PencilIcon" size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"
                >
                  <Icon name="TrashIcon" size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
