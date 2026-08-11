import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { api } from "@/api/client";
import {
  Field,
  Loading,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  useThemeColors,
} from "@/components/ui";

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useThemeColors();
  const [ticket, setTicket] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTicket(await api.ticketDetail(String(id)));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading || !ticket) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Title>{ticket.subject}</Title>
        <Subtitle>
          {ticket.status} · {ticket.department?.name} · {ticket.priority?.name}
        </Subtitle>
        {!!ticket.body && (
          <Text style={{ color: c.text, marginTop: 12 }}>{ticket.body}</Text>
        )}
        <View style={{ marginTop: 16, flexDirection: "row", gap: 8 }}>
          {["pending", "open", "closed"].map((s) => (
            <PrimaryButton
              key={s}
              label={s}
              onPress={async () => {
                await api.updateTicketStatus(String(id), s);
                load();
              }}
            />
          ))}
        </View>
        <View style={{ marginTop: 20 }}>
          <Title>Comments</Title>
          {(ticket.comments || []).map((cm: any) => (
            <View
              key={cm.id}
              style={{
                marginTop: 8,
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>
                {cm.user?.email || cm.userType}
              </Text>
              <Text style={{ color: c.text, marginTop: 4 }}>{cm.comment}</Text>
            </View>
          ))}
          <Field
            label="Add comment"
            value={comment}
            onChangeText={setComment}
          />
          <PrimaryButton
            label="Post"
            onPress={async () => {
              if (!comment.trim()) return;
              try {
                await api.addTicketComment(String(id), comment.trim());
                setComment("");
                load();
              } catch (e: any) {
                Alert.alert("Comment", e?.message || "Failed");
              }
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
