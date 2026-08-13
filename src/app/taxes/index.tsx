import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import {
  Empty,
  Field,
  Loading,
  PrimaryButton,
  RowItem,
  Screen,
  Title,
} from "@/components/ui";

type Tax = { id: string; name: string; rate: number };

/** Flutter /taxes — tax rates used on invoice and estimate lines. */
export default function TaxesScreen() {
  const [rows, setRows] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(((await api.taxes()) as Tax[]) ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const add = async () => {
    const parsed = Number(rate);
    if (!name.trim()) return Alert.alert("Name is required");
    if (!Number.isFinite(parsed) || parsed < 0)
      return Alert.alert("Rate must be a number of 0 or more");
    setSaving(true);
    try {
      await api.createTax({ name: name.trim(), rate: parsed });
      setName("");
      setRate("");
      await load();
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Could not save the tax");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !rows.length) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ padding: 16, flex: 1 }}>
        <Title>Taxes</Title>
        <Field label="Name" value={name} onChangeText={setName} placeholder="VAT" />
        <Field
          label="Rate (%)"
          value={rate}
          onChangeText={setRate}
          keyboardType="numeric"
          placeholder="20"
        />
        <PrimaryButton label={saving ? "Saving…" : "Add tax"} onPress={add} />

        <FlatList
          style={{ marginTop: 14 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          ListEmptyComponent={<Empty text="No taxes yet" />}
          renderItem={({ item }) => (
            <RowItem title={item.name} right={`${item.rate}%`} />
          )}
        />
      </View>
    </Screen>
  );
}
