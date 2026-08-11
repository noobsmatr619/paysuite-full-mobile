import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { Field, PrimaryButton, Screen, useThemeColors } from "@/components/ui";

export default function NewProductScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (!name.trim()) throw new Error("Name is required");
      await api.createProduct({
        name: name.trim(),
        price: parseFloat(price) || 0,
        code: code || null,
        description: description || null,
      });
      router.back();
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Name *" value={name} onChangeText={setName} />
        <Field
          label="Price *"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />
        <Field label="Code" value={code} onChangeText={setCode} />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
        />
        {!!error && (
          <Text style={{ color: c.danger, marginBottom: 10 }}>{error}</Text>
        )}
        <PrimaryButton
          label={saving ? "Saving…" : "Save product"}
          onPress={save}
          disabled={saving}
        />
      </ScrollView>
    </Screen>
  );
}
