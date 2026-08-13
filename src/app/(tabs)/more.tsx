import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import {
  PrimaryButton,
  RowItem,
  Screen,
  Subtitle,
  Title,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n";

export default function MoreScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { t, lang, setLang, isRtl } = useI18n();

  const links = [
    { title: t("customers"), href: "/customers" },
    { title: t("invoices"), href: "/invoices" },
    { title: t("estimates"), href: "/estimates" },
    { title: t("products"), href: "/products" },
    { title: t("expenses"), href: "/expenses" },
    { title: t("tickets"), href: "/tickets" },
    { title: t("billing"), href: "/billing" },
    { title: "Transactions", href: "/transactions" },
    { title: "Notifications", href: "/notifications" },
    { title: "Settings", href: "/settings" },
    { title: "Users", href: "/users" },
    { title: "Roles", href: "/roles" },
    { title: "Taxes", href: "/taxes" },
    { title: "Payment methods", href: "/payment-methods" },
    { title: "Expense categories", href: "/categories" },
    { title: "Plan / renew", href: "/plan-expired" },
    { title: t("profile"), href: "/profile" },
  ] as const;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        <Title>{t("menu")}</Title>
        <Subtitle>{user?.email || t("appName")}</Subtitle>
        <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
          <PrimaryButton
            label={lang === "en" ? "English ✓" : "English"}
            onPress={() => setLang("en")}
          />
          <PrimaryButton
            label={lang === "ar" ? "العربية ✓" : "العربية"}
            onPress={() => setLang("ar")}
          />
        </View>
        <View style={{ marginTop: 16 }}>
          {links.map((l) => (
            <RowItem
              key={l.href}
              title={l.title}
              subtitle={t("appName")}
              onPress={() => router.push(l.href as any)}
            />
          ))}
        </View>
        <View style={{ marginTop: 12 }}>
          <PrimaryButton label={t("signOut")} onPress={() => logout()} />
        </View>
      </ScrollView>
    </Screen>
  );
}
