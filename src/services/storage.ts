const memory = new Map<string, string>();

function webStorage() {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export const storage = {
  get(key: string) {
    const local = webStorage();
    return local?.getItem(key) ?? memory.get(key) ?? null;
  },
  set(key: string, value: string) {
    memory.set(key, value);
    webStorage()?.setItem(key, value);
  },
  remove(key: string) {
    memory.delete(key);
    webStorage()?.removeItem(key);
  },
};