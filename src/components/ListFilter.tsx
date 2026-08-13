import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useThemeColors } from "@/components/ui";

/**
 * Search plus optional status chips, matching the filter screens the Flutter
 * app ships as separate routes (invoice_filter, customer_filter and the rest).
 * Presented inline instead: the lists are short and a sheet for one text field
 * and a few chips is more navigation than the filtering is worth.
 */
export function useListFilter<T>(
  rows: T[],
  searchFields: (row: T) => (string | null | undefined)[],
  statusOf?: (row: T) => string | null | undefined,
) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const statuses = useMemo(() => {
    if (!statusOf) return [];
    return [...new Set(rows.map((r) => statusOf(r)).filter(Boolean) as string[])].sort();
  }, [rows, statusOf]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (status && statusOf?.(row) !== status) return false;
      if (!q) return true;
      return searchFields(row).some((f) => (f ?? "").toLowerCase().includes(q));
    });
  }, [rows, query, status, searchFields, statusOf]);

  return { query, setQuery, status, setStatus, statuses, filtered };
}

export function ListFilter({
  query,
  onQuery,
  status,
  onStatus,
  statuses,
  placeholder = "Search",
}: {
  query: string;
  onQuery: (v: string) => void;
  status?: string | null;
  onStatus?: (v: string | null) => void;
  statuses?: string[];
  placeholder?: string;
}) {
  const c = useThemeColors();

  return (
    <View style={{ gap: 8, marginTop: 12 }}>
      <TextInput
        value={query}
        onChangeText={onQuery}
        placeholder={placeholder}
        placeholderTextColor={c.textSecondary}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.card,
          color: c.text,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />

      {statuses && statuses.length > 1 && onStatus ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {[null, ...statuses].map((s) => {
            const active = status === s;
            return (
              <Pressable
                key={s ?? "__all"}
                onPress={() => onStatus(s)}
                style={{
                  borderWidth: 1,
                  borderColor: active ? c.primary : c.border,
                  backgroundColor: active ? c.card : "transparent",
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: active ? c.primary : c.textSecondary, fontSize: 13 }}>
                  {s ?? "All"}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}
