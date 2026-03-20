'use client';
import { useState } from 'react';
import { createPost, updatePost, addProduct, updateProduct, deleteProduct, getProducts } from '../../lib/firestore';
import { uploadToCloudinary } from '../../lib/cloudinary';

const EMPTY_PRODUCT = {
  name:'', description:'', image:'', price:'', originalPrice:'',
  rating:4.5, reviewCount:0, badge:'', highlight:'',
  features:['','','',''], affiliateLink:'', primeEligible:true, order:0,
};
const BADGES = ["Amazon's Choice","Best Seller","Trending","Top Pick","Editor's Pick",""];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();
}

// ── Reusable image upload button ─────────────────────────
function ImageUploadField({ value, onChange, label, folder }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    // Validate file type + size
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024)   { setError('Image must be under 10MB');     return; }
    setError(''); setUploading(true); setProgress(0);
    try {
      const url = await uploadToCloudinary(file, folder, setProgress);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed. Check Cloudinary env vars.');
    } finally { setUploading(false); setProgress(0); }
  }

  return (
    <div>
      <label className={LabelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          className={InputClass + ' flex-1'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste URL or upload ↓"
        />
        <label className={`relative cursor-pointer inline-flex items-center gap-2 px-4 py-3 rounded-2xl
          border border-green/30 text-green font-sans text-xs font-400 transition-all
          hover:bg-green/5 shrink-0 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              {progress}%
            </span>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              Upload
            </>
          )}
          <input type="file" accept="image/*" className="sr-only"
            onChange={e => handleFile(e.target.files[0])} />
        </label>
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="mt-2 h-1 bg-cream-300 rounded-full overflow-hidden">
          <div className="h-full bg-green rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Preview */}
      {value && !uploading && (
        <div className="mt-2 flex items-center gap-2">
          <img src={value} alt="preview"
            className="w-10 h-10 rounded-xl object-cover border border-ink/8" />
          <span className="font-sans text-[10px] font-300 text-ink-muted truncate flex-1">
            {value.includes('cloudinary.com') ? '✓ Uploaded to Cloudinary' : value}
          </span>
          <button suppressHydrationWarning type="button" onClick={() => onChange('')}
            className="text-ink-faint hover:text-rose-500 transition-colors text-sm">✕</button>
        </div>
      )}

      {error && <p className="mt-1 font-sans text-xs text-rose-500">{error}</p>}
    </div>
  );
}

const InputClass  = 'w-full bg-cream-200 border border-ink/8 rounded-2xl px-4 py-3 font-sans text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green/40 focus:ring-2 focus:ring-green/8 transition-all';
const LabelClass  = 'block font-sans text-[9.5px] font-500 tracking-widest uppercase text-green mb-2';

// ── Main Form ─────────────────────────────────────────────
export default function PostForm({ initial = {}, mode = 'create', onSave, onCancel }) {
  const [saving,   setSaving]   = useState(false);
  const [tab,      setTab]      = useState('info');
  const [error,    setError]    = useState('');

  const [form, setForm] = useState({
    title:'', slug:'', category:'fashion', excerpt:'', intro:'', ending:'',
    coverImage:'', tags:'', seoTitle:'', seoDescription:'',
    featured: false,
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
  });

  const [products, setProducts] = useState(
    (initial.products || []).length > 0
      ? initial.products
      : [{ ...EMPTY_PRODUCT, id: `_new_0` }]
  );

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Product helpers ──
  const addProd = () =>
    setProducts(ps => [...ps, { ...EMPTY_PRODUCT, id: `_new_${Date.now()}`, order: ps.length }]);

  const removeProd = (idx) =>
    setProducts(ps => ps.filter((_, i) => i !== idx));

  const setPF = (idx, k, v) =>
    setProducts(ps => ps.map((p, i) => i === idx ? { ...p, [k]: v } : p));

  const setFeat = (pIdx, fIdx, v) =>
    setProducts(ps => ps.map((p, i) => {
      if (i !== pIdx) return p;
      const feats = [...(p.features || ['','','',''])];
      feats[fIdx] = v;
      return { ...p, features: feats };
    }));

  // ── Submit ──
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title) { setError('Title is required'); return; }
    if (!form.slug)  { setError('Slug is required');  return; }
    setSaving(true); setError('');

    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        productCount: products.length,
      };

      let postId = initial.id;

      if (mode === 'create') {
        postId = await createPost(payload);
        // Add all products
        for (let i = 0; i < products.length; i++) {
          const prod = { ...products[i], order: i };
          delete prod.id;
          prod.rating      = parseFloat(prod.rating)      || 0;
          prod.reviewCount = parseInt(prod.reviewCount)   || 0;
          prod.features    = (prod.features || []).filter(Boolean);
          await addProduct(postId, prod);
        }
        await updatePost(postId, { productCount: products.length });

      } else {
        // Edit mode
        await updatePost(postId, payload);
        const existing    = await getProducts(postId);
        const existingIds = existing.map(p => p.id);

        for (const prod of products) {
          const clean = { ...prod };
          delete clean.id;
          clean.rating      = parseFloat(clean.rating)      || 0;
          clean.reviewCount = parseInt(clean.reviewCount)   || 0;
          clean.features    = (clean.features || []).filter(Boolean);

          if (prod.id && !prod.id.startsWith('_new_') && existingIds.includes(prod.id)) {
            await updateProduct(postId, prod.id, clean);
          } else {
            await addProduct(postId, clean);
          }
        }
        // Delete removed products
        for (const ep of existing) {
          if (!products.find(p => p.id === ep.id)) {
            await deleteProduct(postId, ep.id);
          }
        }
      }

      onSave && onSave(postId);
    } catch (err) {
      setError(err.message || 'Save failed. Check console for details.');
      console.error('[PostForm]', err);
    } finally { setSaving(false); }
  }

  const TABS = [
    { id: 'info',    label: 'Post Info' },
    { id: 'seo',     label: 'SEO' },
    { id: 'products',label: `Products (${products.length})` },
  ];

  return (
    <form onSubmit={handleSubmit}>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 bg-cream-300 rounded-2xl p-1 w-fit">
        {TABS.map(t => (
          <button suppressHydrationWarning key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-xl font-sans text-sm transition-all duration-200
              ${tab === t.id
                ? 'bg-white text-green shadow-soft font-500'
                : 'text-ink-muted font-300 hover:text-ink'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── INFO TAB ── */}
      {tab === 'info' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <label className={LabelClass}>Post Title *</label>
              <input className={InputClass} value={form.title} required
                onChange={e => {
                  setF('title', e.target.value);
                  if (mode === 'create') setF('slug', slugify(e.target.value));
                }}
                placeholder="Aesthetic Room Setup Under ₹2000" />
            </div>

            <div>
              <label className={LabelClass}>URL Slug *</label>
              <input className={InputClass} value={form.slug} required
                onChange={e => setF('slug', slugify(e.target.value))}
                placeholder="room-setup-under-2000" />
              <p className="font-sans text-[10px] font-300 text-ink-faint mt-1">
                /{form.category}/{form.slug}
              </p>
            </div>

            <div>
              <label className={LabelClass}>Category *</label>
              <select suppressHydrationWarning className={InputClass} value={form.category}
                onChange={e => setF('category', e.target.value)}>
                <option value="fashion">👗 Fashion</option>
                <option value="home-decor">🏡 Home Decor</option>
              </select>
            </div>

            {/* Cover image with Cloudinary upload */}
            <div className="md:col-span-2">
              <ImageUploadField
                label="Cover Image *"
                value={form.coverImage}
                onChange={v => setF('coverImage', v)}
                folder="stylehub-decors/covers"
              />
            </div>

            <div className="md:col-span-2">
              <label className={LabelClass}>Excerpt (shown on cards)</label>
              <textarea suppressHydrationWarning className={InputClass} rows={2} value={form.excerpt}
                onChange={e => setF('excerpt', e.target.value)}
                placeholder="Short hook that makes people click..." />
            </div>

            <div className="md:col-span-2">
              <label className={LabelClass}>Intro Paragraph (money page top)</label>
              <textarea suppressHydrationWarning className={InputClass} rows={4} value={form.intro}
                onChange={e => setF('intro', e.target.value)}
                placeholder="Engaging opening paragraph..." />
            </div>

            <div className="md:col-span-2">
              <label className={LabelClass}>Verdict / Ending</label>
              <textarea suppressHydrationWarning className={InputClass} rows={3} value={form.ending}
                onChange={e => setF('ending', e.target.value)}
                placeholder="Summary shown at bottom of the post..." />
            </div>

            <div>
              <label className={LabelClass}>Tags (comma-separated)</label>
              <input className={InputClass} value={form.tags}
                onChange={e => setF('tags', e.target.value)}
                placeholder="fashion, under 999, amazon finds" />
            </div>

            <div className="flex items-center gap-3 bg-cream-200 border border-ink/8 rounded-2xl
              px-4 py-3.5 cursor-pointer select-none mt-5"
              onClick={() => setF('featured', !form.featured)}>
              <div className={`w-10 h-5 rounded-pill relative transition-all duration-300
                ${form.featured ? 'bg-green' : 'bg-ink/10'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow
                  transition-all duration-300
                  ${form.featured ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="font-sans text-sm font-300 text-ink">
                Featured on Homepage {form.featured ? '⭐' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── SEO TAB ── */}
      {tab === 'seo' && (
        <div className="space-y-4">
          {/* Live preview */}
          <div className="bg-cream-200 border border-ink/8 rounded-2xl p-4">
            <p className="font-sans text-[9px] font-500 tracking-widest uppercase text-green mb-2">
              Google Preview
            </p>
            <p className="font-sans text-sm text-blue-600 font-400">
              {form.seoTitle || form.title || 'Post Title Here'}
            </p>
            <p className="font-sans text-[11px] text-green-muted text-green/70">
              stylehubdecors.co/{form.category}/{form.slug}
            </p>
            <p className="font-sans text-xs text-ink-muted mt-1">
              {form.seoDescription || form.excerpt || 'Meta description will appear here...'}
            </p>
          </div>

          <div>
            <label className={LabelClass}>SEO Title <span className="normal-case text-ink-faint">(max 60 chars)</span></label>
            <input className={InputClass} value={form.seoTitle}
              onChange={e => setF('seoTitle', e.target.value)}
              placeholder={form.title} maxLength={60} />
            <p className="font-sans text-[10px] text-ink-faint mt-1">
              {(form.seoTitle || '').length}/60
            </p>
          </div>

          <div>
            <label className={LabelClass}>Meta Description <span className="normal-case text-ink-faint">(max 160 chars)</span></label>
            <textarea suppressHydrationWarning className={InputClass} rows={3} value={form.seoDescription}
              onChange={e => setF('seoDescription', e.target.value)}
              placeholder={form.excerpt} maxLength={160} />
            <p className="font-sans text-[10px] text-ink-faint mt-1">
              {(form.seoDescription || '').length}/160
            </p>
          </div>

          <ImageUploadField
            label="Pinterest Pin Image (2:3 ratio ideal — 600×900px)"
            value={form.pinImage || ''}
            onChange={v => setF('pinImage', v)}
            folder="stylehub-decors/pins"
          />
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === 'products' && (
        <div className="space-y-4">
          {products.map((prod, pIdx) => (
            <div key={prod.id || pIdx}
              className="bg-cream-200 border border-ink/8 rounded-3xl overflow-hidden">

              {/* Product header */}
              <div className="flex items-center justify-between px-5 py-3
                bg-white border-b border-ink/5">
                <span className="font-sans text-sm font-400 text-ink flex items-center gap-3">
                  <span className="font-display text-xl text-green/25 font-300"
                    style={{ fontStyle: 'italic' }}>
                    {String(pIdx + 1).padStart(2, '0')}
                  </span>
                  {prod.name || 'New Product'}
                </span>
                {products.length > 1 && (
                  <button suppressHydrationWarning type="button" onClick={() => removeProd(pIdx)}
                    className="font-sans text-xs font-300 text-rose-500 hover:text-rose-700 transition-colors">
                    ✕ Remove
                  </button>
                )}
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <label className={LabelClass}>Product Name *</label>
                  <input className={InputClass} value={prod.name} required
                    onChange={e => setPF(pIdx, 'name', e.target.value)}
                    placeholder="Wide-Leg Linen Trousers" />
                </div>

                {/* Product image with Cloudinary */}
                <div className="md:col-span-2">
                  <ImageUploadField
                    label="Product Image *"
                    value={prod.image}
                    onChange={v => setPF(pIdx, 'image', v)}
                    folder="stylehub-decors/products"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={LabelClass}>Description</label>
                  <textarea suppressHydrationWarning className={InputClass} rows={3} value={prod.description}
                    onChange={e => setPF(pIdx, 'description', e.target.value)}
                    placeholder="Benefit-focused 2–3 sentence description..." />
                </div>

                <div>
                  <label className={LabelClass}>Sale Price *</label>
                  <input className={InputClass} value={prod.price} required
                    onChange={e => setPF(pIdx, 'price', e.target.value)}
                    placeholder="₹599" />
                </div>

                <div>
                  <label className={LabelClass}>Original Price</label>
                  <input className={InputClass} value={prod.originalPrice}
                    onChange={e => setPF(pIdx, 'originalPrice', e.target.value)}
                    placeholder="₹1,299" />
                </div>

                <div>
                  <label className={LabelClass}>Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" className={InputClass}
                    value={prod.rating}
                    onChange={e => setPF(pIdx, 'rating', e.target.value)} />
                </div>

                <div>
                  <label className={LabelClass}>Review Count</label>
                  <input type="number" className={InputClass} value={prod.reviewCount}
                    onChange={e => setPF(pIdx, 'reviewCount', e.target.value)}
                    placeholder="3247" />
                </div>

                <div>
                  <label className={LabelClass}>Badge</label>
                  <select suppressHydrationWarning className={InputClass} value={prod.badge}
                    onChange={e => setPF(pIdx, 'badge', e.target.value)}>
                    {BADGES.map(b => <option key={b} value={b}>{b || '(none)'}</option>)}
                  </select>
                </div>

                <div>
                  <label className={LabelClass}>Highlight Text</label>
                  <input className={InputClass} value={prod.highlight}
                    onChange={e => setPF(pIdx, 'highlight', e.target.value)}
                    placeholder="#1 Best Seller" />
                </div>

                {/* Amazon affiliate link — the most important field */}
                <div className="md:col-span-2">
                  <label className={LabelClass}>
                    Amazon Affiliate Link *
                    <span className="ml-2 normal-case font-300 text-ink-faint">
                      — must include your Associate tag
                    </span>
                  </label>
                  <input className={InputClass} value={prod.affiliateLink} required
                    onChange={e => setPF(pIdx, 'affiliateLink', e.target.value)}
                    placeholder="https://www.amazon.in/dp/ASIN?tag=YOUR-TAG-21" />
                  {prod.affiliateLink && !prod.affiliateLink.includes('tag=') && (
                    <p className="font-sans text-[10px] text-amber-600 mt-1">
                      ⚠️ No affiliate tag detected. Add ?tag=YOUR-TAG-21 to earn commission.
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                  <label className={LabelClass}>Key Features (one per line)</label>
                  {[0, 1, 2, 3].map(fIdx => (
                    <input key={fIdx} className={`${InputClass} mb-2`}
                      value={(prod.features || [])[fIdx] || ''}
                      onChange={e => setFeat(pIdx, fIdx, e.target.value)}
                      placeholder={`Feature ${fIdx + 1}`} />
                  ))}
                </div>

                {/* Prime toggle */}
                <div className="flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => setPF(pIdx, 'primeEligible', !prod.primeEligible)}>
                  <div className={`w-9 h-5 rounded-pill relative transition-all duration-300
                    ${prod.primeEligible ? 'bg-green' : 'bg-ink/10'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow
                      transition-all duration-300
                      ${prod.primeEligible ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="font-sans text-sm font-300 text-ink">Prime Eligible</span>
                </div>

              </div>
            </div>
          ))}

          <button suppressHydrationWarning type="button" onClick={addProd}
            className="w-full py-4 rounded-3xl border-2 border-dashed border-ink/12
              font-sans text-sm font-300 text-ink-muted flex items-center justify-center gap-2
              hover:border-green/30 hover:text-green transition-all duration-200">
            <span className="text-xl leading-none">+</span>
            Add Another Product
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-5 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-3">
          <p className="font-sans text-sm text-rose-600">{error}</p>
        </div>
      )}

      {/* Submit row */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-ink/5">
        <button suppressHydrationWarning type="button" onClick={onCancel}
          className="px-7 py-3 rounded-2xl border border-ink/10 font-sans text-sm font-300
            text-ink-muted hover:text-ink hover:border-ink/20 transition-all">
          ← Cancel
        </button>
        <button suppressHydrationWarning type="submit" disabled={saving}
          className="btn-primary flex-1 md:flex-none justify-center px-10 py-3">
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Saving...
            </span>
          ) : mode === 'edit' ? '✓ Update Post' : '✓ Publish Post'}
        </button>
      </div>
    </form>
  );
}
