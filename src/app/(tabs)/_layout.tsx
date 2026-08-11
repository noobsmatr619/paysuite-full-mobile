import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useThemeColors } from "@/components/ui";

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  const c = useThemeColors();
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: focused ? "700" : "500",
        color: focused ? c.tabIconSelected : c.tabIconDefault,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const c = useThemeColors();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: c.card },
        headerTintColor: c.text,
        tabBarStyle: {
          backgroundColor: c.card,
          borderTopColor: c.border,
        },
        tabBarActiveTintColor: c.tabIconSelected,
        tabBarInactiveTintColor: c.tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Menu",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="More" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
