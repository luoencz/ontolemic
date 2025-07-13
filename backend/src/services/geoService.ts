import https from 'https';

interface GeoLocation {
  country: string | null;
  city: string | null;
}

// Common country codes to full names mapping
const COUNTRY_NAMES: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'CA': 'Canada',
  'AU': 'Australia',
  'JP': 'Japan',
  'CN': 'China',
  'IN': 'India',
  'BR': 'Brazil',
  'RU': 'Russia',
  'KR': 'South Korea',
  'MX': 'Mexico',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'FI': 'Finland',
  'DK': 'Denmark',
  'PL': 'Poland',
  'UA': 'Ukraine',
  'GE': 'Georgia',
  'TR': 'Turkey',
  'GR': 'Greece',
  'IL': 'Israel',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'SG': 'Singapore',
  'HK': 'Hong Kong',
  'NZ': 'New Zealand',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  // Add more as needed
};

export class GeoService {
  private cache: Map<string, GeoLocation> = new Map();
  
  async getLocation(ip: string): Promise<GeoLocation> {
    // Check cache first
    if (this.cache.has(ip)) {
      return this.cache.get(ip)!;
    }

    // Skip private/local IPs
    if (this.isPrivateIP(ip) || ip === 'unknown') {
      const result = { country: null, city: null };
      this.cache.set(ip, result);
      return result;
    }

    try {
      // Use ipinfo.io free service (50,000 requests/month, HTTPS supported)
      const data = await this.fetchGeoData(ip);
      
      // Convert country code to full name, fallback to code if not in mapping
      const countryName = data.country 
        ? (COUNTRY_NAMES[data.country] || data.country)
        : null;
      
      const location: GeoLocation = {
        country: countryName,
        city: data.city || null
      };
      
      // Cache the result
      this.cache.set(ip, location);
      return location;
    } catch (error) {
      console.error(`Geolocation error for IP ${ip}:`, error);
      // Return null values on error
      const fallback = { country: null, city: null };
      this.cache.set(ip, fallback);
      return fallback;
    }
  }

  private isPrivateIP(ip: string): boolean {
    // Check for private IP ranges
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fe80::/,
      /^localhost$/
    ];
    
    return privateRanges.some(range => range.test(ip));
  }

  private fetchGeoData(ip: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'ipinfo.io',
        path: `/${ip}/json`,
        method: 'GET',
        timeout: 3000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'inner-cosmos-stats/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            // ipinfo.io returns bogon:true for private IPs
            if (parsed.bogon) {
              reject(new Error('Private IP address'));
            } else if (parsed.error) {
              reject(new Error(parsed.error.message || 'API error'));
            } else {
              resolve(parsed);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  // Clear cache periodically to avoid memory issues
  clearCache(): void {
    this.cache.clear();
  }
}

export const geoService = new GeoService();

// Clear cache every hour
setInterval(() => {
  geoService.clearCache();
}, 60 * 60 * 1000); 