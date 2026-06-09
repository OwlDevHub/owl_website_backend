export interface ScreenInfo {
  screenWidth?: number;
  screenHeight?: number;
  windowInnerWidth?: number;
  windowInnerHeight?: number;
  devicePixelRatio?: number;
  screenColorDepth?: number;
  orientation?: string;
}

export interface BrowserInfo {
  userAgent?: string;
  cookieEnabled?: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number | string;
  maxTouchPoints?: number;
  isMobile?: boolean;
  isTablet?: boolean;
}

export interface NetworkInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  available?: boolean;
}

export interface PerformanceInfo {
  pageLoadTime?: number;
  domReadyTime?: number;
}

export interface DeviceInfo {
  deviceType?: string;
  os?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
  platform?: string;
  language?: string;
  localDateTime?: string;
  localTime?: string;
  localDate?: string;
  screen?: ScreenInfo;
  browser?: BrowserInfo;
  network?: NetworkInfo;
  performance?: PerformanceInfo;
}

export interface TelegramData {
  email: string;
  ipAddress?: string;
  timezone?: string;
  deviceInfo?: DeviceInfo;
}
