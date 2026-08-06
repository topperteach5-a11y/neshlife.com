'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/Appicon';

export default function AdminSettings() {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setInstagramUrl(data.instagramUrl || '');
      }
    } catch (e) {
      console.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramUrl })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (e) {
      alert('Network error while saving');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">Global Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage social links and global website configuration.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-6 space-y-6">
          
          <div>
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="LinkIcon" size={18} className="text-primary" />
              Social Media Links
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Instagram Profile URL</label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground sm:text-sm">
                  URL
                </span>
                <input
                  type="url"
                  required
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/your_username"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-border focus:outline-none focus:border-primary text-sm transition-colors"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                This link will be used for the Instagram button in the footer across all pages.
              </p>
            </div>
          </div>
          
        </div>
        
        <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
          <div>
            {success && (
              <span className="text-sm font-semibold text-green-600 flex items-center gap-1.5 animate-in fade-in">
                <Icon name="CheckCircleIcon" size={16} />
                Settings saved successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-md hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
