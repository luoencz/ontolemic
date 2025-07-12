# Page Thumbnails and Embeds

This document explains how to use the page thumbnail system in Inner Cosmos.

## Overview

The page thumbnail system allows you to:
1. Generate automatic thumbnails for all pages with pastel colors and extracted text summaries
2. Override thumbnails with custom data for specific pages
3. Embed rich page previews within content (similar to Notion)

## Using Page Embeds

To embed a page preview in your content, use the `PageEmbed` component:

```tsx
import { PageEmbed } from '../components/PageEmbed';

function MyPage() {
  return (
    <Page title="My Page">
      <p>Check out this project:</p>
      <PageEmbed to="/projects/cue" size="large" />
      
      <p>Related pages:</p>
      <div className="space-y-3">
        <PageEmbed to="/blog" size="medium" />
        <PageEmbed to="/research" size="medium" />
      </div>
    </Page>
  );
}
```

### PageEmbed Props

- `to` (string, required): The path to the page you want to embed
- `size` ('small' | 'medium' | 'large', optional): Size of the embed. Default is 'medium'
- `className` (string, optional): Additional CSS classes

## Custom Page Thumbnails

### Method 1: In Page Registry

Define custom thumbnails in `pageRegistry.ts`:

```typescript
{
  title: 'About',
  path: '/about',
  loader: () => import('../pages/About'),
  thumbnail: {
    backgroundColor: '#FFE5E5',  // Optional: Override auto color
    image: '/images/about-preview.jpg',  // Optional: Custom image
    title: 'About Me',  // Optional: Override title
    summary: 'Learn more about my journey...'  // Custom summary
  }
}
```

### Method 2: In Individual Pages

Override thumbnails directly in page components:

```tsx
function MyPage() {
  return (
    <Page 
      title="My Page"
      thumbnail={{
        image: '/images/my-preview.jpg',
        title: 'Custom Title for Embeds',
        summary: 'This summary will appear in page embeds'
      }}
    >
      {/* Page content */}
    </Page>
  );
}
```

## Automatic Thumbnail Generation

If no custom thumbnail is provided, the system automatically:
1. Generates a deterministic pastel color based on the page path
2. Extracts the first few sentences from the page content as a summary
3. Uses the page title from the registry

## Thumbnail Properties

- `image` (string, optional): URL to header image
- `backgroundColor` (string, optional): Hex color for background (if no image)
- `title` (string, optional): Override title for the thumbnail
- `summary` (string, optional): Description text for the thumbnail

## Best Practices

1. **Provide custom summaries** for important pages in the page registry
2. **Use appropriate sizes** - 'large' for featured content, 'medium' for lists
3. **Add images** for visual pages like projects or galleries
4. **Keep summaries concise** - they're truncated after ~150 characters
5. **Test embeds** at different screen sizes - they're responsive

## Example: Projects Page

See `frontend/src/pages/Projects.tsx` for a complete example showing:
- Embedding a featured project with large size
- Using the PageEmbed component
- Custom thumbnail data from the registry 