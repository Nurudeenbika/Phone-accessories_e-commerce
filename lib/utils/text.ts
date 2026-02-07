/**
 * Strip HTML tags from text content
 * @param html - HTML string to strip tags from
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  if (!html) return "";

  // Remove HTML tags and decode HTML entities
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  // Find the last space before the max length to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    // If we found a space in the last 20% of the text
    return text.substring(0, lastSpace).trim() + "...";
  }

  return truncated.trim() + "...";
}

/**
 * Strip HTML tags and truncate text
 * @param html - HTML string
 * @param maxLength - Maximum length for truncated text
 * @returns Plain text, truncated if needed
 */
export function stripHtmlAndTruncate(
  html: string,
  maxLength: number = 100,
): string {
  const plainText = stripHtmlTags(html);
  return truncateText(plainText, maxLength);
}
