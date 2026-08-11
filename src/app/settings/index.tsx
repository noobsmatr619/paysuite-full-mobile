import { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "@/api/client";
import {
  Field,
  PrimaryButton,
  RowItem,
  Screen,
  Subtitle,
  Title,
} from "@/components/ui";

export default function SettingsScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState<any[]>([]);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState("10");
  const [methodName, setMethodName] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const load = useCallback(async () => {
    try {
      const [m, t] = await Promise.all([api.paymentMethods(), api.taxes()]);
      setMethods(m as any[]);
      setTaxes(t as any[]);
    } catch {
      /* offline */
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Title>Settings</Title>
        <Subtitle>Taxes, payment methods, security</Subtitle>

        <View style={{ marginTop: 16 }}>
          <Title>Taxes</Title>
          {taxes.map((t) => (
            <RowItem
              key={t.id}
              title={t.name}
              right={`${t.rate}%`}
            />
          ))}
          <Field label="Tax name" value={taxName} onChangeText={setTaxName} />
          <Field label="Rate %" value={taxRate} onChangeText={setTaxRate} />
          <PrimaryButton
            label="Add tax"
            onPress={async () => {
              await api.createTax({
                name: taxName || "Tax",
                rate: Number(taxRate) || 0,
              });
              setTaxName("");
              load();
            }}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <Title>Payment methods</Title>
          {methods.map((m) => (
            <RowItem
              key={m.id}
              title={m.name}
              subtitle={m.type}
              right="Delete"
              onPress={async () => {
                await api.deletePaymentMethod(m.id);
                load();
              }}
            />
          ))}
          <Field
            label="Method name"
            value={methodName}
            onChangeText={setMethodName}
          />
          <PrimaryButton
            label="Add method"
            onPress={async () => {
              await api.createPaymentMethod({
                name: methodName || "Cash",
                type: "cash",
              });
              setMethodName("");
              load();
            }}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <Title>Change password</Title>
          <Field
            label="Current"
            secureTextEntry
            value={currentPw}
            onChangeText={setCurrentPw}
          />
          <Field
            label="New"
            secureTextEntry
            value={newPw}
            onChangeText={setNewPw}
          />
          <PrimaryButton
            label="Update password"
            onPress={async () => {
              try {
                await api.changePassword(currentPw, newPw);
                Alert.alert("OK", "Password updated");
                setCurrentPw("");
                setNewPw("");
              } catch (e: any) {
                Alert.alert("Error", e?.message || "Failed");
              }
            }}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <PrimaryButton
            label="Users & invites"
            onPress={() => router.push("/users" as any)}
          />
          <PrimaryButton
            label="Request account delete"
            onPress={() => {
              Alert.alert("Delete account?", "A request will be recorded", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Request",
                  style: "destructive",
                  onPress: async () => {
                    await api.requestAccountDelete("user requested");
                    Alert.alert("Recorded", "Deletion request saved");
                  },
                },
              ]);
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
