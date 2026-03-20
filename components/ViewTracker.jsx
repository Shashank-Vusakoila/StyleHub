'use client';
import { useEffect, useRef } from 'react';
import { trackView } from '../lib/firestore';

/**
 * Invisible client component that fires a single view event.
 * Drop this anywhere inside a server-rendered page.
 */
export default function ViewTracker({ postId, postSlug }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!postId || fired.current) return;
    fired.current = true;
    trackView(postId, postSlug).catch(() => {});
  }, [postId, postSlug]);

  return null; // renders nothing
}
