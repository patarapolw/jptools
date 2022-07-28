export function cloneJSON<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}
