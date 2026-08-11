import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import type { Estimate } from "@/types/paysuite";
import {
  Empty,
  Loading,
  money,
  PrimaryButton,
  RowItem,
  Screen,
} from "@/components/ui";

export default function EstimatesScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api.estimates());
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
          label="New estimate"
          onPress={() => router.push("/estimates/new")}
        />
        <FlatList
          style={{ marginTop: 12 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No estimates yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.estimateFullNumber}
              subtitle={`${item.customer?.firstName || "Customer"} · ${item.status}`}
              right={money(item.grandTotal)}
              onPress={() => router.push(`/estimates/${item.id}` as any)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
