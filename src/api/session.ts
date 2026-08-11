import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "paysuite.auth.token";

// expo-secure-store ships an empty stub on web (build/ExpoSecureStore.web.js is
// `export default {}`), so the native module is unusable there. Fall back to
// localStorage, which only exists on web.
const isWeb = Platform.OS === "web";

function webStorage(): Storage | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

export async function saveToken(token: string): Promise<void> {
  if (isWeb) {
    webStorage()?.setItem(TOKEN_KEY, token);
    return;
  }
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // Keychain unavailable (e.g. simulator without entitlements) — the session
    // still works for this launch, it just will not survive a restart.
  }
}

export async function loadToken(): Promise<string | null> {
  if (isWeb) return webStorage()?.getItem(TOKEN_KEY) ?? null;
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearToken(): Promise<void> {
  if (isWeb) {
    webStorage()?.removeItem(TOKEN_KEY);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // Nothing stored, or keychain unavailable.
  }
}
