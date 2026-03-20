'use client';
import { useEffect, useRef } from 'react';
import { trackView } from '../lib/firestore';

/** Fires a single view event when the component mounts. */
export function usePostView(postId, postSlug) {
  const fired = useRef(false);
  useEffect(() => {
    if (!postId || fired.current) return;
    fired.current = true;
    trackView(postId, postSlug).catch(() => {});
  }, [postId, postSlug]);
}
