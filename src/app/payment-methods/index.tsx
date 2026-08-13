import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
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

type PaymentMethod = { id: string; name: string };

/** Flutter /payment-method — methods offered when recording a payment. */
export default function PaymentMethodsScreen() {
  const [rows, setRows] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(((await api.paymentMethods()) as PaymentMethod[]) ?? []);
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
    if (!name.trim()) return Alert.alert("Name is required");
    setSaving(true);
    try {
      await api.createPaymentMethod({ name: name.trim() });
      setName("");
      await load();
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Could not save the method");
    } finally {
      setSaving(false);
    }
  };

  const remove = (item: PaymentMethod) =>
    Alert.alert("Delete method", `Delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deletePaymentMethod(item.id);
            await load();
          } catch (e) {
            Alert.alert(e instanceof Error ? e.message : "Delete failed");
          }
        },
      },
    ]);

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
        <Title>Payment methods</Title>
        <Field label="Name" value={name} onChangeText={setName} placeholder="Bank transfer" />
        <PrimaryButton label={saving ? "Saving…" : "Add method"} onPress={add} />

        <FlatList
          style={{ marginTop: 14 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          ListEmptyComponent={<Empty text="No payment methods yet" />}
          renderItem={({ item }) => (
            <Pressable onLongPress={() => remove(item)}>
              <RowItem title={item.name} subtitle="Long press to delete" />
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}
