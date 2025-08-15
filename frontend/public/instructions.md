# Image Conversion Instructions

## Converting PNG to WebP

To convert PNG images to WebP format (for better compression and web performance):

```bash
# Install WebP tools if not already installed
sudo apt install -y webp

# Convert PNG to WebP with quality setting (85 for high quality)
cwebp -q 85 your-review-asx.png -o your-review-asx.webp
```

### Notes:
- Quality setting: `-q 85` (range 0-100, higher = better quality but larger file)
- For the scribe image, this reduced file size from 4.3MB to 807KB (~81% reduction)
- WebP format provides better compression than PNG while maintaining visual quality
