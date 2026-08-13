import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  Stack,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { restoreLang } from "@/i18n";
import { Colors } from "@/constants/theme";

// Note: do not default API calls to localhost:3000 — see src/constants/config.ts

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, restoring } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    void restoreLang();
  }, []);

  useEffect(() => {
    // Hold every redirect until the stored token has been checked, otherwise a
    // returning user is bounced to login before the session finishes loading.
    if (restoring) return;
    const inAuth = segments[0] === "(auth)";
    if (!user && !inAuth) {
      router.replace("/(auth)/login");
    } else if (user && inAuth) {
      router.replace("/(tabs)");
    }
  }, [user, restoring, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const navTheme = {
    ...(scheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <AuthProvider>
      <ThemeProvider value={navTheme}>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="customers/index"
              options={{ headerShown: true, title: "Customers" }}
            />
            <Stack.Screen
              name="customers/new"
              options={{ headerShown: true, title: "New customer" }}
            />
            <Stack.Screen
              name="invoices/index"
              options={{ headerShown: true, title: "Invoices" }}
            />
            <Stack.Screen
              name="products/index"
              options={{ headerShown: true, title: "Products" }}
            />
            <Stack.Screen
              name="products/new"
              options={{ headerShown: true, title: "New product" }}
            />
            <Stack.Screen
              name="estimates/index"
              options={{ headerShown: true, title: "Estimates" }}
            />
            <Stack.Screen
              name="estimates/new"
              options={{ headerShown: true, title: "New estimate" }}
            />
            <Stack.Screen
              name="expenses/index"
              options={{ headerShown: true, title: "Expenses" }}
            />
            <Stack.Screen
              name="tickets/index"
              options={{ headerShown: true, title: "Tickets" }}
            />
            <Stack.Screen
              name="billing/index"
              options={{ headerShown: true, title: "Billing" }}
            />
            <Stack.Screen
              name="transactions/index"
              options={{ headerShown: true, title: "Transactions" }}
            />
            <Stack.Screen
              name="invoices/new"
              options={{ headerShown: true, title: "New invoice" }}
            />
            <Stack.Screen
              name="expenses/new"
              options={{ headerShown: true, title: "New expense" }}
            />
            <Stack.Screen
              name="tickets/new"
              options={{ headerShown: true, title: "New ticket" }}
            />
            <Stack.Screen
              name="profile/index"
              options={{ headerShown: true, title: "Profile" }}
            />
            <Stack.Screen
              name="invoices/[id]"
              options={{ headerShown: true, title: "Invoice" }}
            />
            <Stack.Screen
              name="customers/[id]"
              options={{ headerShown: true, title: "Customer" }}
            />
            <Stack.Screen
              name="estimates/[id]"
              options={{ headerShown: true, title: "Estimate" }}
            />
            <Stack.Screen
              name="tickets/[id]"
              options={{ headerShown: true, title: "Ticket" }}
            />
            <Stack.Screen
              name="notifications/index"
              options={{ headerShown: true, title: "Notifications" }}
            />
            <Stack.Screen
              name="settings/index"
              options={{ headerShown: true, title: "Settings" }}
            />
            <Stack.Screen
              name="users/index"
              options={{ headerShown: true, title: "Users" }}
            />
            <Stack.Screen
              name="plan-expired/index"
              options={{ headerShown: true, title: "Plan" }}
            />
          </Stack>
        </AuthGate>
      </ThemeProvider>
    </AuthProvider>
  );
}
