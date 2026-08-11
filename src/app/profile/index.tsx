import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { api } from "@/api/client";
import type { UserProfile } from "@/types/paysuite";
import {
  Card,
  Loading,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    api
      .profile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Title>
          {[profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
            "My profile"}
        </Title>
        <Subtitle>{profile.email}</Subtitle>
        <Card style={{ marginTop: 16 }}>
          <Subtitle>Company: {profile.companyName || "—"}</Subtitle>
          <Subtitle>Phone: {profile.phoneNumber || "—"}</Subtitle>
          <Subtitle>Tax no: {profile.taxNo || "—"}</Subtitle>
          <Subtitle>Address: {profile.address || "—"}</Subtitle>
          <Subtitle>Tenant: {profile.tenantId || "—"}</Subtitle>
        </Card>
        <View style={{ marginTop: 20 }}>
          <PrimaryButton label="Sign out" onPress={() => logout()} />
        </View>
      </ScrollView>
    </Screen>
  );
}
