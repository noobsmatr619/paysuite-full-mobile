import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { api } from "@/api/client";
import {
  Loading,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  money,
  useThemeColors,
} from "@/components/ui";

export default function EstimateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useThemeColors();
  const router = useRouter();
  const [est, setEst] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEst(await api.estimate(String(id)));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading || !est) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Title>{est.estimateFullNumber}</Title>
        <Subtitle>
          {est.customer?.firstName} · {est.status}
        </Subtitle>
        <Text style={{ color: c.text, marginTop: 8 }}>
          {money(est.grandTotal)}
        </Text>
        <View style={{ marginTop: 16, gap: 10 }}>
          <PrimaryButton
            label="Open document"
            onPress={async () => {
              try {
                const doc: any = await api.estimateDocument(String(id));
                const html = encodeURIComponent(doc.html);
                await WebBrowser.openBrowserAsync(
                  `data:text/html;charset=utf-8,${html}`,
                );
              } catch (e: any) {
                Alert.alert("Doc", e?.message || "Failed");
              }
            }}
          />
          <PrimaryButton
            label="Convert to invoice"
            onPress={async () => {
              try {
                const inv: any = await api.convertEstimate(String(id));
                Alert.alert("Converted", inv.invoiceFullNumber || "OK");
                router.push(`/invoices/${inv.id}` as any);
              } catch (e: any) {
                Alert.alert("Convert", e?.message || "Failed");
              }
            }}
          />
          <PrimaryButton
            label="Resend to customer"
            onPress={async () => {
              try {
                const r: any = await api.resendEstimateMail(String(id));
                Alert.alert("Sent", r?.result?.to ? `Sent to ${r.result.to}` : "Estimate sent");
              } catch (e: any) {
                Alert.alert("Resend", e?.message || "Failed");
              }
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
