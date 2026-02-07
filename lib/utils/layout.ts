/**
 * Layout utilities for consistent spacing and positioning
 */

// Navbar height calculation based on actual CSS classes
export const NAVBAR_HEIGHT = {
  // First row: py-4 (16px + 16px) + search bar height (~48px)
  firstRow: 80,
  // Second row: py-2 (8px + 8px) + nav links height (~40px)
  secondRow: 56,
  // Total navbar height
  total: 136,
} as const;

// Standard spacing values
export const SPACING = {
  // Standard spacing below navbar
  belowNavbar: NAVBAR_HEIGHT.total + 24, // 136px + 24px = 160px
  // Standard page padding
  pagePadding: 32, // 2rem
  // Standard section spacing
  sectionSpacing: 48, // 3rem
} as const;

/**
 * Get the top offset for content that should be positioned below the navbar
 * @param additionalSpacing - Additional spacing to add (default: 24px)
 * @returns CSS top value
 */
export function getContentTopOffset(additionalSpacing: number = 24): string {
  return `${NAVBAR_HEIGHT.total + additionalSpacing}px`;
}

/**
 * Get the margin-top for content that should be positioned below the navbar
 * @param additionalSpacing - Additional spacing to add (default: 24px)
 * @returns CSS margin-top value
 */
export function getContentMarginTop(additionalSpacing: number = 24): string {
  return `${NAVBAR_HEIGHT.total + additionalSpacing}px`;
}

/**
 * CSS classes for common layout patterns
 */
export const LAYOUT_CLASSES = {
  // For sticky content below navbar
  stickyBelowNavbar: `sticky top-[${NAVBAR_HEIGHT.total + 24}px]`,
  // For content with proper top margin
  contentBelowNavbar: `mt-[${NAVBAR_HEIGHT.total + 24}px]`,
  // For pages with standard padding
  pageContainer: `pt-${SPACING.pagePadding / 4} pb-${SPACING.pagePadding / 4}`, // Convert px to rem
} as const;
