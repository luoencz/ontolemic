#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'the-o-space';
const REPO_NAME = 'Cue';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

// Parse command line arguments
const args = process.argv.slice(2);
const listOnly = args.includes('--list');
const filePattern = args.find(arg => !arg.startsWith('--')) || '';

/**
 * Fetches JSON data from a URL
 */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      headers: { 'User-Agent': 'inner-cosmos-favicon-fetcher' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Downloads a file from URL to destination
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    function get(url, redirectCount = 0) {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }
      
      // Parse URL to handle different domains
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: { 'User-Agent': 'inner-cosmos-favicon-fetcher' }
      };
      
      https.get(options, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          get(response.headers.location, redirectCount + 1);
          return;
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }
        
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close(() => {
            console.log(`✓ File saved (${fs.statSync(dest).size} bytes)`);
            resolve();
          });
        });
        
        file.on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      }).on('error', reject);
    }
    
    get(url);
  });
}

/**
 * Updates the favicon reference in index.html
 */
function updateIndexHtml(faviconPath) {
  const indexPath = path.join(__dirname, '../frontend/index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Update the favicon link - handle both svg and png
  html = html.replace(
    /<link rel="icon"[^>]*>/,
    `<link rel="icon" type="image/png" href="${faviconPath}" />`
  );
  
  fs.writeFileSync(indexPath, html);
  console.log('✓ Updated index.html');
}

async function main() {
  try {
    console.log(`Fetching latest release from ${REPO_OWNER}/${REPO_NAME}...`);
    
    // Fetch latest release
    const release = await fetchJSON(API_URL);
    console.log(`✓ Found release: ${release.name || release.tag_name}`);
    
    // Find PNG assets
    const pngAssets = release.assets.filter(asset => 
      asset.name.toLowerCase().endsWith('.png')
    );
    
    if (pngAssets.length === 0) {
      throw new Error('No PNG files found in the latest release');
    }
    
    console.log(`✓ Found ${pngAssets.length} PNG file(s):`);
    pngAssets.forEach((asset, index) => {
      const size = (asset.size / 1024 / 1024).toFixed(2);
      console.log(`   ${index + 1}. ${asset.name} (${size} MB)`);
    });
    
    // If list only, exit here
    if (listOnly) {
      console.log('\nTo download a specific file, run:');
      console.log('  npm run fetch-favicon -- <filename>');
      console.log('  npm run fetch-favicon -- <partial-name>');
      return;
    }
    
    // Select asset based on pattern or use first one
    let selectedAsset;
    if (filePattern) {
      selectedAsset = pngAssets.find(asset => 
        asset.name.toLowerCase().includes(filePattern.toLowerCase())
      );
      if (!selectedAsset) {
        throw new Error(`No PNG file matching "${filePattern}" found`);
      }
    } else {
      selectedAsset = pngAssets[0];
    }
    
    console.log(`\n✓ Selected: ${selectedAsset.name}`);
    
    // Download the file
    const publicDir = path.join(__dirname, '../frontend/public');
    const faviconPath = path.join(publicDir, 'favicon.png');
    
    console.log(`Downloading ${selectedAsset.name}...`);
    await downloadFile(selectedAsset.browser_download_url, faviconPath);
    console.log(`✓ Downloaded to: ${faviconPath}`);
    
    // Update index.html
    updateIndexHtml('/favicon.png');
    
    console.log('\n✅ Favicon successfully updated!');
    console.log(`   Release: ${release.name || release.tag_name}`);
    console.log(`   File: ${selectedAsset.name}`);
    console.log('\nUsage tips:');
    console.log('  npm run fetch-favicon              # Download first PNG');
    console.log('  npm run fetch-favicon -- --list    # List available PNGs');
    console.log('  npm run fetch-favicon -- gradient  # Download file containing "gradient"');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('API rate limit')) {
      console.error('   Try again later or use a GitHub token');
    }
    process.exit(1);
  }
}

main(); 