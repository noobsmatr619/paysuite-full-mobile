import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { api } from "@/api/client";
import { Field, PrimaryButton, Screen, Title, useThemeColors } from "@/components/ui";

type Role = { id: string; name: string };

/** Flutter /addUsers — invite a teammate and give them a role. */
export default function InviteUserScreen() {
  const c = useThemeColors();
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .roles()
      .then((r) => setRoles((r as Role[]) ?? []))
      .catch(() => setRoles([]));
  }, []);

  const invite = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      return Alert.alert("Enter a valid email address");
    }
    setSaving(true);
    try {
      await api.inviteUser(email.trim(), roleId ?? undefined);
      Alert.alert("Invitation sent", `${email.trim()} has been invited.`);
      router.back();
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Could not send the invitation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Title>Invite user</Title>
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="name@company.com"
        />

        <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 12, marginBottom: 6 }}>
          Role (optional)
        </Text>
        <View style={{ gap: 8 }}>
          {roles.map((role) => {
            const active = roleId === role.id;
            return (
              <Pressable
                key={role.id}
                onPress={() => setRoleId(active ? null : role.id)}
                style={{
                  borderWidth: 1,
                  borderColor: active ? c.primary : c.border,
                  backgroundColor: active ? c.card : "transparent",
                  borderRadius: 10,
                  padding: 12
                }}
              >
                <Text style={{ color: c.text, fontWeight: active ? "700" : "400" }}>{role.name}</Text>
              </Pressable>
            );
          })}
          {!roles.length ? (
            <Text style={{ color: c.textSecondary, fontSize: 12 }}>No roles defined yet.</Text>
          ) : null}
        </View>

        <View style={{ marginTop: 16 }}>
          <PrimaryButton label={saving ? "Sending…" : "Send invitation"} onPress={invite} />
        </View>
      </ScrollView>
    </Screen>
  );
}
