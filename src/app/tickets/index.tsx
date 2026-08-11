import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import type { Ticket } from "@/types/paysuite";
import { Empty, Loading, RowItem, Screen } from "@/components/ui";

export default function TicketsScreen() {
  const [rows, setRows] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api.tickets());
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
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No tickets yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.subject}
              subtitle={`${item.department?.name || "Dept"} · ${item.priority?.name || "Priority"}`}
              right={item.status}
            />
          )}
        />
      </View>
    </Screen>
  );
}
