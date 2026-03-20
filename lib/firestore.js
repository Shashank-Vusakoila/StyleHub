import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Collection refs ────────────────────────────
const postsRef      = () => collection(db, 'posts');
const productsRef   = (postId) => collection(db, 'posts', postId, 'products');
const analyticsRef  = () => collection(db, 'analytics');

// ─── POSTS ──────────────────────────────────────

/** Fetch all published posts, sorted by createdAt desc */
export async function getPosts({ category = null, featuredOnly = false, max = 50 } = {}) {
  let q = query(postsRef(), orderBy('createdAt', 'desc'), limit(max));
  if (category) q = query(postsRef(), where('category', '==', category), orderBy('createdAt', 'desc'));
  if (featuredOnly) q = query(postsRef(), where('featured', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Fetch a single post by slug */
export async function getPostBySlug(slug) {
  const q = query(postsRef(), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/** Fetch a single post by ID */
export async function getPostById(id) {
  const snap = await getDoc(doc(db, 'posts', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/** Create a new post */
export async function createPost(data) {
  const ref = await addDoc(postsRef(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an existing post */
export async function updatePost(id, data) {
  await updateDoc(doc(db, 'posts', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a post and all its products */
export async function deletePost(id) {
  const batch = writeBatch(db);
  // delete products subcollection
  const prodSnap = await getDocs(productsRef(id));
  prodSnap.docs.forEach(d => batch.delete(d.ref));
  batch.delete(doc(db, 'posts', id));
  await batch.commit();
}

/** Real-time posts listener for admin */
export function listenToPosts(callback) {
  const q = query(postsRef(), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── PRODUCTS ───────────────────────────────────

/** Fetch all products for a post */
export async function getProducts(postId) {
  const q = query(productsRef(postId), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Add a product to a post */
export async function addProduct(postId, data) {
  const ref = await addDoc(productsRef(postId), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update a product */
export async function updateProduct(postId, productId, data) {
  await updateDoc(doc(db, 'posts', postId, 'products', productId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a product */
export async function deleteProduct(postId, productId) {
  await deleteDoc(doc(db, 'posts', postId, 'products', productId));
}

/** Real-time product listener */
export function listenToProducts(postId, callback) {
  const q = query(productsRef(postId), orderBy('order', 'asc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── ANALYTICS ──────────────────────────────────

/** Track an affiliate link click */
export async function trackClick({ postId, postSlug, productId, productName, affiliateLink }) {
  await addDoc(analyticsRef(), {
    type: 'click',
    postId,
    postSlug,
    productId,
    productName,
    affiliateLink,
    timestamp: serverTimestamp(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    referrer:  typeof document  !== 'undefined' ? document.referrer  : '',
  });
}

/** Track a post view */
export async function trackView(postId, postSlug) {
  await addDoc(analyticsRef(), {
    type: 'view',
    postId,
    postSlug,
    timestamp: serverTimestamp(),
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  });
}

/** Fetch analytics summary for admin dashboard */
export async function getAnalyticsSummary() {
  const snap = await getDocs(analyticsRef());
  const all = snap.docs.map(d => d.data());
  const clicks = all.filter(a => a.type === 'click');
  const views  = all.filter(a => a.type === 'view');

  const byProduct = clicks.reduce((acc, c) => {
    const key = c.productName || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byPost = views.reduce((acc, v) => {
    const key = v.postSlug || v.postId || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    totalClicks: clicks.length,
    totalViews:  views.length,
    topProducts: Object.entries(byProduct).sort((a,b) => b[1]-a[1]).slice(0, 10),
    topPosts:    Object.entries(byPost).sort((a,b) => b[1]-a[1]).slice(0, 10),
  };
}
