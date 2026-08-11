import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import {
  PrimaryButton,
  RowItem,
  Screen,
  Subtitle,
  Title,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

const links = [
  { title: "Customers", href: "/customers" },
  { title: "Invoices", href: "/invoices" },
  { title: "Estimates", href: "/estimates" },
  { title: "Products", href: "/products" },
  { title: "Expenses", href: "/expenses" },
  { title: "Tickets", href: "/tickets" },
  { title: "Billing / plans", href: "/billing" },
  { title: "Profile", href: "/profile" },
] as const;

export default function MoreScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Title>Menu</Title>
        <Subtitle>{user?.email || "PaySuite modules"}</Subtitle>
        <View style={{ marginTop: 16 }}>
          {links.map((l) => (
            <RowItem
              key={l.href}
              title={l.title}
              subtitle="Open module"
              onPress={() => router.push(l.href as any)}
            />
          ))}
        </View>
        <View style={{ marginTop: 12 }}>
          <PrimaryButton label="Sign out" onPress={() => logout()} />
        </View>
      </ScrollView>
    </Screen>
  );
}
