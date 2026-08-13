import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { api } from "@/api/client";
import { Field, Loading, PrimaryButton, Screen, Title } from "@/components/ui";
import { useI18n } from "@/i18n";

/** Flutter /profile-edit — edit your own details. */
export default function EditProfileScreen() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    api
      .profile()
      .then((p: any) =>
        setForm({
          firstName: p?.firstName ?? "",
          lastName: p?.lastName ?? "",
          email: p?.email ?? "",
          phone: p?.phone ?? "",
          address: p?.address ?? ""
        })
      )
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!form.firstName.trim()) return Alert.alert("First name is required");
    setSaving(true);
    try {
      await api.updateProfile(form);
      router.back();
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Could not save your profile");
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

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ gap: 4 }}>
          <Title>{t("profile")}</Title>
          <Field label="First name" value={form.firstName} onChangeText={set("firstName")} />
          <Field label="Last name" value={form.lastName} onChangeText={set("lastName")} />
          <Field
            label="Email"
            value={form.email}
            onChangeText={set("email")}
            keyboardType="email-address"
          />
          <Field label="Phone" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" />
          <Field label="Address" value={form.address} onChangeText={set("address")} />
          <PrimaryButton label={saving ? "Saving…" : "Save"} onPress={save} />
        </View>
      </ScrollView>
    </Screen>
  );
}
