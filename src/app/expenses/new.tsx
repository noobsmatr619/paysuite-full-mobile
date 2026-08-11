import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { Field, PrimaryButton, Screen } from "@/components/ui";

export default function NewExpenseScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Title" value={title} onChangeText={setTitle} />
        <Field label="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
        <PrimaryButton
          label={saving ? "Saving…" : "Save expense"}
          disabled={saving}
          onPress={async () => {
            setSaving(true);
            try {
              await api.createExpense({
                title,
                amount: parseFloat(amount) || 0,
                date: new Date().toISOString(),
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
