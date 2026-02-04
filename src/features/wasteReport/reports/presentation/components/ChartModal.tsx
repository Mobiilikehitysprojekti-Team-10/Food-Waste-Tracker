import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SimpleBarChart } from "./SimpleBarChart";

// Lisätty isDark ja colors tyyppimääritelmiin
export function ChartModal(props: {
  visible: boolean;
  title: string;
  chartData: Array<{ label: string; value: number }>;
  onClose: () => void;
  isDark?: boolean; 
  colors?: any;  
}) {
  // Käytetään joko propsina tuotuja värejä tai oletusarvoja
  const themeColors = props.colors;

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={props.onClose}
    >
      {/* Backdrop - tummennetaan hieman enemmän dark modessa */}
      <Pressable 
        style={[styles.backdrop, props.isDark && { backgroundColor: "rgba(0,0,0,0.7)" }]} 
        onPress={props.onClose} 
      />

      {/* Centered card */}
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={[
          styles.card, 
          themeColors && { backgroundColor: themeColors.card, borderColor: themeColors.border }
        ]}>
          <Text style={[styles.title, themeColors && { color: themeColors.text }]}>
            {props.title}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={styles.scrollContent}
          >
            {/* Välitetään isDark myös graafille, jotta se osaa vaihtaa tekstien värit */}
            <SimpleBarChart 
              data={props.chartData} 
              height={320} 
              barWidth={44} 
              isDark={props.isDark} 
            />
          </ScrollView>

          <Pressable 
            style={[
              styles.btn, 
              themeColors && { borderColor: themeColors.text }
            ]} 
            onPress={props.onClose}
          >
            <Text style={[styles.btnText, themeColors && { color: themeColors.text }]}>
              Close
            </Text>
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