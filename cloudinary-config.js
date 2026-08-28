/* ============================================================
   MIIF — Cloudinary Image Hosting Configuration
   ============================================================ */

'use strict';

/**
 * Cloudinary Global Configuration
 * Replace 'YOUR_CLOUD_NAME' and 'YOUR_UPLOAD_PRESET' with your actual
 * Cloudinary credentials when ready.
 */
const CLOUDINARY_CONFIG = {
  // Your Cloudinary Account Cloud Name
  cloudName: 'YOUR_CLOUD_NAME',

  // Your Unsigned Upload Preset (optional, if implementing client-side uploads)
  uploadPreset: 'miif_unsigned_preset',

  // Default folder in Cloudinary storage
  folder: 'miif-festival',

  // Base CDN delivery URL pattern
  cdnBaseUrl: 'https://res.cloudinary.com/',

  // Default image optimization parameters (Auto format, Auto quality)
  defaultTransformations: 'f_auto,q_auto'
};

/**
 * Helper function to generate a fully formatted Cloudinary CDN URL.
 * 
 * @param {string} publicId - The public ID or filename in Cloudinary (e.g. 'hero-image' or 'uploads/logo.png')
 * @param {string} [transforms] - Custom Cloudinary transformation string (e.g. 'w_800,c_limit,f_auto,q_auto')
 * @returns {string} Fully qualified Cloudinary CDN URL
 */
function getCloudinaryUrl(publicId, transforms) {
  if (!CLOUDINARY_CONFIG.cloudName || CLOUDINARY_CONFIG.cloudName === 'YOUR_CLOUD_NAME') {
    // Fallback to local path if Cloudinary cloud name is not yet set
    return publicId;
  }

  // Remove leading slashes if any
  const cleanId = publicId.replace(/^\//, '');
  
  // Combine transformations
  const transformString = transforms || CLOUDINARY_CONFIG.defaultTransformations;

  return `${CLOUDINARY_CONFIG.cdnBaseUrl}${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformString}/${cleanId}`;
}

/**
 * Automatically maps local image paths in the DOM to Cloudinary URLs when cloudName is active.
 */
function initializeCloudinaryImages() {
  if (!CLOUDINARY_CONFIG.cloudName || CLOUDINARY_CONFIG.cloudName === 'YOUR_CLOUD_NAME') {
    console.log('[Cloudinary] Cloud Name not set. Using local images.');
    return;
  }

  console.log(`[Cloudinary] Active for Cloud Name: ${CLOUDINARY_CONFIG.cloudName}`);

  // Process all images with data-cld attribute or local uploads src
  document.querySelectorAll('img[data-cld], img[src^="uploads/"]').forEach(img => {
    const originalSrc = img.getAttribute('data-cld') || img.getAttribute('src');
    if (originalSrc) {
      const cldUrl = getCloudinaryUrl(originalSrc);
      img.src = cldUrl;
    }
  });
}

// Attach to global window object
window.CLOUDINARY_CONFIG = CLOUDINARY_CONFIG;
window.getCloudinaryUrl = getCloudinaryUrl;
window.initializeCloudinaryImages = initializeCloudinaryImages;

// Auto-run on DOM Content Loaded
document.addEventListener('DOMContentLoaded', initializeCloudinaryImages);
