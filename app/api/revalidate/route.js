import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * On-demand revalidation endpoint.
 * Call this from your admin after publishing a post to immediately
 * refresh the static pages without waiting for the 60s ISR window.
 *
 * Usage:
 *   POST /api/revalidate
 *   Body: { "secret": "your_revalidate_secret", "path": "/fashion/my-slug" }
 *
 * Set REVALIDATE_SECRET in your environment variables.
 */
export async function POST(request) {
  try {
    const { secret, path } = await request.json();
    const expected = process.env.REVALIDATE_SECRET || 'luxe-revalidate-2025';

    if (secret !== expected) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (!path) {
      return NextResponse.json({ error: 'path is required' }, { status: 400 });
    }

    revalidatePath(path);
    revalidatePath('/');               // always refresh homepage too
    revalidatePath('/fashion');
    revalidatePath('/home-decor');

    return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
