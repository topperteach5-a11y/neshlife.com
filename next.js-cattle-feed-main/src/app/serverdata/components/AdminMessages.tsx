'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/Appicon';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true })
      });
    } catch {
      fetchMessages();
    }
  };

  const deleteMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
    } catch {
      fetchMessages();
    }
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) markAsRead(msg.id);
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    return true;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      product: { text: 'Product Inquiry', color: 'bg-blue-100 text-blue-700' },
      order: { text: 'Order Support', color: 'bg-green-100 text-green-700' },
      dealer: { text: 'Become a Dealer', color: 'bg-purple-100 text-purple-700' },
      other: { text: 'Other', color: 'bg-gray-100 text-gray-600' },
      General: { text: 'General', color: 'bg-gray-100 text-gray-600' },
    };
    return labels[subject] || { text: subject || 'General', color: 'bg-gray-100 text-gray-600' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Customer Messages</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Message List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Message List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon name="EnvelopeIcon" size={24} className="text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground text-sm">No messages</p>
              <p className="text-xs text-muted-foreground mt-1">
                {filter === 'unread' ? 'All messages have been read.' : 'No messages received yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filteredMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                    selectedMessage?.id === msg.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  } ${!msg.isRead ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !msg.isRead ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <span className={`text-xs font-bold ${!msg.isRead ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                          {msg.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${!msg.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                          {msg.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {msg.message || msg.subject || 'No message'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDate(msg.createdAt)}
                      </span>
                      {!msg.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Message Detail */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-border overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Detail Header */}
              <div className="px-6 py-4 border-b border-border flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-base">{selectedMessage.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedMessage.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Icon name="TrashIcon" size={16} />
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-5">
                {/* Meta info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedMessage.phone ? (
                        <a href={`tel:${selectedMessage.phone}`} className="hover:text-primary transition-colors">
                          {selectedMessage.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not provided</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Subject</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getSubjectLabel(selectedMessage.subject).color}`}>
                      {getSubjectLabel(selectedMessage.subject).text}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Received</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-border" />

                {/* Message body */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</p>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message || 'No message content.'}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    <Icon name="EnvelopeIcon" size={14} />
                    Reply via Email
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-md text-sm font-semibold hover:bg-border transition-colors"
                    >
                      <Icon name="PhoneIcon" size={14} />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon name="EnvelopeOpenIcon" size={28} className="text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground text-sm">Select a message</p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Click on a customer message from the list to view full details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
