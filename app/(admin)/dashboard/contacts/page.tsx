'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ContactSubmission } from '@/lib/types';
import { Mail, MailOpen, Trash2, X, Phone } from 'lucide-react';

export default function ContactsPage() {
  const supabase = createClient();

  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleOpen = async (item: ContactSubmission) => {
    setSelectedItem(item);
    if (!item.is_read) {
      await supabase
        .from('contact_submissions')
        .update({ is_read: true })
        .eq('id', item.id);
      setItems((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, is_read: true } : i)
      );
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (!error) {
      setDeleteId(null);
      if (selectedItem?.id === id) setSelectedItem(null);
      fetchItems();
    }
  };

  const filtered = items.filter((i) => {
    if (filter === 'unread') return !i.is_read;
    if (filter === 'read') return i.is_read;
    return true;
  });

  const unreadCount = items.filter((i) => !i.is_read).length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-gray-400 text-sm mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
              : 'All messages read'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'read'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition
              ${filter === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
          >
            {tab}
            {tab === 'unread' && unreadCount > 0 && (
              <span className="ml-2 bg-indigo-500/30 text-indigo-300 text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <Mail size={40} className="mb-3" />
          <p className="text-sm">No messages found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpen(item)}
              className={`group cursor-pointer bg-gray-900 border rounded-xl px-5 py-4 flex items-start justify-between gap-4 transition
                ${!item.is_read
                  ? 'border-indigo-500/40 hover:border-indigo-500/70'
                  : 'border-gray-800 hover:border-gray-700'
                }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`mt-0.5 shrink-0 ${!item.is_read ? 'text-indigo-400' : 'text-gray-600'}`}>
                  {item.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-medium truncate ${!item.is_read ? 'text-white' : 'text-gray-300'}`}>
                      {item.name}
                    </span>
                    {!item.is_read && (
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate">{item.email}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{item.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-gray-600 text-xs hidden sm:block">
                  {formatDate(item.created_at)}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                  className="text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold text-base">Message Detail</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Sender Info */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Name</span>
                  <span className="text-white text-sm font-medium">{selectedItem.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Email</span>
                  
                    href={`mailto:${selectedItem.email}`}
                    className="text-indigo-400 text-sm hover:underline"
                  >
                    {selectedItem.email}
                  </a>
                </div>
                {selectedItem.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Phone</span>
                    <div className="flex items-center gap-1.5 text-sm text-gray-300">
                      <Phone size={13} className="text-gray-500" />
                      {selectedItem.phone}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Received</span>
                  <span className="text-gray-300 text-sm">{formatDate(selectedItem.created_at)}</span>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-gray-500 text-xs mb-2">Message</p>
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap bg-gray-800/50 rounded-xl p-4">
                  {selectedItem.message}
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg px-4 py-2.5 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => { setDeleteId(selectedItem.id); setSelectedItem(null); }}
                  className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg px-4 py-2.5 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold text-base mb-2">Delete Message</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg px-4 py-2.5 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
