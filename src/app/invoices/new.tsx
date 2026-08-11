import { useEffect, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { Field, PrimaryButton, Screen, useThemeColors } from "@/components/ui";

export default function NewInvoiceScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.customers(), api.products()]).then(([cs, ps]) => {
      setCustomers(cs);
      setProducts(ps);
      if (cs[0]) setCustomerId(cs[0].id);
      if (ps[0]) setProductId(ps[0].id);
    });
  }, []);

  async function save() {
    setSaving(true);
    try {
      const p = products.find((x) => x.id === productId);
      if (!customerId || !p) throw new Error("Select customer and product");
      const inv = await api.createInvoice({
        customerId,
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        lines: [
          {
            productId: p.id,
            quantity: parseFloat(qty) || 1,
            price: p.price,
          },
        ],
      });
      Alert.alert("Created", inv.invoiceFullNumber || "Invoice created");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: c.textSecondary, marginBottom: 8 }}>Customer id</Text>
        <Field
          label="Customer ID"
          value={customerId}
          onChangeText={setCustomerId}
        />
        <Text style={{ color: c.textSecondary, marginBottom: 4 }}>
          {customers.map((x) => `${x.firstName}(${x.id.slice(0, 6)})`).join(" · ")}
        </Text>
        <Field label="Product ID" value={productId} onChangeText={setProductId} />
        <Text style={{ color: c.textSecondary, marginBottom: 4 }}>
          {products.map((x) => `${x.name}(${x.id.slice(0, 6)})`).join(" · ")}
        </Text>
        <Field label="Quantity" value={qty} onChangeText={setQty} keyboardType="decimal-pad" />
        <PrimaryButton label={saving ? "Saving…" : "Create invoice"} onPress={save} disabled={saving} />
      </ScrollView>
    </Screen>
  );
}
