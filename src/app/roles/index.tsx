import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import { Empty, Loading, RowItem, Screen, Title } from "@/components/ui";
import { ListFilter, useListFilter } from "@/components/ListFilter";

type Role = { id: string; name: string; description?: string; permissions?: string };

/** Flutter /role-screen — roles and how many permissions each carries. */
export default function RolesScreen() {
  const [rows, setRows] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, filtered } = useListFilter(rows as any[], (r: any) => [r.name, r.description]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(((await api.roles()) as Role[]) ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const permissionCount = (role: Role) => {
    if (!role.permissions) return 0;
    try {
      const parsed = JSON.parse(role.permissions);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

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
        <Title>Roles</Title>
        <FlatList
          ListHeaderComponent={<ListFilter query={query} onQuery={setQuery} placeholder="Search roles" />}
          style={{ marginTop: 14 }}
          data={filtered}
          keyExtractor={(i) => i.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          ListEmptyComponent={<Empty text="No roles yet" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.name}
              subtitle={item.description || "No description"}
              right={`${permissionCount(item)} perms`}
            />
          )}
        />
      </View>
    </Screen>
  );
}
