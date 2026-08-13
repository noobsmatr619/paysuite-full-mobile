import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/api/client";
import { Field, Loading, PrimaryButton, Screen, useThemeColors } from "@/components/ui";

/** Doubles as the edit screen when opened with an id, as Flutter's
 *  add_product_screen does when the popup menu picks "edit". */
export default function NewProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const c = useThemeColors();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    api
      .product(String(id))
      .then((row: any) => {
        if (!row) return;
        setName(row.name ?? "");
        setPrice(row.price != null ? String(row.price) : "");
        setCode(row.code ?? "");
        setDescription(row.description ?? "");
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [id]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (!name.trim()) throw new Error("Name is required");
      const data = {
        name: name.trim(),
        price: parseFloat(price) || 0,
        code: code || null,
        description: description || null,
      };
      if (id) await api.updateProduct(String(id), data);
      else await api.createProduct(data);
      router.back();
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
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
          label={saving ? "Saving…" : id ? "Update product" : "Save product"}
          onPress={save}
          disabled={saving}
        />
      </ScrollView>
    </Screen>
  );
}
