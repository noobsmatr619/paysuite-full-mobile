import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import type { Customer } from "@/types/paysuite";
import {
  Empty,
  Loading,
  PrimaryButton,
  RowItem,
  Screen,
} from "@/components/ui";

export default function CustomersScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api.customers());
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
        <PrimaryButton
          label="Add customer"
          onPress={() => router.push("/customers/new")}
        />
        <FlatList
          style={{ marginTop: 14 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No customers yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={`${item.firstName} ${item.lastName || ""}`.trim()}
              subtitle={item.companyName || item.email || "—"}
              right={item.status}
              onPress={() => router.push(`/customers/${item.id}` as any)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
