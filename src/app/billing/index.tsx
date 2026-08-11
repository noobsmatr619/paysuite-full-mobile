import { ScrollView, View } from "react-native";
import { Card, Screen, Subtitle, Title, money } from "@/components/ui";

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["20 customers", "20 products", "50 invoices"],
  },
  {
    name: "Business",
    price: 29,
    features: ["500 customers", "200 products", "1000 invoices"],
  },
  {
    name: "Enterprise",
    price: 99,
    features: ["Unlimited scale", "Priority support", "Custom limits"],
  },
];

export default function BillingScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Title>Plans</Title>
        <Subtitle>
          Mirrors PaySuite Free / Business / Enterprise subscription tiers.
        </Subtitle>
        {plans.map((p) => (
          <Card key={p.name}>
            <Title>{p.name}</Title>
            <Subtitle>
              {p.price === 0 ? "Free" : `${money(p.price)} / month`}
            </Subtitle>
            <View style={{ marginTop: 10, gap: 4 }}>
              {p.features.map((f) => (
                <Subtitle key={f}>• {f}</Subtitle>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
