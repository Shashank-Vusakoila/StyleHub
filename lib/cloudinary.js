/**
 * Cloudinary Image Upload — Client Side (Unsigned Upload)
 * ─────────────────────────────────────────────────────────
 * Uses an UNSIGNED upload preset so no API secret is ever
 * exposed. The cloud name and preset are public-safe values.
 *
 * Setup (one-time, 2 minutes):
 * 1. Sign up free at cloudinary.com
 * 2. Dashboard → Settings → Upload → Upload Presets
 * 3. Click "Add upload preset"
 *    - Signing Mode: Unsigned
 *    - Folder: stylehub-decors   (optional, keeps things tidy)
 *    - Save → copy the preset name
 * 4. Add to .env.local:
 *      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
 */

const CLOUD_NAME     = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET  = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a File object to Cloudinary.
 * @param {File}     file        — the image file
 * @param {string}   folder      — subfolder e.g. 'posts' | 'products'
 * @param {function} onProgress  — optional (0–100)
 * @returns {Promise<string>}    — secure HTTPS URL of the uploaded image
 */
export function uploadToCloudinary(file, folder = 'stylehub-decors', onProgress) {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error(
        'Missing Cloudinary env vars.\n' +
        'Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and ' +
        'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local'
      ));
      return;
    }

    const formData = new FormData();
    formData.append('file',           file);
    formData.append('upload_preset',  UPLOAD_PRESET);
    formData.append('folder',         folder);
    // Auto-generate a clean filename
    formData.append('public_id',      `${Date.now()}_${Math.random().toString(36).slice(2)}`);

    const xhr = new XMLHttpRequest();
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    xhr.open('POST', url, true);

    // Progress tracking
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        // Always return the secure HTTPS URL
        resolve(data.secure_url);
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(new Error(err.error?.message || 'Cloudinary upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

/**
 * Delete an image from Cloudinary.
 * Note: deletion requires your API secret (server-side only).
 * For a free project, we skip server-side deletion —
 * old images are cleaned up automatically after 30 days
 * on the free tier, or manually via the Cloudinary dashboard.
 *
 * If you want programmatic deletion later, create a Next.js
 * API route at /api/cloudinary/delete that uses the
 * cloudinary SDK with your API_SECRET (never expose in client).
 */
export async function deleteFromCloudinary(publicId) {
  // Client-side deletion not possible without exposing API_SECRET.
  // Log a note for manual cleanup via Cloudinary dashboard.
  console.info('[Cloudinary] Image marked for manual deletion:', publicId);
}

/**
 * Extract the public_id from a Cloudinary URL.
 * Useful if you later add server-side deletion.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v1/stylehub-decors/abc.jpg"
 *   → "stylehub-decors/abc"
 */
export function getPublicId(cloudinaryUrl) {
  try {
    const url    = new URL(cloudinaryUrl);
    const parts  = url.pathname.split('/upload/');
    if (parts.length < 2) return null;
    // Strip version prefix (v1234567890/) and extension
    const path   = parts[1].replace(/^v\d+\//, '');
    return path.replace(/\.[^.]+$/, '');
  } catch {
    return null;
  }
}

/**
 * Returns an optimised Cloudinary URL with transformations.
 * Great for automatic WebP conversion + resize.
 *
 * @param {string} url        — original Cloudinary URL
 * @param {object} opts
 *   - w:  width  (default 800)
 *   - h:  height (optional)
 *   - q:  quality (default 'auto')
 *   - f:  format  (default 'auto' → serves WebP to supported browsers)
 * @returns {string} — optimised URL
 *
 * Example:
 *   optimiseUrl(url, { w: 600, h: 800 })
 *   → https://res.cloudinary.com/.../c_fill,f_auto,q_auto,w_600,h_800/...
 */
export function optimiseUrl(url, { w = 800, h = null, q = 'auto', f = 'auto' } = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  const transforms = ['c_fill', `f_${f}`, `q_${q}`, `w_${w}`];
  if (h) transforms.push(`h_${h}`);
  const transform = transforms.join(',');
  return url.replace('/upload/', `/upload/${transform}/`);
}
