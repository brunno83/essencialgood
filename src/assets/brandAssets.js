import brandSymbol from './Brand/essencial-good-symbol.png';
import brandLogo from './Brand/essencial-good-logo.png';

/**
 * Centralized, reusable onError handler for brand images.
 * - Uses dataset.fallbackApplied to guarantee a single fallback attempt for custom/configured URLs.
 * - If the image is already using the fallback asset or if the fallback asset fails, cleanly hides the image.
 * - Always disables e.target.onerror to eliminate retry loops.
 */
export function handleBrandImageError(e, fallbackAsset = brandSymbol) {
  const target = e?.target;
  if (!target) return;

  target.onerror = null;

  const currentSrc = target.src || '';
  const isAlreadyFallback = fallbackAsset && currentSrc.includes(fallbackAsset);

  if (!target.dataset.fallbackApplied && !isAlreadyFallback && fallbackAsset) {
    target.dataset.fallbackApplied = 'true';
    target.src = fallbackAsset;
  } else {
    target.style.display = 'none';
  }
}

export { brandSymbol, brandLogo };
export default brandSymbol;
