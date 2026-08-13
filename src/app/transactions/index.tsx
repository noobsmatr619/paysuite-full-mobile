import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import type { Transaction } from "@/types/paysuite";
import { Empty, Loading, money, RowItem, Screen } from "@/components/ui";
import { ListFilter, useListFilter } from "@/components/ListFilter";

export default function TransactionsScreen() {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, status, setStatus, statuses, filtered } = useListFilter(
    rows,
    (r) => [r.invoiceFullNumber, r.customer?.firstName, r.paymentMethod?.name],
  );


  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api.transactions());
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
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No transactions yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.invoiceFullNumber || "Payment"}
              subtitle={
                item.customer
                  ? `${item.customer.firstName} ${item.customer.lastName || ""}`
                  : item.paymentMethod?.name || "—"
              }
              right={money(item.amount)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
