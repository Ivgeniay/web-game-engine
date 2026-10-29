interface EyeDropperResult {
  readonly sRGBHex: string;
}

interface EyeDropperInstance {
  readonly open: () => Promise<EyeDropperResult>;
}

type EyeDropperConstructor = new () => EyeDropperInstance;

const EYE_DROPPER_GLOBAL = 'EyeDropper';

function isEyeDropperConstructor(candidate: unknown): candidate is EyeDropperConstructor {
  return typeof candidate === 'function';
}

function eyeDropperConstructor(): EyeDropperConstructor | undefined {
  const candidate: unknown = Reflect.get(globalThis, EYE_DROPPER_GLOBAL);

  return isEyeDropperConstructor(candidate) ? candidate : undefined;
}

export function isEyeDropperSupported(): boolean {
  return eyeDropperConstructor() !== undefined;
}

export async function pickScreenColor(): Promise<string | undefined> {
  const EyeDropper = eyeDropperConstructor();

  if (EyeDropper === undefined) {
    return undefined;
  }

  try {
    const result = await new EyeDropper().open();

    return result.sRGBHex;
  } catch {
    return undefined;
  }
}
