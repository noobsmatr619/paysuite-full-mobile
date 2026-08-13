import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n";

/** Flutter /splash — decides where to land once the session is known. */
export default function SplashScreen() {
  const { user, loading } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/(tabs)" : "/(auth)/login");
  }, [loading, user]);

  return (
    <View style={s.container}>
      <Text style={s.brand}>{t("appName")}</Text>
      <ActivityIndicator />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  brand: { fontSize: 28, fontWeight: "700" },
});
