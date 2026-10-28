import type { MouseEvent, MouseEventHandler } from 'react';

export interface DisabledButtonOptions {
  readonly disabled: boolean | undefined;
  readonly focusableWhenDisabled: boolean | undefined;
  readonly onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

export interface DisabledButtonProps {
  readonly disabled: boolean | undefined;
  readonly 'aria-disabled': true | undefined;
  readonly onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

function ignoreClick(event: MouseEvent<HTMLButtonElement>): void {
  event.preventDefault();
}

export function disabledButtonProps({
  disabled,
  focusableWhenDisabled,
  onClick,
}: DisabledButtonOptions): DisabledButtonProps {
  if (disabled !== true || focusableWhenDisabled !== true) {
    return { disabled, 'aria-disabled': undefined, onClick };
  }

  return { disabled: false, 'aria-disabled': true, onClick: ignoreClick };
}
