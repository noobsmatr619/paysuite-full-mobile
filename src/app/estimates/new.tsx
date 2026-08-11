import { useEffect, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { Field, PrimaryButton, Screen, useThemeColors } from "@/components/ui";

export default function NewEstimateScreen() {
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

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Customer ID" value={customerId} onChangeText={setCustomerId} />
        <Text style={{ color: c.textSecondary, marginBottom: 8, fontSize: 12 }}>
          {customers.map((x) => `${x.firstName}`).join(" · ")}
        </Text>
        <Field label="Product ID" value={productId} onChangeText={setProductId} />
        <Field label="Qty" value={qty} onChangeText={setQty} keyboardType="decimal-pad" />
        <PrimaryButton
          label={saving ? "Saving…" : "Create estimate"}
          disabled={saving}
          onPress={async () => {
            setSaving(true);
            try {
              const p = products.find((x) => x.id === productId);
              if (!p || !customerId) throw new Error("Select customer & product");
              await api.createEstimate({
                customerId,
                date: new Date().toISOString(),
                lines: [
                  {
                    productId: p.id,
                    quantity: parseFloat(qty) || 1,
                    price: p.price,
                  },
                ],
              });
              router.back();
            } catch (e: any) {
              Alert.alert("Error", e?.message || "Failed");
            } finally {
              setSaving(false);
            }
          }}
        />
      </ScrollView>
    </Screen>
  );
}
