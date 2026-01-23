import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CustomGranularity } from "../../application/useCustomCompare";
import { isoWeeksInYear } from "../../domain/isoWeeks";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export function CustomRangeControls(props: {
  granularity: CustomGranularity;
  setGranularity: (g: CustomGranularity) => void;

  dayALabel: string;
  dayBLabel: string;
  onRequestPickDayA: () => void;
  onRequestPickDayB: () => void;

  weekYearA: number; setWeekYearA: (n: number) => void;
  weekNumA: number; setWeekNumA: (n: number) => void;
  weekYearB: number; setWeekYearB: (n: number) => void;
  weekNumB: number; setWeekNumB: (n: number) => void;

  monthYearA: number; setMonthYearA: (n: number) => void;
  monthIndexA: number; setMonthIndexA: (n: number) => void;
  monthYearB: number; setMonthYearB: (n: number) => void;
  monthIndexB: number; setMonthIndexB: (n: number) => void;
}) {
  const now = new Date().getFullYear();
  const years = [now - 2, now - 1, now, now + 1, now + 2];

  return (
    <View style={styles.block}>
      <Text style={styles.label}>Custom period</Text>

      <View style={styles.wrap}>
        <Picker
          selectedValue={props.granularity}
          onValueChange={(v) => props.setGranularity(String(v) as CustomGranularity)}
        >
          <Picker.Item label="Day" value="day" />
          <Picker.Item label="Week" value="week" />
          <Picker.Item label="Month" value="month" />
        </Picker>
      </View>

      {props.granularity === "day" && (
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.smallLabel}>A (day)</Text>
            <Text style={styles.pickBtn} onPress={props.onRequestPickDayA}>
              {props.dayALabel}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.smallLabel}>B (day)</Text>
            <Text style={styles.pickBtn} onPress={props.onRequestPickDayB}>
              {props.dayBLabel}
            </Text>
          </View>
        </View>
      )}

      {props.granularity === "week" && (
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.smallLabel}>A (week)</Text>
            <View style={styles.inline}>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Year</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.weekYearA} onValueChange={(v) => props.setWeekYearA(Number(v))}>
                    {years.map((y) => <Picker.Item key={y} label={String(y)} value={y} />)}
                  </Picker>
                </View>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Week</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.weekNumA} onValueChange={(v) => props.setWeekNumA(Number(v))}>
                    {Array.from({ length: isoWeeksInYear(props.weekYearA) }, (_, i) => i + 1).map((w) => (
                      <Picker.Item key={w} label={String(w)} value={w} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.smallLabel}>B (week)</Text>
            <View style={styles.inline}>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Year</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.weekYearB} onValueChange={(v) => props.setWeekYearB(Number(v))}>
                    {years.map((y) => <Picker.Item key={y} label={String(y)} value={y} />)}
                  </Picker>
                </View>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Week</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.weekNumB} onValueChange={(v) => props.setWeekNumB(Number(v))}>
                    {Array.from({ length: isoWeeksInYear(props.weekYearB) }, (_, i) => i + 1).map((w) => (
                      <Picker.Item key={w} label={String(w)} value={w} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {props.granularity === "month" && (
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.smallLabel}>A (month)</Text>
            <View style={styles.inline}>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Year</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.monthYearA} onValueChange={(v) => props.setMonthYearA(Number(v))}>
                    {years.map((y) => <Picker.Item key={y} label={String(y)} value={y} />)}
                  </Picker>
                </View>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Month</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.monthIndexA} onValueChange={(v) => props.setMonthIndexA(Number(v))}>
                    {MONTHS.map((m, idx) => <Picker.Item key={m} label={m} value={idx} />)}
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.smallLabel}>B (month)</Text>
            <View style={styles.inline}>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Year</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.monthYearB} onValueChange={(v) => props.setMonthYearB(Number(v))}>
                    {years.map((y) => <Picker.Item key={y} label={String(y)} value={y} />)}
                  </Picker>
                </View>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.tiny}>Month</Text>
                <View style={styles.wrap}>
                  <Picker selectedValue={props.monthIndexB} onValueChange={(v) => props.setMonthIndexB(Number(v))}>
                    {MONTHS.map((m, idx) => <Picker.Item key={m} label={m} value={idx} />)}
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8, marginTop: 10 },
  label: { fontSize: 14, fontWeight: "800" },
  wrap: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  twoCol: { flexDirection: "row", gap: 10 },
  col: { flex: 1, gap: 6 },
  smallLabel: { fontSize: 13, fontWeight: "700" },
  tiny: { fontSize: 12, color: "#666", marginBottom: 4 },
  inline: { gap: 10 },
  inlineItem: { marginBottom: 6 },
  pickBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontWeight: "700",
  },
});
