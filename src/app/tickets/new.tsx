import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/api/client";
import { Field, PrimaryButton, Screen } from "@/components/ui";

export default function NewTicketScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Subject" value={subject} onChangeText={setSubject} />
        <Field label="Description" value={body} onChangeText={setBody} />
        <PrimaryButton
          label={saving ? "Saving…" : "Create ticket"}
          disabled={saving}
          onPress={async () => {
            setSaving(true);
            try {
              await api.createTicket({ subject, body });
              router.back();
            } catch (e: any) {
              Alert.alert("Error", e?.message || "Failed");
            } finally {
              setSaving(false);
            }
          }}
        />
      </ScrollView>
    </Screen>
  );
}
