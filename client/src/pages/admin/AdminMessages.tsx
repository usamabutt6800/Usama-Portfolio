// src/pages/admin/AdminMessages.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiTrash2, FiCheck, FiSend, FiInbox, FiClock } from 'react-icons/fi';
import { contactAPI } from '@/services/api';
import { ContactMessage } from '@/types';
import { formatDate } from '@/utils';
import { cn } from '@/utils';

const AdminMessages = () => {
  const [messages, setMessages]     = useState<ContactMessage[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<ContactMessage | null>(null);
  const [replyText, setReplyText]   = useState('');
  const [replying, setReplying]     = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await contactAPI.getAll();
      setMessages(res.data.messages);
    } catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  // Open a message and mark as read
  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    setReplyText('');
    if (!msg.isRead) {
      try {
        await contactAPI.markRead(msg._id);
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch { /* silent */ }
    }
  };

  // Send reply
  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setReplying(true);
    try {
      await contactAPI.reply(selected._id, replyText.trim());
      toast.success(`Reply sent to ${selected.name}! ✅`);
      // Update local state
      const updated = { ...selected, reply: replyText.trim(), repliedAt: new Date().toISOString() };
      setSelected(updated as ContactMessage);
      setMessages(prev => prev.map(m => m._id === selected._id ? updated as ContactMessage : m));
      setReplyText('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to send reply. Check email settings in .env');
    } finally { setReplying(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactAPI.delete(id);
      toast.success('Deleted');
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch { toast.error('Failed to delete'); }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen p-6" style={{ background: '#0f0f1a' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Messages</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono text-white"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }}>
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Message List ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3"
                style={{ color: 'rgba(255,255,255,0.2)' }}>
                <FiInbox size={36} />
                <p className="font-body text-sm">No messages yet</p>
              </div>
            ) : (
              messages.map(msg => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => openMessage(msg)}
                  className="p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: selected?._id === msg._id
                      ? 'rgba(108,99,255,0.1)'
                      : 'rgba(255,255,255,0.04)',
                    border: selected?._id === msg._id
                      ? '1px solid rgba(108,99,255,0.3)'
                      : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: '#6c63ff' }} />
                      )}
                      <span className={cn(
                        'font-body text-sm truncate',
                        msg.isRead ? 'text-white/50' : 'text-white font-medium'
                      )}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs flex-shrink-0"
                      style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="font-body text-xs mt-1 truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {msg.subject}
                  </p>
                  {/* Replied indicator */}
                  {msg.reply && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <FiCheck size={10} className="text-green-400" />
                      <span className="font-mono text-xs text-green-400">Replied</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* ── Message Detail + Reply ───────────────────────────────────── */}
          <div className="lg:col-span-3">
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Message Header */}
                <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-white mb-1">
                        {selected.subject}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {selected.name}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                        <a href={`mailto:${selected.email}`}
                          className="font-mono text-sm transition-colors"
                          style={{ color: '#6c63ff' }}>
                          {selected.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 font-mono text-xs"
                        style={{ color: 'rgba(255,255,255,0.2)' }}>
                        <FiClock size={11} />
                        {formatDate(selected.createdAt)}
                      </div>
                    </div>
                    {/* Actions */}
                    <button onClick={() => handleDelete(selected._id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Original Message */}
                <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="font-body text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {selected.message}
                  </p>
                </div>

                {/* Previous Reply (if exists) */}
                {selected.reply && (
                  <div className="p-6" style={{ background: 'rgba(108,99,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <FiCheck size={14} className="text-green-400" />
                      <span className="font-mono text-xs text-green-400 uppercase tracking-wider">
                        Your Reply — {selected.repliedAt ? formatDate(selected.repliedAt) : ''}
                      </span>
                    </div>
                    <p className="font-body text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {selected.reply}
                    </p>
                  </div>
                )}

                {/* Reply Box */}
                <div className="p-6">
                  <label className="font-mono text-xs uppercase tracking-wider mb-3 block"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {selected.reply ? 'Send Another Reply' : `Reply to ${selected.name}`}
                  </label>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Write your reply to ${selected.name}...`}
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-sm font-body resize-none focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                    }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(108,99,255,0.5)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      Will be sent to: <span style={{ color: '#6c63ff' }}>{selected.email}</span>
                    </p>
                    <button
                      onClick={handleReply}
                      disabled={replying || !replyText.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: replying || !replyText.trim()
                          ? 'rgba(255,255,255,0.08)'
                          : 'linear-gradient(135deg, #6c63ff, #a855f7)',
                        color: replying || !replyText.trim() ? 'rgba(255,255,255,0.3)' : 'white',
                        cursor: replying || !replyText.trim() ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {replying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend size={14} />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl flex flex-col items-center justify-center p-16 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <FiMail size={36} style={{ color: 'rgba(255,255,255,0.1)' }} className="mb-3" />
                <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Select a message to read and reply
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
