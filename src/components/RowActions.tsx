import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { api } from "@/api/client";
import { useThemeColors } from "@/components/ui";

/**
 * Flutter opens a popup menu on a list row (ProductItem, ExpensesItem) with the
 * edit and delete entries the user's permissions allow. This is that menu.
 */
export type RowAction = {
  label: string;
  permission?: string;
  destructive?: boolean;
  confirm?: string;
  onPress: () => void | Promise<void>;
};

/**
 * `my-permissions` answers with the keys the user's roles grant. It grants the
 * full set when no role is assigned, matching the owner case on the server.
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<string[] | null>(null);

  useEffect(() => {
    let live = true;
    api
      .permissions()
      .then((r: any) => live && setPermissions(r?.permissions ?? []))
      .catch(() => live && setPermissions([]));
    return () => {
      live = false;
    };
  }, []);

  // Until the answer lands, nothing is hidden — the server enforces the real
  // check, and hiding then showing rows would flicker.
  const can = (key?: string) =>
    !key || permissions === null || permissions.includes(key) || permissions.includes("*");

  return { permissions, can };
}

export function RowActions({
  visible,
  title,
  actions,
  onClose,
}: {
  visible: boolean;
  title?: string;
  actions: RowAction[];
  onClose: () => void;
}) {
  const c = useThemeColors();
  const { can } = usePermissions();
  const allowed = actions.filter((a) => can(a.permission));

  const run = (action: RowAction) => {
    const go = async () => {
      onClose();
      await action.onPress();
    };
    if (!action.confirm) return void go();
    Alert.alert(action.label, action.confirm, [
      { text: "Cancel", style: "cancel" },
      {
        text: action.label,
        style: action.destructive ? "destructive" : "default",
        onPress: () => void go(),
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: c.card,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            paddingBottom: 28,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {!!title && (
            <Text style={{ color: c.textSecondary, marginBottom: 8, fontSize: 13 }}>
              {title}
            </Text>
          )}
          {allowed.length === 0 ? (
            <Text style={{ color: c.textSecondary, paddingVertical: 12 }}>
              You do not have permission to change this.
            </Text>
          ) : (
            allowed.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => run(action)}
                style={{ paddingVertical: 14, borderTopWidth: 1, borderTopColor: c.border }}
              >
                <Text
                  style={{
                    color: action.destructive ? "#dc2626" : c.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
