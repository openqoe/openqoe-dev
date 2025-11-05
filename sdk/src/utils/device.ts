/**
 * Device, OS, and Browser detection utilities
 */

import { DeviceInfo, OSInfo, BrowserInfo, NetworkInfo, DeviceCategory } from '../types';

export class DeviceDetector {
  private userAgent: string;

  constructor() {
    this.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  }

  /**
   * Get device information
   */
  getDeviceInfo(): DeviceInfo {
    const category = this.getDeviceCategory();

    return {
      name: this.getDeviceName(),
      model: this.getDeviceModel(),
      category,
      manufacturer: this.getManufacturer()
    };
  }

  /**
   * Get OS information
   */
  getOSInfo(): OSInfo {
    const ua = this.userAgent;

    // macOS
    if (ua.includes('Mac OS X')) {
      const match = ua.match(/Mac OS X ([\d_]+)/);
      return {
        family: 'macOS',
        version: match ? match[1].replace(/_/g, '.') : undefined
      };
    }

    // Windows
    if (ua.includes('Windows')) {
      const match = ua.match(/Windows NT ([\d.]+)/);
      return {
        family: 'Windows',
        version: match ? match[1] : undefined
      };
    }

    // iOS
    if (ua.includes('iPhone') || ua.includes('iPad')) {
      const match = ua.match(/OS ([\d_]+)/);
      return {
        family: 'iOS',
        version: match ? match[1].replace(/_/g, '.') : undefined
      };
    }

    // Android
    if (ua.includes('Android')) {
      const match = ua.match(/Android ([\d.]+)/);
      return {
        family: 'Android',
        version: match ? match[1] : undefined
      };
    }

    // Linux
    if (ua.includes('Linux')) {
      return {
        family: 'Linux',
        version: undefined
      };
    }

    return {
      family: 'Unknown',
      version: undefined
    };
  }

  /**
   * Get browser information
   */
  getBrowserInfo(): BrowserInfo {
    const ua = this.userAgent;

    // Chrome (must check before Safari)
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      const match = ua.match(/Chrome\/([\d.]+)/);
      return {
        family: 'Chrome',
        version: match ? match[1].split('.')[0] : undefined
      };
    }

    // Edge
    if (ua.includes('Edg')) {
      const match = ua.match(/Edg\/([\d.]+)/);
      return {
        family: 'Edge',
        version: match ? match[1].split('.')[0] : undefined
      };
    }

    // Firefox
    if (ua.includes('Firefox')) {
      const match = ua.match(/Firefox\/([\d.]+)/);
      return {
        family: 'Firefox',
        version: match ? match[1].split('.')[0] : undefined
      };
    }

    // Safari (must check last)
    if (ua.includes('Safari') && !ua.includes('Chrome')) {
      const match = ua.match(/Version\/([\d.]+)/);
      return {
        family: 'Safari',
        version: match ? match[1].split('.')[0] : undefined
      };
    }

    return {
      family: 'Unknown',
      version: undefined
    };
  }

  /**
   * Get network information (basic)
   */
  async getNetworkInfo(): Promise<NetworkInfo> {
    // In browser, we can get basic connection info
    const networkInfo: NetworkInfo = {};

    // Note: Geolocation would require user permission
    // For production, this should be enriched server-side or via IP lookup service

    return networkInfo;
  }

  /**
   * Get device category
   */
  private getDeviceCategory(): DeviceCategory {
    const ua = this.userAgent;

    if (ua.includes('TV') || ua.includes('SmartTV')) {
      return 'tv';
    }

    if (ua.includes('iPad')) {
      return 'tablet';
    }

    if (ua.includes('Mobile') || ua.includes('Android') && !ua.includes('Tablet')) {
      return 'mobile';
    }

    if (ua.includes('Tablet')) {
      return 'tablet';
    }

    return 'desktop';
  }

  /**
   * Get device name
   */
  private getDeviceName(): string | undefined {
    const ua = this.userAgent;

    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('Macintosh')) return 'Mac';
    if (ua.includes('Windows')) return 'Windows PC';
    if (ua.includes('Android')) return 'Android Device';

    return undefined;
  }

  /**
   * Get device model
   */
  private getDeviceModel(): string | undefined {
    const ua = this.userAgent;

    // iPhone model
    const iPhoneMatch = ua.match(/iPhone(\d+,\d+)/);
    if (iPhoneMatch) return iPhoneMatch[0];

    // iPad model
    const iPadMatch = ua.match(/iPad(\d+,\d+)/);
    if (iPadMatch) return iPadMatch[0];

    return undefined;
  }

  /**
   * Get manufacturer
   */
  private getManufacturer(): string | undefined {
    const ua = this.userAgent;

    if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('Macintosh')) {
      return 'Apple';
    }

    if (ua.includes('Samsung')) return 'Samsung';
    if (ua.includes('Huawei')) return 'Huawei';
    if (ua.includes('Xiaomi')) return 'Xiaomi';
    if (ua.includes('OnePlus')) return 'OnePlus';

    if (ua.includes('Windows')) return 'Microsoft';
    if (ua.includes('Android')) return 'Google';

    return undefined;
  }
}
