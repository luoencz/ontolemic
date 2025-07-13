export interface PageThumbnail {
  /** Header image URL or color for the thumbnail */
  image?: string;
  /** Background color if no image is provided (hex color) */
  backgroundColor?: string;
  /** Page title override for thumbnail */
  title?: string;
  /** Summary text for the thumbnail */
  summary?: string;
}

export interface PageMetadata {
  /** Page title */
  title: string;
  /** Page path/route */
  path: string;
  /** Dynamic import loader function */
  loader: () => Promise<any>;
  /** Optional thumbnail configuration */
  thumbnail?: PageThumbnail;
}

export interface PageProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  fullWidth?: boolean;
  dark?: boolean;
  /** Custom thumbnail override for this specific page instance */
  thumbnail?: PageThumbnail;
} 