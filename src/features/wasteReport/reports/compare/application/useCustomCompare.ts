import { useMemo, useState, useEffect } from "react";
import { buildDayRange, buildIsoWeekRange, buildMonthRange } from "../domain/rangeBuilders";
import { isoWeeksInYear } from "../domain/isoWeeks";

export type CustomGranularity = "day" | "week" | "month";

export function useCustomCompare() {
  const now = new Date();
  const [granularity, setGranularity] = useState<CustomGranularity>("week");

  const [dayA, setDayA] = useState<Date>(now);
  const [dayB, setDayB] = useState<Date>(now);

  const [weekYearA, setWeekYearA] = useState<number>(now.getFullYear());
  const [weekNumA, setWeekNumA] = useState<number>(1);

  const [weekYearB, setWeekYearB] = useState<number>(now.getFullYear());
  const [weekNumB, setWeekNumB] = useState<number>(1);

  const [monthYearA, setMonthYearA] = useState<number>(now.getFullYear());
  const [monthIndexA, setMonthIndexA] = useState<number>(now.getMonth());

  const [monthYearB, setMonthYearB] = useState<number>(now.getFullYear());
  const [monthIndexB, setMonthIndexB] = useState<number>(now.getMonth());

  useEffect(() => {
    const max = isoWeeksInYear(weekYearA);
    if (weekNumA > max) setWeekNumA(max);
  }, [weekYearA]);

  useEffect(() => {
    const max = isoWeeksInYear(weekYearB);
    if (weekNumB > max) setWeekNumB(max);
  }, [weekYearB]);

  const rangeA = useMemo(() => {
    if (granularity === "day") return buildDayRange(dayA);
    if (granularity === "month") return buildMonthRange(monthYearA, monthIndexA);
    return buildIsoWeekRange(weekYearA, weekNumA);
  }, [granularity, dayA, weekYearA, weekNumA, monthYearA, monthIndexA]);

  const rangeB = useMemo(() => {
    if (granularity === "day") return buildDayRange(dayB);
    if (granularity === "month") return buildMonthRange(monthYearB, monthIndexB);
    return buildIsoWeekRange(weekYearB, weekNumB);
  }, [granularity, dayB, weekYearB, weekNumB, monthYearB, monthIndexB]);

  function swap() {

    const dA = dayA;
    setDayA(dayB);
    setDayB(dA);

    const wyA = weekYearA,
      wnA = weekNumA;
    setWeekYearA(weekYearB);
    setWeekNumA(weekNumB);
    setWeekYearB(wyA);
    setWeekNumB(wnA);

    const myA = monthYearA,
      miA = monthIndexA;
    setMonthYearA(monthYearB);
    setMonthIndexA(monthIndexB);
    setMonthYearB(myA);
    setMonthIndexB(miA);
  }

  return {
    granularity,
    setGranularity,

    dayA,
    setDayA,
    weekYearA,
    setWeekYearA,
    weekNumA,
    setWeekNumA,
    monthYearA,
    setMonthYearA,
    monthIndexA,
    setMonthIndexA,

    dayB,
    setDayB,
    weekYearB,
    setWeekYearB,
    weekNumB,
    setWeekNumB,
    monthYearB,
    setMonthYearB,
    monthIndexB,
    setMonthIndexB,

    rangeA,
    rangeB,
    swap,
  };
}
