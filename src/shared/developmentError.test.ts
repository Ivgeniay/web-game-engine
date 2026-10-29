import { afterEach, describe, expect, it, vi } from 'vitest';
import { reportDevelopmentError } from './developmentError';

const MESSAGE = 'Something is misconfigured';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('reportDevelopmentError', () => {
  it('throws in development', () => {
    vi.stubEnv('DEV', true);

    expect(() => {
      reportDevelopmentError(MESSAGE);
    }).toThrow(MESSAGE);
  });

  it('writes to the console outside development', () => {
    vi.stubEnv('DEV', false);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    reportDevelopmentError(MESSAGE);

    expect(error).toHaveBeenCalledExactlyOnceWith(MESSAGE);
  });
});
