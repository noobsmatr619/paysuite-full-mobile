import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import type { MyPlan, Plan } from "@/types/paysuite";
import {
  Card,
  Loading,
  RowItem,
  Screen,
  Subtitle,
  Title,
  money,
} from "@/components/ui";
import { ListFilter, useListFilter } from "@/components/ListFilter";

export default function BillingScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [myPlan, setMyPlan] = useState<MyPlan | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, filtered } = useListFilter(plans as any[], (r: any) => [r.planName, r.status, r.reference]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, m, h, st] = await Promise.all([
        api.plans().catch(() => []),
        api.myPlan().catch(() => ({ subscriber: null })),
        api.billings().catch(() => []),
        api.subscriptionStatus().catch(() => null),
      ]);
      setPlans(p || []);
      setMyPlan(m);
      setHistory((h as any[]) ?? []);
      setSubscription(st);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !plans.length && !myPlan) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      >
        <Title>Plans</Title>
        {myPlan?.subscriber?.plan ? (
          <Card>
            <Subtitle>Current plan</Subtitle>
            <Title>{myPlan.subscriber.plan.name}</Title>
            <Subtitle>
              {money(myPlan.subscriber.plan.price)} /{" "}
              {myPlan.subscriber.plan.frequency}
            </Subtitle>
            {!!subscription && (
              <Subtitle>
                {subscription.expired
                  ? "Expired — renew to keep using the app"
                  : subscription.endDate
                    ? `Renews ${new Date(subscription.endDate).toLocaleDateString()}`
                    : "Active"}
              </Subtitle>
            )}
          </Card>
        ) : (
          <Subtitle>
            No active plan loaded (offline demo or not activated on web).
          </Subtitle>
        )}

        {(plans.length
          ? plans
          : [
              {
                id: "local-free",
                name: "Free",
                price: 0,
                frequency: "monthly",
                numberOfCustomers: 20,
                numberOfProducts: 20,
                numberOfInvoices: 50,
              },
              {
                id: "local-biz",
                name: "Business",
                price: 29,
                frequency: "monthly",
                numberOfCustomers: 500,
                numberOfProducts: 200,
                numberOfInvoices: 1000,
              },
            ]
        ).map((p: any) => (
          <Card key={p.id}>
            <Title>{p.name}</Title>
            <Subtitle>
              {p.price === 0 || p.isFree
                ? "Free"
                : `${money(p.price)} / ${p.frequency}`}
            </Subtitle>
            <View style={{ marginTop: 8 }}>
              <Subtitle>
                {p.numberOfCustomers} customers · {p.numberOfProducts} products
                · {p.numberOfInvoices} invoices
              </Subtitle>
            </View>
          </Card>
        ))}

        {/* Flutter's billing_history screen, reached from home and the
            plan-expired screen. */}
        <Title>Billing history</Title>
        {history.length === 0 ? (
          <Subtitle>No billing history yet.</Subtitle>
        ) : (
          history.map((b: any) => (
            <RowItem
              key={b.id}
              title={b.invoiceNumber}
              subtitle={`${b.plan?.name ?? "Plan"} · ${b.status}${
                b.paymentMethod?.name ? ` · ${b.paymentMethod.name}` : ""
              } · ${new Date(b.createdAt).toLocaleDateString()}`}
              right={money(b.amount)}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
