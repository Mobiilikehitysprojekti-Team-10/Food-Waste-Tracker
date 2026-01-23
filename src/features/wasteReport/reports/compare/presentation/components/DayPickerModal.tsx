import React, { useEffect, useMemo, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

type Props = {
  visible: boolean;
  title: string;
  value: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
};

function isValidDate(d: any): d is Date {
  return d instanceof Date && Number.isFinite(d.getTime());
}

export function DayPickerModal(props: Props) {
  const safeValue = useMemo(() => (isValidDate(props.value) ? props.value : new Date()), [props.value]);

  const [draft, setDraft] = useState<Date>(safeValue);

  useEffect(() => {
    if (props.visible) setDraft(safeValue);
  }, [props.visible, safeValue]);

  function onChangeInternal(e: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === "android") {
      if (e.type === "set" && selected) props.onChange(selected);
      props.onClose();
      return;
    }
    if (selected) setDraft(selected);
  }

  if (Platform.OS === "android") {
    return props.visible ? (
      <DateTimePicker value={safeValue} mode="date" display="default" onChange={onChangeInternal} />
    ) : null;
  }

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={props.onClose}
    >
      <Pressable style={styles.backdrop} onPress={props.onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{props.title}</Text>

          {/* Älä käytä overflow: hidden tässä, se leikkaa kalenteria */}
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={draft}
              mode="date"
              display="spinner"
              onChange={onChangeInternal}
              style={styles.picker}
              textColor="#000"
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                props.onChange(draft);
                props.onClose();
              }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  pickerWrap: {
    height: 260,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: 260,
  },

  actions: {
    marginTop: 10,
    alignItems: "center",
  },
  btn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 120,
    alignItems: "center",
  },
  btnText: { fontSize: 14, fontWeight: "700" },
});

