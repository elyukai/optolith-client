export const exists = <T>(e: T | undefined): e is T => e !== undefined;
export const matchExists = <T>() => (e: T | undefined): e is T => e !== undefined;
