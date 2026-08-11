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

export default function NewPasswordScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; token?: string }>();
  const email = String(params.email || "");
  const token = String(params.token || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await api.resetPassword(email, token, password);
      router.replace("/(auth)/login");
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Title>New password</Title>
        <Subtitle>Choose a new password for {email}.</Subtitle>
        <View style={{ marginTop: 20 }}>
          <Field
            label="New password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          {!!error && (
            <Text style={{ color: c.danger, marginBottom: 12 }}>{error}</Text>
          )}
          <PrimaryButton
            label={loading ? "Saving…" : "Update password"}
            onPress={onSubmit}
            disabled={loading || password.length < 6}
          />
        </View>
      </View>
    </Screen>
  );
}
