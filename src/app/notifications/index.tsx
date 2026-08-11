import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import {
  Empty,
  Loading,
  PrimaryButton,
  RowItem,
  Screen,
  Title,
} from "@/components/ui";

export default function NotificationsScreen() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows((await api.notifications()) as any[]);
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
        <Title>Notifications</Title>
        <PrimaryButton
          label="Mark all read"
          onPress={async () => {
            await api.markAllNotificationsRead();
            load();
          }}
        />
        <FlatList
          style={{ marginTop: 12 }}
          data={rows}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={<Empty text="No notifications" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.title}
              subtitle={item.body}
              right={item.isRead ? "read" : "new"}
              onPress={async () => {
                if (!item.isRead) {
                  await api.markNotificationRead(item.id);
                  load();
                }
              }}
            />
          )}
        />
      </View>
    </Screen>
  );
}
