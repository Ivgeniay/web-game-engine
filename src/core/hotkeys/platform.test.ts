import { describe, expect, it } from 'vitest';
import { detectPlatform } from './platform';

describe('detectPlatform', () => {
  it.each(['MacIntel', 'iPhone', 'iPad'])('detects macOS keys on %s', (platform) => {
    expect(detectPlatform({ platform })).toBe('mac');
  });

  it.each(['Win32', 'Linux x86_64', ''])('detects other platforms on %j', (platform) => {
    expect(detectPlatform({ platform })).toBe('other');
  });

  it('prefers user agent data to the legacy platform', () => {
    expect(detectPlatform({ platform: 'Win32', userAgentData: { platform: 'macOS' } })).toBe('mac');
    expect(detectPlatform({ platform: 'MacIntel', userAgentData: { platform: 'Windows' } })).toBe(
      'other',
    );
  });
});
