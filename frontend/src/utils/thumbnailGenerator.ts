import { PageThumbnail, PageMetadata } from '../types/page';

/**
 * Pastel color palette for automatic thumbnail generation
 */
const PASTEL_COLORS = [
  '#FFE5E5', // Soft pink
  '#FFE5F1', // Light rose
  '#F3E5FF', // Lavender
  '#E5E5FF', // Periwinkle
  '#E5F1FF', // Sky blue
  '#E5FFFF', // Light cyan
  '#E5FFF1', // Mint
  '#E5FFE5', // Pale green
  '#F1FFE5', // Light lime
  '#FFFFE5', // Soft yellow
  '#FFF1E5', // Peach
  '#FFE5EB', // Coral pink
];

/**
 * Generate a deterministic pastel color based on the page path
 */
export function generatePastelColor(path: string): string {
  // Create a simple hash from the path
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    const char = path.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color from the palette
  const index = Math.abs(hash) % PASTEL_COLORS.length;
  return PASTEL_COLORS[index];
}

/**
 * Extract the first few sentences from HTML content
 */
export function extractSummary(htmlContent: string, maxLength: number = 150): string {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Extract text content
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // Clean up the text
  const cleanedText = textContent
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  // Extract sentences (look for period, exclamation, or question mark)
  const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [];
  
  let summary = '';
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (summary.length + trimmedSentence.length <= maxLength) {
      summary += trimmedSentence + ' ';
    } else {
      // If adding the full sentence would exceed the limit, truncate
      if (summary.length === 0) {
        summary = trimmedSentence.substring(0, maxLength - 3) + '...';
      }
      break;
    }
  }
  
  // If no sentences found or summary is too short, just take the first part of the text
  if (summary.trim().length < 50 && cleanedText.length > 0) {
    summary = cleanedText.substring(0, maxLength - 3) + '...';
  }
  
  return summary.trim();
}

/**
 * Generate automatic thumbnail data for a page
 */
export async function generateAutomaticThumbnail(
  pageMetadata: PageMetadata,
  pageContent?: string
): Promise<PageThumbnail> {
  const backgroundColor = generatePastelColor(pageMetadata.path);
  
  // Try to extract summary from page content if available
  let summary = '';
  if (pageContent) {
    summary = extractSummary(pageContent);
  }
  
  // If no summary extracted, use a default based on page title
  if (!summary) {
    summary = `Explore ${pageMetadata.title} section of Inner Cosmos.`;
  }
  
  return {
    backgroundColor,
    title: pageMetadata.title,
    summary
  };
}

/**
 * Get thumbnail data for a page, using custom data if available or generating automatic one
 */
export async function getPageThumbnail(
  pageMetadata: PageMetadata,
  customThumbnail?: PageThumbnail,
  pageContent?: string
): Promise<PageThumbnail> {
  // If custom thumbnail is provided, merge it with automatic generation
  if (customThumbnail) {
    const automaticThumbnail = await generateAutomaticThumbnail(pageMetadata, pageContent);
    return {
      ...automaticThumbnail,
      ...customThumbnail
    };
  }
  
  // If page metadata has thumbnail data, use it
  if (pageMetadata.thumbnail) {
    const automaticThumbnail = await generateAutomaticThumbnail(pageMetadata, pageContent);
    return {
      ...automaticThumbnail,
      ...pageMetadata.thumbnail
    };
  }
  
  // Generate automatic thumbnail
  return generateAutomaticThumbnail(pageMetadata, pageContent);
} 