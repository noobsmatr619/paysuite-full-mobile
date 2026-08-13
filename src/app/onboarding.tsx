import { useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useThemeColors } from "@/components/ui";

/**
 * Flutter /onboarding. The Flutter deck pairs each slide with artwork from its
 * asset bundle; those assets are not in this repo, so the slides are text-only
 * rather than shipping placeholder images.
 */
const SLIDES = [
  { title: "Invoice in seconds", body: "Create and send professional invoices from anywhere." },
  { title: "Get paid faster", body: "Share a payment link and track what is still outstanding." },
  { title: "Know where you stand", body: "Income, expenses and profit, summarised as you go." },
];

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const c = useThemeColors();
  const last = index === SLIDES.length - 1;
  const finish = () => router.replace("/(auth)/login");

  return (
    <View style={s.container}>
      <Pressable style={s.skip} onPress={finish} accessibilityRole="button">
        <Text style={{ color: c.textSecondary, fontWeight: "600" }}>Skip</Text>
      </Pressable>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: index * width, y: 0 }}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        style={{ flexGrow: 0 }}
      >
        {SLIDES.map((slide) => (
          <View key={slide.title} style={[s.slide, { width }]}>
            <Text style={[s.title, { color: c.text }]}>{slide.title}</Text>
            <Text style={[s.body, { color: c.textSecondary }]}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={s.dots}>
        {SLIDES.map((slide, i) => (
          <View
            key={slide.title}
            style={[
              s.dot,
              { backgroundColor: i === index ? c.primary : c.border, width: i === index ? 22 : 8 },
            ]}
          />
        ))}
      </View>

      <Pressable
        style={[s.btn, { backgroundColor: c.primary }]}
        onPress={() => (last ? finish() : setIndex((i) => i + 1))}
      >
        <Text style={s.btnText}>{last ? "Get started" : "Next"}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingVertical: 40 },
  skip: { position: "absolute", top: 56, right: 20, zIndex: 1 },
  slide: { paddingHorizontal: 28, gap: 12, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center" },
  body: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 28 },
  dot: { height: 8, borderRadius: 4 },
  btn: { borderRadius: 10, padding: 16, alignItems: "center", marginHorizontal: 28 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
