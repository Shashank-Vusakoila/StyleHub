'use client';
import { useCallback } from 'react';
import { trackClick } from '../lib/firestore';

/**
 * Returns a handler that tracks the click in Firestore,
 * then opens the affiliate link in a new tab.
 */
export function useAffiliateClick({ postId, postSlug, productId, productName, affiliateLink }) {
  return useCallback(async (e) => {
    if (e) e.preventDefault();
    try {
      await trackClick({ postId, postSlug, productId, productName, affiliateLink });
    } catch (_) {
      // never block navigation on analytics failure
    }
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  }, [postId, postSlug, productId, productName, affiliateLink]);
}
