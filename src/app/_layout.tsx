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
import { Colors } from "@/constants/theme";

// Note: do not default API calls to localhost:3000 — see src/constants/config.ts

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";
    if (!user && !inAuth) {
      router.replace("/(auth)/login");
    } else if (user && inAuth) {
      router.replace("/(tabs)");
    }
  }, [user, segments]);

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
          </Stack>
        </AuthGate>
      </ThemeProvider>
    </AuthProvider>
  );
}
