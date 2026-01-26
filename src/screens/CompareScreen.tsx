import React, { useContext, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { AuthContext } from "../context/AuthContext";

import { useCustomCompare } from "../features/wasteReport/reports/compare/application/useCustomCompare";
import { DayPickerModal } from "../features/wasteReport/reports/compare/presentation/components/DayPickerModal";
import { CustomRangeControls } from "../features/wasteReport/reports/compare/presentation/components/CustomRangeControls";
import { PresetPicker } from "../features/wasteReport/reports/compare/presentation/components/PresetPicker";
import { ComparisonSummary } from "../features/wasteReport/reports/compare/presentation/components/ComparisonSummary";
import { ComparisonTable } from "../features/wasteReport/reports/compare/presentation/components/ComparisonTable";
import { SwapButton } from "../features/wasteReport/reports/compare/presentation/components/SwapButton";
import { CompareLegend } from "../features/wasteReport/reports/compare/presentation/components/CompareLegend";
import { GroupedBarChart } from "../features/wasteReport/reports/compare/presentation/components/GroupedBarChart";

import {
  LoadingBox,
  ErrorBox,
  EmptyBox,
  ScreenLayout,
  Card,
  SelectionPicker,
} from "../features/wasteReport/reports/presentation/components";

import { errorMessage } from "../features/wasteReport/reports/presentation/utils/errorMessage";

import { useLocations } from "../features/wasteReport/reports/application/useLocations";
import { useFavorites } from "../features/wasteReport/reports/application/useFavorites";
import { useReportScope } from "../features/wasteReport/reports/application/useReportScope";
import { useComparisonTotals } from "../features/wasteReport/reports/application/useComparisonTotals";
import { useValidatedSelection } from "../features/wasteReport/reports/application/useValidatedSelection";

import {
  listPresets,
  getPreset,
  type ComparePresetId,
} from "../features/wasteReport/reports/compare/domain/presets";
import { WASTE_TYPES } from "../features/wasteReport/domain";

export default function CompareScreen() {
  const { user } = useContext(AuthContext);
  const ownerUid = user?.name ?? "dev-user";

  const [selection, setSelection] = useState("");
  const [presetId, setPresetId] = useState<ComparePresetId>("prevWeek_vs_thisWeek");

  const presets = useMemo(() => listPresets(), []);
  const preset = useMemo(() => getPreset(presetId), [presetId]);

  const custom = useCustomCompare();
  const [openDay, setOpenDay] = useState<null | "A" | "B">(null);

  const { locations } = useLocations();
  const { favorites } = useFavorites(ownerUid);

  const { selectionLabel, locationIds, wasteTypes } = useReportScope({
    selectionValue: selection,
    locations,
    favorites,
  });

  const effectiveRangeA = presetId === "custom" ? custom.rangeA : preset.rangeA;
  const effectiveRangeB = presetId === "custom" ? custom.rangeB : preset.rangeB;

  const aLabel = presetId === "custom" ? `A (${custom.rangeA.label})` : preset.aLabel;
  const bLabel = presetId === "custom" ? `B (${custom.rangeB.label})` : preset.bLabel;

  const { aTotals, bTotals, loading, error } = useComparisonTotals({
    locationIds,
    wasteTypes,
    rangeA: effectiveRangeA,
    rangeB: effectiveRangeB,
  });

  const groupedData = useMemo(() => {
    const set = new Set(wasteTypes);
    const typeDefs = WASTE_TYPES.filter((w) => set.has(w.type));
    return typeDefs.map((w) => ({
      label: w.short,
      a: Number(aTotals?.[w.type] ?? 0),
      b: Number(bTotals?.[w.type] ?? 0),
    }));
  }, [wasteTypes, aTotals, bTotals]);

  const tableRows = useMemo(() => {
    return wasteTypes.map((typeId) => {
      const wasteDef = WASTE_TYPES.find((w) => w.type === typeId);
      return {
        label: wasteDef?.label ?? typeId,
        a: aTotals?.[typeId] ?? 0,
        b: bTotals?.[typeId] ?? 0,
        diff: (bTotals?.[typeId] ?? 0) - (aTotals?.[typeId] ?? 0),
      };
    });
  }, [wasteTypes, aTotals, bTotals]);

  useValidatedSelection({
    selection,
    setSelection,
    locations,
    favorites,
    defaultToFirstLocation: true,
  });

  const errorText = error ? errorMessage(error) : null;

  const [groupedOpen, setGroupedOpen] = useState(false);

  return (
    <ScreenLayout title="Compare">
      {errorText ? <ErrorBox message={errorText} /> : null}

      <Card title="Filters" subtitle="Choose location and period">
        <Text style={styles.label}>Select business location</Text>

        <SelectionPicker
          value={selection}
          onChange={setSelection}
          locations={locations}
          favorites={favorites}
        />

        <Text style={styles.subTitle}>
          {loading ? "Loading..." : selectionLabel ? `Showing: ${selectionLabel}` : ""}
        </Text>

        <PresetPicker
          value={presetId}
          onChange={(id) => setPresetId(id as ComparePresetId)}
          presets={presets}
        />

        {presetId === "custom" && (
          <>
            <CustomRangeControls
              granularity={custom.granularity}
              setGranularity={custom.setGranularity}
              dayALabel={custom.rangeA.label}
              dayBLabel={custom.rangeB.label}
              onRequestPickDayA={() => setOpenDay("A")}
              onRequestPickDayB={() => setOpenDay("B")}
              weekYearA={custom.weekYearA}
              setWeekYearA={custom.setWeekYearA}
              weekNumA={custom.weekNumA}
              setWeekNumA={custom.setWeekNumA}
              weekYearB={custom.weekYearB}
              setWeekYearB={custom.setWeekYearB}
              weekNumB={custom.weekNumB}
              setWeekNumB={custom.setWeekNumB}
              monthYearA={custom.monthYearA}
              setMonthYearA={custom.setMonthYearA}
              monthIndexA={custom.monthIndexA}
              setMonthIndexA={custom.setMonthIndexA}
              monthYearB={custom.monthYearB}
              setMonthYearB={custom.setMonthYearB}
              monthIndexB={custom.monthIndexB}
              setMonthIndexB={custom.setMonthIndexB}
            />
            <SwapButton onPress={() => custom.swap()} />
          </>
        )}
      </Card>

      {locationIds.length === 0 ? (
        <EmptyBox text="Select locations" />
      ) : (
        <>
          <Card title="Overall Comparison">
            <CompareLegend aLabel={aLabel} bLabel={bLabel} />
            <ComparisonSummary
              wasteTypes={wasteTypes}
              aTotals={aTotals}
              bTotals={bTotals}
              aLabel={aLabel}
              bLabel={bLabel}
            />
          </Card>

          {loading ? (
            <LoadingBox />
          ) : tableRows.length === 0 ? (
            <EmptyBox text="Ei vertailudataa valinnalle" />
          ) : (
            <>
              <Card title="Chart (A vs B)" subtitle="Two bars per waste type">
                <Pressable onPress={() => setGroupedOpen(true)}>
                  <GroupedBarChart
                    data={groupedData}
                    height={220}
                    barWidth={14}
                    aLabel="A"
                    bLabel="B"
                  />
                  <Text style={styles.hint}>Tap chart to enlarge</Text>
                </Pressable>
              </Card>

              <Card title="Details" subtitle="Per waste type">
                <ComparisonTable rows={tableRows} aLabel="A" bLabel="B" />
              </Card>
            </>
          )}
        </>
      )}

      {/* ✅ Grouped chart modal */}
      <Modal
        visible={groupedOpen}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => setGroupedOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setGroupedOpen(false)} />
        <View style={styles.modalCenter} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{`Compare – ${selectionLabel || ""}`}</Text>

            <GroupedBarChart
              data={groupedData}
              height={320}
              barWidth={18}
              aLabel={aLabel}
              bLabel={bLabel}
            />

            <Pressable style={styles.modalBtn} onPress={() => setGroupedOpen(false)}>
              <Text style={styles.modalBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <DayPickerModal
        visible={openDay === "A"}
        title="Valitse päivä (A)"
        value={custom.dayA}
        onChange={(d) => custom.setDayA(d)}
        onClose={() => setOpenDay(null)}
      />

      <DayPickerModal
        visible={openDay === "B"}
        title="Valitse päivä (B)"
        value={custom.dayB}
        onChange={(d) => custom.setDayB(d)}
        onClose={() => setOpenDay(null)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "700" },
  subTitle: { fontSize: 16, fontWeight: "600", marginTop: 8 },

  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCenter: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  modalBtn: {
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
  modalBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});


