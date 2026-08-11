import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import {
  Card,
  Loading,
  Screen,
  Subtitle,
  Title,
  money,
} from "@/components/ui";

export default function BillingScreen() {
  const [plans, setPlans] = useState<any[]>([]);
  const [myPlan, setMyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([
        api.plans().catch(() => []),
        api.myPlan().catch(() => ({ subscriber: null })),
      ]);
      setPlans(p || []);
      setMyPlan(m);
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
      </ScrollView>
    </Screen>
  );
}
