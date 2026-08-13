import { useSyncExternalStore } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export type Lang = "en" | "ar";

const dict = {
  en: {
    appName: "PaySuite",
    dashboard: "Dashboard",
    customers: "Customers",
    invoices: "Invoices",
    estimates: "Estimates",
    products: "Products",
    expenses: "Expenses",
    tickets: "Tickets",
    billing: "Billing",
    profile: "Profile",
    menu: "Menu",
    signIn: "Sign in",
    signOut: "Sign out",
    revenue: "Revenue",
    paid: "Paid",
    due: "Due",
    language: "Language",
    offlineDemo: "Offline demo mode",
    remoteHint: "Uses real Wasp password + JWT",
  },
  ar: {
    appName: "باي سويت",
    dashboard: "لوحة التحكم",
    customers: "العملاء",
    invoices: "الفواتير",
    estimates: "عروض الأسعار",
    products: "المنتجات",
    expenses: "المصروفات",
    tickets: "التذاكر",
    billing: "الفوترة",
    profile: "الملف الشخصي",
    menu: "القائمة",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    revenue: "الإيرادات",
    paid: "المدفوع",
    due: "المستحق",
    language: "اللغة",
    offlineDemo: "وضع تجريبي دون اتصال",
    remoteHint: "يستخدم كلمة مرور ورمز JWT",
  },
} as const;

export type DictKey = keyof typeof dict.en;

const STORAGE_KEY = "paysuite_lang";

// SecureStore on native, localStorage on web — the same split api/session.ts uses.
const isWeb = Platform.OS === "web";

let lang: Lang = "en";
const listeners = new Set<() => void>();

export function getLang() {
  return lang;
}

export function setLang(next: Lang) {
  if (next === lang) return;
  lang = next;
  void persist(next);
  listeners.forEach((l) => l());
}

async function persist(next: Lang) {
  try {
    if (isWeb) {
      if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, next);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEY, next);
  } catch {
    // Storage unavailable — the choice still holds for this launch.
  }
}

/** Load the stored language. Safe to call more than once. */
export async function restoreLang() {
  try {
    const stored = isWeb
      ? typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null
      : await SecureStore.getItemAsync(STORAGE_KEY);
    if (stored === "en" || stored === "ar") {
      lang = stored;
      listeners.forEach((l) => l());
    }
  } catch {
    /* storage unavailable */
  }
}

export function t(key: DictKey): string {
  return dict[lang][key] || dict.en[key] || key;
}

export function useI18n() {
  const current = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => lang,
    () => "en" as Lang,
  );
  return {
    lang: current,
    setLang,
    t: (key: DictKey) => dict[current][key] || dict.en[key] || key,
    isRtl: current === "ar",
  };
}
