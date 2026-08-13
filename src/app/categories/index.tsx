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

type Category = { id: string; name: string; type?: string };

/** Flutter /expanses-category — expense categories. */
export default function CategoriesScreen() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(((await api.categories("expense")) as Category[]) ?? []);
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
      await api.createCategory({ name: name.trim(), type: "expense" });
      setName("");
      await load();
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Could not save the category");
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
        <Title>Expense categories</Title>
        <Field label="Name" value={name} onChangeText={setName} placeholder="Travel" />
        <PrimaryButton label={saving ? "Saving…" : "Add category"} onPress={add} />

        <FlatList
          style={{ marginTop: 14 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          ListEmptyComponent={<Empty text="No categories yet" />}
          renderItem={({ item }) => <RowItem title={item.name} />}
        />
      </View>
    </Screen>
  );
}
