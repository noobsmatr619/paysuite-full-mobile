import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
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
              ? "Token (Wasp user id)"
              : "Password (any for demo)"
          }
          secureTextEntry={!USE_REMOTE_API}
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
          style={{
            color: c.textSecondary,
            marginTop: 18,
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {USE_REMOTE_API
            ? "Remote mode: set EXPO_PUBLIC_API_URL to your Wasp server (e.g. http://YOUR_HOST:3001). Password field is the user UUID token."
            : "Offline demo mode with seeded local data. No backend required."}
        </Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}
