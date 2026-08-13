import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/api/client";
import {
  Loading,
  RowItem,
  Screen,
  Subtitle,
  Title,
  money,
  useThemeColors,
} from "@/components/ui";
import { RowActions } from "@/components/RowActions";

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useThemeColors();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [menu, setMenu] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cust, invs] = await Promise.all([
        api.customer(String(id)),
        api.customerInvoices(String(id)),
      ]);
      setCustomer(cust);
      setInvoices(invs as any[]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading || !customer) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Title>
          {customer.firstName} {customer.lastName || ""}
        </Title>
        <Subtitle>
          {customer.companyName || customer.email || "—"} · {customer.status}
        </Subtitle>
        <Text
          onPress={() => setMenu(true)}
          accessibilityRole="button"
          style={{ color: "#4f46e5", fontWeight: "600", marginTop: 8 }}
        >
          Edit or delete
        </Text>
        {!!customer.phoneNumber && (
          <Text style={{ color: c.textSecondary, marginTop: 8 }}>
            {customer.phoneNumber}
          </Text>
        )}
        {!!customer.address && (
          <Text style={{ color: c.textSecondary, marginTop: 4 }}>
            {customer.address}
          </Text>
        )}
        <View style={{ marginTop: 20 }}>
          <Title>Invoices</Title>
          {invoices.length === 0 && (
            <Text style={{ color: c.textSecondary, marginTop: 8 }}>
              No invoices
            </Text>
          )}
          {invoices.map((i) => (
            <RowItem
              key={i.id}
              title={i.invoiceFullNumber}
              subtitle={i.status}
              right={money(i.dueAmount ?? i.grandTotal)}
            />
          ))}
        </View>
      </ScrollView>

      <RowActions
        visible={menu}
        title={`${customer.firstName} ${customer.lastName || ""}`.trim()}
        onClose={() => setMenu(false)}
        actions={[
          {
            label: "Edit",
            permission: "customers.manage",
            onPress: () =>
              router.push({ pathname: "/customers/new", params: { id: String(id) } }),
          },
          {
            label: "Delete",
            permission: "customers.manage",
            destructive: true,
            confirm: "This removes the customer and cannot be undone.",
            onPress: async () => {
              await api.deleteCustomer(String(id));
              router.back();
            },
          },
        ]}
      />
    </Screen>
  );
}
