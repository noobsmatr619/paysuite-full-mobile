import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  Field,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  useThemeColors,
} from "@/components/ui";

export default function RegisterScreen() {
  const c = useThemeColors();
  const { register, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    try {
      await register({
        email: email.trim(),
        password,
        firstName,
        companyName,
      });
    } catch (e: any) {
      setError(e?.message || "Registration failed");
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48 }}>
          <Title>Create account</Title>
          <Subtitle>Register a company workspace on PaySuite.</Subtitle>
          <View style={{ marginTop: 20 }}>
            <Field
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <Field
              label="Company"
              value={companyName}
              onChangeText={setCompanyName}
            />
            <Field
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Field
              label="Password (min 6)"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            {!!error && (
              <Text style={{ color: c.danger, marginBottom: 12 }}>{error}</Text>
            )}
            <PrimaryButton
              label={loading ? "Creating…" : "Register"}
              onPress={onSubmit}
              disabled={loading || !email || password.length < 6}
            />
            <Link
              href="/(auth)/login"
              style={{ marginTop: 16, color: c.primary }}
            >
              Already have an account? Sign in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
