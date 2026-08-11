import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import type { DashboardStats, Transaction } from "@/types/paysuite";
import {
  Loading,
  money,
  PrimaryButton,
  Screen,
  StatTile,
  Subtitle,
  Title,
  RowItem,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([api.stats(), api.transactions()]);
      setStats(s);
      setTx(t.slice(0, 5));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !stats) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      >
        <Title>Dashboard</Title>
        <Subtitle>
          {user?.companyName || user?.email || "PaySuite"} — financial overview
        </Subtitle>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 18,
          }}
        >
          <StatTile
            label="Revenue"
            value={money(stats?.totalRevenue || 0)}
          />
          <StatTile
            label="Paid"
            value={money(stats?.totalPaid || 0)}
            tone="success"
          />
          <StatTile
            label="Due"
            value={money(stats?.totalDue || 0)}
            tone="danger"
          />
          <StatTile
            label="Expenses"
            value={money(stats?.totalExpenses || 0)}
            tone="warning"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 10,
          }}
        >
          <StatTile label="Customers" value={String(stats?.customerCount || 0)} />
          <StatTile label="Invoices" value={String(stats?.invoiceCount || 0)} />
          <StatTile label="Products" value={String(stats?.productCount || 0)} />
        </View>

        <View style={{ marginTop: 20, gap: 10 }}>
          <PrimaryButton
            label="Customers"
            onPress={() => router.push("/customers")}
          />
          <PrimaryButton
            label="Invoices"
            onPress={() => router.push("/invoices")}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <Title>Recent payments</Title>
          <View style={{ marginTop: 12 }}>
            {tx.map((t) => (
              <RowItem
                key={t.id}
                title={t.invoiceFullNumber || "Payment"}
                subtitle={
                  t.customer
                    ? `${t.customer.firstName} ${t.customer.lastName || ""}`
                    : t.paymentMethod?.name || "—"
                }
                right={money(t.amount)}
              />
            ))}
            {!tx.length && (
              <Subtitle>No transactions yet. Collect an invoice payment.</Subtitle>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
