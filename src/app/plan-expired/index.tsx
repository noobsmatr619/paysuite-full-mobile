import { useCallback, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import {
  Loading,
  PrimaryButton,
  RowItem,
  Screen,
  Subtitle,
  Title,
  money,
} from "@/components/ui";

export default function PlanExpiredScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        try {
          setPlans((await api.plans()) as any[]);
        } finally {
          setLoading(false);
        }
      })();
    }, []),
  );

  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ padding: 16, flex: 1 }}>
        <Title>Plan expired</Title>
        <Subtitle>
          Your subscription needs renewal to keep creating invoices and
          customers.
        </Subtitle>
        <FlatList
          style={{ marginTop: 16 }}
          data={plans}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <RowItem
              title={item.name}
              subtitle={`${item.frequency} · ${item.numberOfInvoices} invoices`}
              right={item.isFree || item.price === 0 ? "Free" : money(item.price)}
              onPress={async () => {
                try {
                  await api.activatePlan(item.id);
                  Alert.alert("Activated", item.name);
                  router.replace("/(tabs)");
                } catch (e: any) {
                  Alert.alert("Plan", e?.message || "Failed");
                }
              }}
            />
          )}
        />
        <PrimaryButton label="Back to app" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
