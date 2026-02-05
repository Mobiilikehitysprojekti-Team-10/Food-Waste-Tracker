import React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { WasteType } from "../../domain/types";
import { useTheme } from "../../../../context/ThemeContext";

export function WasteRow(props: {
  label: string;
  type: WasteType;
  selected: boolean;
  kgText: string;
  onToggle: () => void;
  onKgChange: (t: string) => void;
}) {
  const { label, selected, kgText, onToggle, onKgChange } = props;
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.row}>
      {/* Vasen puoli: Valintaruutu ja teksti */}
      <TouchableOpacity 
        style={styles.leftPressArea} 
        onPress={onToggle} 
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkbox, 
          { 
            borderColor: colors.primary,
            backgroundColor: selected ? colors.primary : "transparent" 
          } 
        ]}>
          {selected && <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>}
        </View>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      </TouchableOpacity>

      {/* Oikea puoli: Kilomäärän syöttö */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.kgInput, 
            { 
              color: colors.text, 
              borderColor: selected ? colors.primary : colors.border,
              backgroundColor: isDark ? colors.card : "#f9f9f9" 
            },
            !selected && styles.kgInputDisabled
          ]}
          value={kgText}
          onChangeText={onKgChange}
          placeholder="0.00"
          placeholderTextColor={isDark ? "#555" : "#ccc"} 
          keyboardType="decimal-pad"
          editable={selected}
        />
        <Text style={[styles.unit, { color: colors.text, opacity: selected ? 1 : 0.5 }]}>
          kg
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 4 
  },
  leftPressArea: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 12 
  },
  checkbox: { 
    width: 28, 
    height: 28, 
    borderWidth: 2, 
    borderRadius: 6, 
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  rowLabel: { 
    flex: 1, 
    fontSize: 18, 
    fontWeight: "500"
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  kgInput: { 
    width: 75, 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    textAlign: "right", 
    fontSize: 16 
  },
  kgInputDisabled: { 
    opacity: 0.3,
    backgroundColor: "transparent" 
  },
  unit: { 
    width: 30, 
    marginLeft: 6, 
    fontSize: 16,
    fontWeight: "600"
  },
});