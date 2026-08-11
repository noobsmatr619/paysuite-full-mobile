import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import type { Expense } from "@/types/paysuite";
import { Empty, Loading, money, PrimaryButton, RowItem, Screen } from "@/components/ui";

export default function ExpensesScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api.expenses());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

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
        <PrimaryButton label="Add expense" onPress={() => router.push("/expenses/new")} />
        <FlatList
          style={{ marginTop: 12 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No expenses yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.title}
              subtitle={`${item.category?.name || "Expense"} · ${new Date(item.date).toLocaleDateString()}`}
              right={money(item.amount)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
