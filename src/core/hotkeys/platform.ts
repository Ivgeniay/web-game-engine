export const PLATFORMS = ['mac', 'other'] as const;

export type Platform = (typeof PLATFORMS)[number];

export interface PlatformSource {
  readonly platform: string;
  readonly userAgentData?: { readonly platform: string } | undefined;
}

const APPLE_PLATFORM_PATTERN = /mac|iphone|ipad|ipod/i;

export function detectPlatform(source: PlatformSource): Platform {
  const name = source.userAgentData?.platform ?? source.platform;

  return APPLE_PLATFORM_PATTERN.test(name) ? 'mac' : 'other';
}
