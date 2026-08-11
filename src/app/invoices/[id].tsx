import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { api } from "@/api/client";
import {
  Field,
  Loading,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  money,
  useThemeColors,
} from "@/components/ui";

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useThemeColors();
  const router = useRouter();
  const [inv, setInv] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setInv(await api.invoice(String(id)));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading || !inv) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  const due = inv.dueAmount ?? inv.grandTotal - inv.receivedAmount;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Title>{inv.invoiceFullNumber}</Title>
        <Subtitle>
          {inv.customer?.firstName} · {inv.status} · Due {money(due)}
        </Subtitle>
        <Text style={{ color: c.textSecondary, marginTop: 8 }}>
          Total {money(inv.grandTotal)} · Paid {money(inv.receivedAmount)}
        </Text>
        {!!inv.note && (
          <Text style={{ color: c.text, marginTop: 12 }}>{inv.note}</Text>
        )}
        <View style={{ marginTop: 16, gap: 10 }}>
          <PrimaryButton
            label="Open PDF / HTML"
            onPress={async () => {
              try {
                const doc = await api.invoiceDocument(String(id));
                const html = encodeURIComponent(doc.html);
                await WebBrowser.openBrowserAsync(
                  `data:text/html;charset=utf-8,${html}`,
                );
              } catch (e: any) {
                Alert.alert("PDF", e?.message || "Failed");
              }
            }}
          />
          <PrimaryButton
            label="Clone invoice"
            onPress={async () => {
              try {
                const clone: any = await api.cloneInvoice(String(id));
                Alert.alert("Cloned", clone.invoiceFullNumber || "OK");
                router.replace(`/invoices/${clone.id}` as any);
              } catch (e: any) {
                Alert.alert("Clone", e?.message || "Failed");
              }
            }}
          />
          <PrimaryButton
            label={inv.recurring ? "Disable recurring" : "Enable recurring"}
            onPress={async () => {
              await api.updateInvoice(String(id), { recurring: !inv.recurring });
              load();
            }}
          />
        </View>
        {due > 0 && (
          <View style={{ marginTop: 20 }}>
            <Title>Record payment</Title>
            <Field
              label="Amount"
              keyboardType="decimal-pad"
              value={payAmount}
              onChangeText={setPayAmount}
              placeholder={String(due)}
            />
            <PrimaryButton
              label="Pay"
              onPress={async () => {
                try {
                  await api.payInvoice(
                    String(id),
                    Number(payAmount || due),
                    "Mobile payment",
                  );
                  setPayAmount("");
                  load();
                } catch (e: any) {
                  Alert.alert("Pay", e?.message || "Failed");
                }
              }}
            />
          </View>
        )}
        <View style={{ marginTop: 24 }}>
          <PrimaryButton
            label="Delete invoice"
            onPress={() => {
              Alert.alert("Delete?", "This cannot be undone", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    await api.deleteInvoice(String(id));
                    router.back();
                  },
                },
              ]);
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
