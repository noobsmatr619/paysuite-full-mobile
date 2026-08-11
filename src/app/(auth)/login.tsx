import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  Field,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  useThemeColors,
} from "@/components/ui";
import { APP_NAME } from "@/constants/config";
import { USE_REMOTE_API } from "@/constants/config";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const c = useThemeColors();
  const [email, setEmail] = useState("demo@paysuite.app");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);

  async function onLogin() {
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e?.message || "Login failed");
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center", padding: 24 }}
      >
        <View style={{ marginBottom: 28 }}>
          <Title>{APP_NAME}</Title>
          <Subtitle>
            Invoicing, estimates, expenses & billing — on the go.
          </Subtitle>
        </View>

        <Field
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Field
          label={
            USE_REMOTE_API
              ? "Password (same as web signup)"
              : "Password (any for offline demo)"
          }
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        {!!error && (
          <Text style={{ color: c.danger, marginBottom: 12 }}>{error}</Text>
        )}

        <PrimaryButton
          label={loading ? "Signing in…" : "Sign in"}
          onPress={onLogin}
          disabled={loading || !email}
        />

        <Text
          onPress={() => router.push("/(auth)/register")}
          style={{ color: c.primary, marginTop: 16, fontWeight: "600" }}
        >
          Create account
        </Text>
        <Text
          onPress={() => router.push("/(auth)/forgot-password")}
          style={{ color: c.primary, marginTop: 10, fontWeight: "600" }}
        >
          Forgot password?
        </Text>

        <Text
          style={{
            color: c.textSecondary,
            marginTop: 18,
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {USE_REMOTE_API
            ? "Remote: EXPO_PUBLIC_API_URL=http://HOST:3011 (server port, not client). Uses real Wasp password + JWT (X-PaySuite-Token)."
            : "Offline demo mode with seeded local data. No backend required."}
        </Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}
