import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SimpleBarChart } from "./SimpleBarChart";

export function ChartModal(props: {
  visible: boolean;
  title: string;
  chartData: Array<{ label: string; value: number }>;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={props.onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={props.onClose} />

      {/* Centered card */}
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <Text style={styles.title}>{props.title}</Text>

          {/* Horizontal scroll so all bars fit */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={styles.scrollContent}
          >
            <SimpleBarChart data={props.chartData} height={320} barWidth={44} />
          </ScrollView>

          <Pressable style={styles.btn} onPress={props.onClose}>
            <Text style={styles.btnText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
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
  scrollContent: {
    paddingRight: 18,
  },
  btn: {
    marginTop: 12,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 140,
    alignItems: "center",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});



