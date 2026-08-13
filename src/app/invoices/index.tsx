import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { api } from "@/api/client";
import type { Invoice } from "@/types/paysuite";
import {
  Empty,
  Loading,
  money,
  PrimaryButton,
  RowItem,
  Screen,
} from "@/components/ui";
import { ListFilter, useListFilter } from "@/components/ListFilter";

export default function InvoicesScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, status, setStatus, statuses, filtered } = useListFilter(
    rows,
    (r) => [r.invoiceFullNumber, r.customer?.firstName, r.customer?.lastName],
    (r) => r.status,
  );


  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api.invoices());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function openPdf(id: string) {
    try {
      const doc = await api.invoiceDocument(id);
      const html = encodeURIComponent(doc.html);
      await WebBrowser.openBrowserAsync(`data:text/html;charset=utf-8,${html}`);
    } catch (e: any) {
      Alert.alert("PDF", e?.message || "Could not open document");
    }
  }

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
        <PrimaryButton label="New invoice" onPress={() => router.push("/invoices/new")} />
        <ListFilter
            query={query}
            onQuery={setQuery}
            status={status}
            onStatus={setStatus}
            statuses={statuses}
            placeholder="Search invoices"
          />
          <FlatList
          style={{ marginTop: 12 }}
          data={filtered}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No invoices yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.invoiceFullNumber}
              subtitle={`${item.customer?.firstName || "Customer"} · ${item.status}`}
              right={money(item.dueAmount ?? item.grandTotal - item.receivedAmount)}
              onPress={() => router.push(`/invoices/${item.id}` as any)}
              onLongPress={() => openPdf(item.id)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
