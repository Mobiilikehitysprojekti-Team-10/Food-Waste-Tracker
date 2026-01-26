import React, { useContext, useMemo, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { Routes } from "../navigation/routes";

import {
  ScreenLayout,
  ActionRow,
  SelectionPicker,
  WeekHeader,
  LoadingBox,
  ErrorBox,
  EmptyBox,
  ChartCard,
  TableCard,
  FavoriteDeleteButton,
} from "../features/wasteReport/reports/presentation/components";



import { AuthContext } from "../context/AuthContext";

import { fetchActiveLocations } from "../features/wasteReport/data/fetchLocations";
import { fetchFavorites, Favorite } from "../features/wasteReport/data/fetchFavorites";
import { fetchFavoriteDetails } from "../features/wasteReport/data/fetchFavoriteDetails";
import { deleteFavoriteUseCase } from "../features/wasteReport/reports/application/usecases/deleteFavoriteUseCase";
import { errorMessage } from "../features/wasteReport/reports/presentation/utils/errorMessage";
import { useLocations } from "../features/wasteReport/reports/application/useLocations";
import { useFavorites } from "../features/wasteReport/reports/application/useFavorites";
import { getCurrentWeekRange } from "../features/wasteReport/reports/domain/currentWeek";
import { useWeeklyTotals } from "../features/wasteReport/reports/application/useWeeklyTotals";
import { useReportScope } from "../features/wasteReport/reports/application/useReportScope";
import { useValidatedSelection } from "../features/wasteReport/reports/application/useValidatedSelection";

import { SimpleBarChart } from "../features/wasteReport/reports/presentation/components/SimpleBarChart";
import { ChartModal } from "../features/wasteReport/reports/presentation/components/ChartModal";
import {
  WASTE_TYPES,
  ALL_WASTE_TYPE_IDS,
} from "../features/wasteReport/domain/wasteTypes";
import { usePersistedSelection } from "../features/wasteReport/reports/application/usePersistedSelection";

function toYMD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const day = x.getDay(); 
  const diff = (day === 0 ? -6 : 1) - day; 
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatWeekLabel(from: Date, to: Date) {
  const fromDM = from.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  const toDM = to.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  const toY = to.toLocaleDateString("fi-FI", { year: "numeric" });

  if (from.getFullYear() !== to.getFullYear()) {
    const fromY = from.toLocaleDateString("fi-FI", { year: "numeric" });
    return `${fromDM}.${fromY} – ${toDM}.${toY}`;
  }

  return `${fromDM} – ${toDM}.${toY}`;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ReportsScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useContext(AuthContext);

  const ownerUid =
    (user?.uid as string | undefined) ||
    (user?.email as string | undefined) ||
    "dev-user";

  const [selection, setSelection] = useState("all");
  const [chartOpen, setChartOpen] = useState(false);

  const { locations } = useLocations();
  const { favorites, refresh: reloadFavorites } = useFavorites(ownerUid);

  const weekRange = useMemo(() => getCurrentWeekRange(new Date()), []);

  const { selectionLabel, isFavoriteSelected, locationIds, wasteTypes, error: scopeError } =
    useReportScope({ selectionValue: selection, locations, favorites });

  const { totalsByType, loading, error: totalsError } = useWeeklyTotals({
    locationIds,
    wasteTypes,
    dayFrom: weekRange.dayFrom,
    dayTo: weekRange.dayTo,
  });

  const visibleTypeDefs = useMemo(() => {
    const set = new Set(wasteTypes);
    return WASTE_TYPES.filter((w) => set.has(w.type));
  }, [wasteTypes]);

  const chartData = useMemo(() => {
    return visibleTypeDefs.map((w) => ({
      label: w.short,
      value: Number(totalsByType[w.type] ?? 0),
    }));
  }, [visibleTypeDefs, totalsByType]);

  const tableRows = useMemo(() => {
    
    return visibleTypeDefs.map((w) => ({
      label: w.label,
      value: Number(totalsByType[w.type] ?? 0),
    }));
  }, [visibleTypeDefs, totalsByType]);

  const onConfirmDeleteFavorite = async (id: string) => {
    try {
      await deleteFavoriteUseCase({ favoriteId: id, ownerUid });
      await reloadFavorites();

      const fallback = locations?.[0]?.id ? `loc:${locations[0].id}` : "";
      setSelection(fallback);

      Alert.alert("Deleted", "Favorite list deleted.");
    } catch (e) {
      Alert.alert("Error", errorMessage(e));
    }
  };

  const handleDelete = () => {
    const favoriteId =
      isFavoriteSelected && selection?.startsWith("fav:")
        ? selection.substring(4)
        : null;
    if (favoriteId) {
      onConfirmDeleteFavorite(favoriteId);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      reloadFavorites();
    }, [reloadFavorites])
  );

  useValidatedSelection({
    selection,
    setSelection,
    locations,
    favorites,
    defaultToFirstLocation: true,
  });

  const error = scopeError || totalsError;

  return (
    <ScreenLayout title="Reports">
      <ActionRow
        onCreateFavorite={() => navigation.navigate(Routes.ReportsFavorite)}
        onCompare={() => navigation.navigate(Routes.Compare)}
      />

      <Text style={styles.label}>Select business location / Favorite</Text>
      <SelectionPicker
        value={selection}
        onChange={setSelection}
        locations={locations}
        favorites={favorites}
      />

      <WeekHeader
        label={weekRange.label}
        subtitle={selectionLabel ? `Showing: ${selectionLabel}` : undefined}
      />

      {error && <ErrorBox message={errorMessage(error)} />}

      {loading ? (
        <LoadingBox />
      ) : locationIds.length === 0 ? (
        <EmptyBox text="Select locations" />
      ) : totalsByType.length === 0 ? (
        <EmptyBox text="No data for this selection for this week" />
      ) : (
        <>
          <ChartCard
            title="Weekly totals"
            subtitle="Tap to enlarge"
            data={chartData}
            onPressChart={() => setChartOpen(true)}
          />

          <TableCard
            title="Details"
            subtitle="Totals by waste type"
            rows={tableRows}
            showEmpty={!loading && !!selection}
            emptyText="No data for current week"
            footer={
              <FavoriteDeleteButton
                visible={isFavoriteSelected}
                onConfirmDelete={handleDelete}
              />
            }
          />
        </>
      )}

      <ChartModal
        visible={chartOpen}
        onClose={() => setChartOpen(false)}
        title={`Reports – ${selectionLabel || "Selection"} (${weekRange.label})`}
        chartData={chartData}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 8 },
  label: { fontSize: 14, fontWeight: "700" },
  subTitle: { fontSize: 16, fontWeight: "600", marginTop: 8 },

  weekLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 4,
    color: "#333",
  },
});
