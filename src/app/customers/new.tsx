import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/api/client";
import {
  Field,
  Loading,
  PrimaryButton,
  Screen,
  useThemeColors,
} from "@/components/ui";

/** Doubles as the edit screen when opened with an id, as Flutter's
 *  add_customer_screen does. */
export default function NewCustomerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const c = useThemeColors();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    taxNo: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    api
      .customer(String(id))
      .then((row: any) =>
        setForm({
          firstName: row.firstName ?? "",
          lastName: row.lastName ?? "",
          email: row.email ?? "",
          phoneNumber: row.phoneNumber ?? "",
          companyName: row.companyName ?? "",
          taxNo: row.taxNo ?? "",
          address: row.address ?? "",
        }),
      )
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [id]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (!form.firstName.trim()) throw new Error("First name is required");
      if (id) await api.updateCustomer(String(id), form);
      else await api.createCustomer(form);
      router.back();
    } catch (e: any) {
      setError(e?.message || "Failed to save");
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
        <Field
          label="First name *"
          value={form.firstName}
          onChangeText={(firstName) => setForm({ ...form, firstName })}
        />
        <Field
          label="Last name"
          value={form.lastName}
          onChangeText={(lastName) => setForm({ ...form, lastName })}
        />
        <Field
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(email) => setForm({ ...form, email })}
        />
        <Field
          label="Phone"
          value={form.phoneNumber}
          onChangeText={(phoneNumber) => setForm({ ...form, phoneNumber })}
        />
        <Field
          label="Company"
          value={form.companyName}
          onChangeText={(companyName) => setForm({ ...form, companyName })}
        />
        <Field
          label="Tax number"
          value={form.taxNo}
          onChangeText={(taxNo) => setForm({ ...form, taxNo })}
        />
        <Field
          label="Address"
          value={form.address}
          onChangeText={(address) => setForm({ ...form, address })}
        />
        {!!error && (
          <Text style={{ color: c.danger, marginBottom: 10 }}>{error}</Text>
        )}
        <PrimaryButton
          label={saving ? "Saving…" : id ? "Update customer" : "Save customer"}
          onPress={save}
          disabled={saving}
        />
      </ScrollView>
    </Screen>
  );
}
