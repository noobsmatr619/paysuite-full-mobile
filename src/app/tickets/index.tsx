import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import type { Ticket } from "@/types/paysuite";
import {
  Empty,
  Loading,
  PrimaryButton,
  RowItem,
  Screen,
} from "@/components/ui";
import { ListFilter, useListFilter } from "@/components/ListFilter";

export default function TicketsScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, status, setStatus, statuses, filtered } = useListFilter(
    rows,
    (r) => [r.subject, r.department?.name, r.priority?.name],
    (r) => r.status,
  );


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
        <PrimaryButton
          label="New ticket"
          onPress={() => router.push("/tickets/new")}
        />
        <ListFilter
            query={query}
            onQuery={setQuery}
            status={status}
            onStatus={setStatus}
            statuses={statuses}
            placeholder="Search tickets"
          />
          <FlatList
          style={{ marginTop: 12 }}
          data={filtered}
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
              onPress={() => router.push(`/tickets/${item.id}` as any)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
