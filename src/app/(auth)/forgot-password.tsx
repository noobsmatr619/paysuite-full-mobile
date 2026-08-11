import { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import {
  Field,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  useThemeColors,
} from "@/components/ui";

export default function ForgotPasswordScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await api.forgotPassword(email.trim().toLowerCase());
      setMsg(
        res.debugOtp
          ? `OTP (dev): ${res.debugOtp}`
          : res.message || "If the account exists, an OTP was sent",
      );
      router.push({
        pathname: "/(auth)/otp",
        params: {
          email: email.trim().toLowerCase(),
          debugOtp: res.debugOtp || "",
        },
      });
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Title>Forgot password</Title>
        <Subtitle>We will send a one-time code to reset your password.</Subtitle>
        <View style={{ marginTop: 20 }}>
          <Field
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {!!error && (
            <Text style={{ color: c.danger, marginBottom: 12 }}>{error}</Text>
          )}
          {!!msg && (
            <Text style={{ color: c.success, marginBottom: 12 }}>{msg}</Text>
          )}
          <PrimaryButton
            label={loading ? "Sending…" : "Send OTP"}
            onPress={onSubmit}
            disabled={loading || !email}
          />
        </View>
      </View>
    </Screen>
  );
}
