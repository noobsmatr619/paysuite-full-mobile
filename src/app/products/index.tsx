import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import type { Product } from "@/types/paysuite";
import {
  Empty,
  Loading,
  money,
  PrimaryButton,
  RowItem,
  Screen,
} from "@/components/ui";

export default function ProductsScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api.products());
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
          label="Add product"
          onPress={() => router.push("/products/new")}
        />
        <FlatList
          style={{ marginTop: 14 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No products yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.name}
              subtitle={item.code || "No code"}
              right={money(item.price)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
