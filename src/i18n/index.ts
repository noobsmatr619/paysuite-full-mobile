import { useSyncExternalStore } from "react";

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

let lang: Lang = "en";
const listeners = new Set<() => void>();

export function getLang() {
  return lang;
}

export function setLang(next: Lang) {
  lang = next;
  listeners.forEach((l) => l());
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
