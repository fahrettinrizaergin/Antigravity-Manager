// Detect if we're running in Tauri environment
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// Lazy import of Tauri API to avoid errors in non-Tauri environments
let tauriInvoke: ((cmd: string, args?: any) => Promise<any>) | null = null;

const getTauriInvoke = async () => {
  if (tauriInvoke) return tauriInvoke;
  
  if (isTauri) {
    try {
      const tauriApi = await import('@tauri-apps/api/core');
      tauriInvoke = tauriApi.invoke;
      return tauriInvoke;
    } catch (error) {
      console.error('Failed to load Tauri API:', error);
      throw new Error('Tauri API is not available. Please ensure you are running in a Tauri environment.');
    }
  }
  
  throw new Error('Not running in Tauri environment. Management features are only available in the desktop application.');
};

export async function request<T>(cmd: string, args?: any): Promise<T> {
  try {
    const invoke = await getTauriInvoke();
    return await invoke(cmd, args);
  } catch (error) {
    console.error(`API Error [${cmd}]:`, error);
    throw error;
  }
}

// Export helper to check if Tauri is available
export { isTauri };
