import { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/api/client";
import {
  Field,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  useThemeColors,
} from "@/components/ui";

export default function OtpScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; debugOtp?: string }>();
  const email = String(params.email || "");
  const [otp, setOtp] = useState(String(params.debugOtp || ""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.verifyOtp(email, otp.trim());
      router.push({
        pathname: "/(auth)/new-password",
        params: { email, token: res.token },
      });
    } catch (e: any) {
      setError(e?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Title>Verify OTP</Title>
        <Subtitle>Enter the code sent for {email || "your email"}.</Subtitle>
        <View style={{ marginTop: 20 }}>
          <Field
            label="OTP code"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />
          {!!error && (
            <Text style={{ color: c.danger, marginBottom: 12 }}>{error}</Text>
          )}
          <PrimaryButton
            label={loading ? "Verifying…" : "Verify"}
            onPress={onSubmit}
            disabled={loading || !otp}
          />
        </View>
      </View>
    </Screen>
  );
}
