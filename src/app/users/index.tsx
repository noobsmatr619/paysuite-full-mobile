import { useCallback, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api/client";
import {
  Empty,
  Field,
  Loading,
  PrimaryButton,
  RowItem,
  Screen,
  Title,
} from "@/components/ui";

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers((await api.users()) as any[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !users.length) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ padding: 16, flex: 1 }}>
        <Title>Team users</Title>
        <Field
          label="Invite email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <PrimaryButton
          label="Send invite"
          onPress={async () => {
            try {
              await api.inviteUser(email.trim());
              Alert.alert("Invited", email);
              setEmail("");
            } catch (e: any) {
              Alert.alert("Invite", e?.message || "Failed");
            }
          }}
        />
        <FlatList
          style={{ marginTop: 12 }}
          data={users}
          keyExtractor={(u) => u.id}
          ListEmptyComponent={<Empty text="No users" />}
          renderItem={({ item }) => (
            <RowItem
              title={item.email || item.username || item.id}
              subtitle={[item.firstName, item.lastName].filter(Boolean).join(" ")}
            />
          )}
        />
      </View>
    </Screen>
  );
}
