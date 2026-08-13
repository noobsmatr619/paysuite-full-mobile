import { Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n, type Lang } from "@/i18n";
import { Screen, Title, useThemeColors } from "@/components/ui";

const OPTIONS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" }
];

/** Flutter /language — the store already persists the choice; this exposes it. */
export default function LanguageScreen() {
  const { lang, setLang, t, isRtl } = useI18n();
  const c = useThemeColors();

  return (
    <Screen>
      <View style={[s.container, isRtl && s.rtl]}>
        <Title>{t("language")}</Title>
        {OPTIONS.map((option) => {
          const active = lang === option.code;
          return (
            <Pressable
              key={option.code}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => setLang(option.code)}
              style={[
                s.row,
                { borderColor: active ? c.primary : c.border, backgroundColor: active ? c.card : "transparent" }
              ]}
            >
              <View>
                <Text style={[s.native, { color: c.text }]}>{option.native}</Text>
                <Text style={[s.sub, { color: c.textSecondary }]}>{option.label}</Text>
              </View>
              {active ? <Text style={{ color: c.primary, fontWeight: "700" }}>✓</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  rtl: { direction: "rtl" },
  row: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  native: { fontSize: 16, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 }
});
