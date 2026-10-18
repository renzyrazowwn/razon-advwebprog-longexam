import fallbackImage from '../assets/img/nubdexchange_logo.png';

export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(',');

export const PRODUCT_IMAGE_FALLBACK = fallbackImage;

export const formatFileSize = (bytes) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const detectImageType = async (file) => {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (bytes.length < 12) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';

  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((b, i) => bytes[i] === b)) return 'image/png';

  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';

  return null;
};

export const validateImageFile = async (file) => {
  if (!file) return 'Please choose an image file.';

  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    return `Invalid image type (${file.name}). Only JPEG, PNG, and WEBP images are allowed.`;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return `Image is too large (${formatFileSize(file.size)}). Maximum file size is ${MAX_IMAGE_SIZE_MB}MB.`;
  }

  const realType = await detectImageType(file);
  if (!realType) {
    return `"${file.name}" is not a real image. Its content is not a JPEG, PNG, or WEBP file.`;
  }
  if (realType !== file.type) {
    return `"${file.name}" claims to be ${file.type} but it is actually ${realType}. Please rename or re-export it.`;
  }

  return '';
};

export const getProductImageUrl = (url, width = 800) => {
  if (!url) return PRODUCT_IMAGE_FALLBACK;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`);
};

export const handleImageError = (event) => {
  if (event.currentTarget.src !== PRODUCT_IMAGE_FALLBACK) {
    event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
  }
};