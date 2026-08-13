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
import { ListFilter, useListFilter } from "@/components/ListFilter";
import { RowActions } from "@/components/RowActions";

export default function ProductsScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const { query, setQuery, status, setStatus, statuses, filtered } = useListFilter(
    rows,
    (r) => [r.name, r.code],
  );


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
        <ListFilter
            query={query}
            onQuery={setQuery}
            placeholder="Search products"
          />
          <FlatList
          style={{ marginTop: 14 }}
          data={filtered}
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
              onPress={() => setSelected(item)}
            />
          )}
        />
      </View>

      <RowActions
        visible={!!selected}
        title={selected?.name}
        onClose={() => setSelected(null)}
        actions={[
          {
            label: "Edit",
            permission: "products.manage",
            onPress: () =>
              router.push({ pathname: "/products/new", params: { id: selected!.id } }),
          },
          {
            label: "Delete",
            permission: "products.manage",
            destructive: true,
            confirm: "This removes the product permanently.",
            onPress: async () => {
              await api.deleteProduct(selected!.id);
              await load();
            },
          },
        ]}
      />
    </Screen>
  );
}
