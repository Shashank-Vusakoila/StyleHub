'use client';
import { useState, useEffect } from 'react';
import { listenToPosts, deletePost, updatePost, getAnalyticsSummary } from '../../lib/firestore';
import PostForm from './PostForm';

const TABS = ['Posts', 'New Post', 'Analytics'];

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('Posts');
  const [posts,     setPosts]     = useState([]);
  const [editPost,  setEditPost]  = useState(null);
  const [deleting,  setDeleting]  = useState(null);
  const [toast,     setToast]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!user) return; // only listen when authenticated
    const unsub = listenToPosts(setPosts);
    return unsub;
  }, [user]);

  useEffect(() => {
    if (activeTab === 'Analytics' && !analytics) {
      getAnalyticsSummary().then(setAnalytics).catch(() => {});
    }
  }, [activeTab, analytics]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await deletePost(id);
      showToast('Post deleted successfully');
    } catch { showToast('Failed to delete post', 'error'); }
    setDeleting(null);
  }

  async function handleToggleFeatured(post) {
    try {
      await updatePost(post.id, { featured: !post.featured });
      showToast(`Post ${!post.featured ? 'featured' : 'unfeatured'}`);
    } catch { showToast('Failed to update', 'error'); }
  }

  const filtered = posts.filter(p => {
    const matchQ = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchC = filter === 'all' || p.category === filter;
    return matchQ && matchC;
  });

  if (editPost) {
    return (
      <div className="p-6 md:p-8">
        <button suppressHydrationWarning onClick={() => setEditPost(null)}
          className="flex items-center gap-2 font-sans text-sm font-300 text-ink-muted
            hover:text-ink mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Posts
        </button>
        <PostForm
          initial={editPost}
          mode="edit"
          onSave={() => { setEditPost(null); showToast('Post updated!'); }}
          onCancel={() => setEditPost(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] px-5 py-3 rounded-2xl shadow-soft-md
          font-sans text-sm font-400 flex items-center gap-3 animate-fade-up
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="eyebrow mb-2">
            <span className="eyebrow-line" /><span className="eyebrow-text">Content</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink font-300"
            style={{ fontStyle:'italic', letterSpacing:'-0.01em' }}>
            Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-cream-300 rounded-2xl p-1">
          {TABS.map(t => (
            <button suppressHydrationWarning key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl font-sans text-sm font-300 transition-all duration-200
                ${activeTab === t ? 'bg-white text-green shadow-soft font-400' : 'text-ink-muted hover:text-ink'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── POSTS TAB ── */}
      {activeTab === 'Posts' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { l:'Total Posts',     v: posts.length,                              emoji:'📄' },
              { l:'Fashion Posts',   v: posts.filter(p=>p.category==='fashion').length,    emoji:'👗' },
              { l:'Decor Posts',     v: posts.filter(p=>p.category==='home-decor').length, emoji:'🏡' },
              { l:'Featured',        v: posts.filter(p=>p.featured).length,        emoji:'⭐' },
            ].map(({ l, v, emoji }) => (
              <div key={l} className="bg-white rounded-2xl p-4 border border-ink/5 shadow-soft">
                <div className="text-xl mb-1">{emoji}</div>
                <div className="font-display text-2xl text-green font-300">{v}</div>
                <div className="font-sans text-xs font-300 text-ink-muted mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="relative flex-1 min-w-[160px]">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search posts..." className="input-cream pl-10" />
            </div>
            <div className="flex gap-2">
              {[['all','All'],['fashion','Fashion'],['home-decor','Decor']].map(([v,l]) => (
                <button suppressHydrationWarning key={v} onClick={() => setFilter(v)}
                  className={`font-sans text-xs font-400 px-4 py-2.5 rounded-pill border transition-all
                    ${filter === v
                      ? 'bg-green text-cream-50 border-green'
                      : 'border-ink/10 text-ink-muted hover:border-green/30'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-ink/6 overflow-hidden shadow-soft">
            <div className="hidden md:grid grid-cols-[1fr_100px_70px_80px_120px] gap-4
              px-6 py-3 border-b border-ink/5 bg-cream-100">
              {['Post','Category','Items','Featured','Actions'].map(h => (
                <span key={h} className="font-sans text-[9px] font-500 tracking-widest uppercase text-ink-faint">{h}</span>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-xl text-ink/30 font-300" style={{ fontStyle:'italic' }}>
                  {search ? 'No results found' : 'No posts yet'}
                </p>
                <p className="font-sans text-sm font-300 text-ink-faint mt-2">
                  {!search && 'Click "New Post" to get started'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-ink/4">
                {filtered.map(post => (
                  <div key={post.id}
                    className="flex flex-col md:grid md:grid-cols-[1fr_100px_70px_80px_120px]
                      gap-3 md:gap-4 px-5 py-4 hover:bg-cream-100/50 transition-colors">

                    <div className="min-w-0">
                      <p className="font-sans text-sm font-500 text-ink truncate">{post.title}</p>
                      <p className="font-sans text-xs font-300 text-ink-faint truncate mt-0.5">
                        /{post.category}/{post.slug}
                      </p>
                    </div>

                    <div className="flex md:items-center">
                      <span className={`font-sans text-[9.5px] font-400 tracking-wide rounded-pill px-2.5 py-1 border
                        ${post.category === 'fashion'
                          ? 'bg-pink-50 text-pink-700 border-pink-200'
                          : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                        {post.category === 'fashion' ? '👗 Fashion' : '🏡 Decor'}
                      </span>
                    </div>

                    <div className="flex md:items-center font-sans text-sm text-ink-muted font-300">
                      {post.productCount || 0}
                    </div>

                    <div className="flex md:items-center">
                      <button suppressHydrationWarning onClick={() => handleToggleFeatured(post)}
                        className={`w-10 h-5 rounded-pill border relative transition-all duration-300
                          ${post.featured ? 'bg-green border-green' : 'bg-ink/5 border-ink/15'}`}
                        title={post.featured ? 'Remove from featured' : 'Mark featured'}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300
                          ${post.featured ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <a href={`/${post.category}/${post.slug}`} target="_blank" rel="noopener"
                        className="p-2 rounded-lg text-ink-faint hover:text-ink hover:bg-ink/5 transition-all"
                        title="Preview">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </a>
                      <button suppressHydrationWarning onClick={() => setEditPost(post)}
                        className="p-2 rounded-lg text-ink-faint hover:text-green hover:bg-green/5 transition-all"
                        title="Edit">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button suppressHydrationWarning
                        onClick={() => { if (confirm('Delete this post?')) handleDelete(post.id); }}
                        disabled={deleting === post.id}
                        className="p-2 rounded-lg text-ink-faint hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50"
                        title="Delete">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── NEW POST TAB ── */}
      {activeTab === 'New Post' && (
        <PostForm
          mode="create"
          onSave={() => { setActiveTab('Posts'); showToast('Post published!'); }}
          onCancel={() => setActiveTab('Posts')}
        />
      )}

      {/* ── ANALYTICS TAB ── */}
      {activeTab === 'Analytics' && (
        <div>
          {!analytics ? (
            <div className="flex items-center justify-center py-16 gap-3 text-ink-muted">
              <div className="w-5 h-5 rounded-full border-2 border-green/20 border-t-green animate-spin" />
              <span className="font-sans text-sm font-300">Loading analytics...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-ink/5">
                  <p className="font-sans text-[10px] font-500 tracking-widest uppercase text-green mb-2">Total Clicks</p>
                  <p className="font-display text-4xl text-ink font-300">{analytics.totalClicks}</p>
                  <p className="font-sans text-xs font-300 text-ink-faint mt-1">Affiliate link clicks</p>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-ink/5">
                  <p className="font-sans text-[10px] font-500 tracking-widest uppercase text-green mb-2">Total Views</p>
                  <p className="font-display text-4xl text-ink font-300">{analytics.totalViews}</p>
                  <p className="font-sans text-xs font-300 text-ink-faint mt-1">Post page views</p>
                </div>
              </div>

              {/* Top products */}
              {analytics.topProducts.length > 0 && (
                <div className="bg-white rounded-3xl border border-ink/5 overflow-hidden shadow-soft">
                  <div className="px-6 py-4 border-b border-ink/5">
                    <p className="font-sans text-sm font-500 text-ink">Top Clicked Products</p>
                  </div>
                  {analytics.topProducts.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between px-6 py-3 border-b border-ink/4 last:border-0">
                      <span className="font-sans text-sm font-300 text-ink truncate">{name}</span>
                      <span className="font-sans text-sm font-500 text-green shrink-0 ml-4">{count} clicks</span>
                    </div>
                  ))}
                </div>
              )}

              {analytics.totalClicks === 0 && analytics.totalViews === 0 && (
                <div className="py-12 text-center">
                  <p className="font-serif text-xl text-ink/30 font-300" style={{ fontStyle:'italic' }}>
                    No data yet
                  </p>
                  <p className="font-sans text-sm font-300 text-ink-faint mt-2">
                    Analytics will appear once users visit and click
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
