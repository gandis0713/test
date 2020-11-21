/* eslint-disable @typescript-eslint/no-explicit-any */

export function typedAction(type: string, payload?: any): { type: string; payload?: any } {
  return { type, payload };
}
export type TypedAction = ReturnType<typeof typedAction>;
