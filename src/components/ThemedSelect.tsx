import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export type ThemedSelectItem = {
  label: string;
  value: string;
};

export function ThemedSelect(props: {
  value: string;
  onChange: (v: string) => void;
  items: ThemedSelectItem[];
  placeholder: string;
  title?: string;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const hit = props.items.find((i) => i.value === props.value);
    return hit?.label ?? "";
  }, [props.items, props.value]);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.fieldText,
            { color: selectedLabel ? colors.text : colors.secondary },
          ]}
        >
          {selectedLabel || props.placeholder}
        </Text>

        {/* “chevron” ilman ikonikirjastoa */}
        <Text style={[styles.chevron, { color: colors.text }]}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
        />

        <View style={styles.center} pointerEvents="box-none">
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {props.title ?? props.placeholder}
            </Text>

            <FlatList
              data={[{ label: props.placeholder, value: "" }, ...props.items]}
              keyExtractor={(it) => `sel:${it.value}`}
              style={styles.list}
              renderItem={({ item }) => {
                const selected = item.value === props.value;

                return (
                  <Pressable
                    onPress={() => {
                      props.onChange(item.value);
                      setOpen(false);
                    }}
                    style={[
                      styles.row,
                      selected && {
                        borderColor: colors.primary,
                        backgroundColor: colors.background,
                      },
                      { borderColor: colors.border },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.rowText,
                        { color: colors.text },
                      ]}
                    >
                      {item.label}
                    </Text>

                    {selected ? (
                      <Text style={[styles.check, { color: colors.primary }]}>
                        ✓
                      </Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />

            <Pressable
              onPress={() => setOpen(false)}
              style={[styles.closeBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.closeText, { color: colors.text }]}>
                Sulje
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldText: { fontSize: 16, fontWeight: "500", flex: 1, paddingRight: 10 },
  chevron: { fontSize: 18, fontWeight: "700" },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  center: { flex: 1, justifyContent: "center", padding: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    maxHeight: "75%",
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 10 },

  list: { borderRadius: 12 },
  row: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: { fontSize: 16, fontWeight: "500", flex: 1 },
  check: { fontSize: 18, fontWeight: "800" },

  closeBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  closeText: { fontSize: 16, fontWeight: "600" },
});
