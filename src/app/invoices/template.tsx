import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { api } from "@/api/client";
import { Loading, PrimaryButton, Screen, Title, useThemeColors } from "@/components/ui";

/**
 * Flutter /chooseTemplate — pick which of the invoice layouts this invoice
 * prints with. Invoice.invoiceTemplate is an integer on the server, so the
 * options are numbered rather than named.
 */
const TEMPLATES = [
  { id: 1, name: "Classic", note: "Plain header, itemised table" },
  { id: 2, name: "Modern", note: "Accent banner with a summary block" },
  { id: 3, name: "Compact", note: "Fits more lines on a single page" },
];

export default function ChooseTemplateScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const c = useThemeColors();
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    api
      .invoice(id)
      .then((inv: any) => setSelected(inv?.invoiceTemplate ?? 1))
      .catch(() => setSelected(1))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    if (!id || selected == null) return;
    setSaving(true);
    try {
      await api.updateInvoice(id, { invoiceTemplate: selected });
      router.back();
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Could not change the template");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  if (!id) {
    return (
      <Screen>
        <View style={{ padding: 16 }}>
          <Title>Invoice template</Title>
          <Text style={{ color: c.textSecondary }}>Open this from an invoice to change its template.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <Title>Invoice template</Title>
        {TEMPLATES.map((tpl) => {
          const active = selected === tpl.id;
          return (
            <Pressable
              key={tpl.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(tpl.id)}
              style={{
                borderWidth: 1,
                borderColor: active ? c.primary : c.border,
                backgroundColor: active ? c.card : "transparent",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <Text style={{ color: c.text, fontWeight: active ? "700" : "600", fontSize: 16 }}>
                {tpl.name}
              </Text>
              <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 2 }}>{tpl.note}</Text>
            </Pressable>
          );
        })}
        <PrimaryButton label={saving ? "Saving…" : "Use this template"} onPress={save} />
      </ScrollView>
    </Screen>
  );
}
