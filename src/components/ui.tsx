import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors, money } from "@/constants/theme";

export function useThemeColors() {
  const scheme = useColorScheme();
  return Colors[scheme === "dark" ? "dark" : "light"];
}

export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const c = useThemeColors();
  return (
    <View style={[{ flex: 1, backgroundColor: c.background }, style]}>
      {children}
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  const c = useThemeColors();
  return <Text style={[styles.title, { color: c.text }]}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  const c = useThemeColors();
  return (
    <Text style={[styles.subtitle, { color: c.textSecondary }]}>{children}</Text>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const c = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.card, borderColor: c.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger" | "warning";
}) {
  const c = useThemeColors();
  const valueColor =
    tone === "success"
      ? c.success
      : tone === "danger"
        ? c.danger
        : tone === "warning"
          ? c.warning
          : c.text;
  return (
    <Card style={styles.stat}>
      <Text style={{ color: c.textSecondary, fontSize: 12, fontWeight: "600" }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: valueColor, fontSize: 20, fontWeight: "700", marginTop: 6 }}>
        {value}
      </Text>
    </Card>
  );
}

export function RowItem({
  title,
  subtitle,
  right,
  onPress,
}: {
  title: string;
  subtitle?: string;
  right?: string;
  onPress?: () => void;
}) {
  const c = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.text, fontWeight: "600", fontSize: 16 }}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={{ color: c.textSecondary, marginTop: 2, fontSize: 13 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {!!right && (
        <Text style={{ color: c.primary, fontWeight: "700" }}>{right}</Text>
      )}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const c = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: c.primary, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function Field(props: TextInputProps & { label: string }) {
  const c = useThemeColors();
  const { label, style, ...rest } = props;
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: c.textSecondary, marginBottom: 6, fontSize: 13 }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={c.textSecondary}
        style={[
          styles.input,
          {
            color: c.text,
            borderColor: c.border,
            backgroundColor: c.card,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

export function Loading() {
  const c = useThemeColors();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={c.primary} />
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  const c = useThemeColors();
  return (
    <View style={styles.center}>
      <Text style={{ color: c.textSecondary }}>{text}</Text>
    </View>
  );
}

export function StatusPill({ status }: { status: string }) {
  const c = useThemeColors();
  const color =
    status === "paid" || status === "active" || status === "solved"
      ? c.success
      : status === "due" || status === "rejected"
        ? c.danger
        : c.warning;
  return (
    <View style={[styles.pill, { backgroundColor: color + "22" }]}>
      <Text style={{ color, fontSize: 12, fontWeight: "600", textTransform: "capitalize" }}>
        {status.replaceAll("_", " ")}
      </Text>
    </View>
  );
}

export { money };

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  stat: { flex: 1, minWidth: "45%" },
  row: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
