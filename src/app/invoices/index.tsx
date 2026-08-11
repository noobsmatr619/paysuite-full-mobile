import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { api } from "@/api/client";
import type { Invoice } from "@/types/paysuite";
import {
  Empty,
  Loading,
  money,
  RowItem,
  Screen,
} from "@/components/ui";

export default function InvoicesScreen() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

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
        <FlatList
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No invoices yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.invoiceFullNumber}
              subtitle={`${item.customer?.firstName || "Customer"} · ${item.status} · tap for PDF`}
              right={money(item.dueAmount ?? item.grandTotal - item.receivedAmount)}
              onPress={() => openPdf(item.id)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
