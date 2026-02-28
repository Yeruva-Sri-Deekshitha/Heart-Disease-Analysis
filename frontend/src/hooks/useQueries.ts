import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { Gender, Race } from "../backend";

export interface FilterState {
  ageRange: [number, number];
  gender: Gender | null;
  race: Race | null;
  diabetes: boolean | null;
  strokeHistory: boolean | null;
}

export const DEFAULT_FILTERS: FilterState = {
  ageRange: [30, 69],
  gender: null,
  race: null,
  diabetes: null,
  strokeHistory: null,
};

export function useFilteredPatients(filters: FilterState) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: [
      "filteredPatients",
      filters.ageRange[0],
      filters.ageRange[1],
      filters.gender,
      filters.race,
      filters.diabetes,
      filters.strokeHistory,
    ],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getFilteredPatients(
          BigInt(filters.ageRange[0]),
          BigInt(filters.ageRange[1]),
          filters.gender ?? null,
          filters.race ?? null,
          filters.diabetes ?? null,
          filters.strokeHistory ?? null
        );
        return result;
      } catch (err) {
        console.error("getFilteredPatients error:", err);
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 30_000,
  });
}

export function useAllPatients() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["allPatients"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getFilteredPatients(
          BigInt(0),
          BigInt(999),
          null,
          null,
          null,
          null
        );
        return result;
      } catch (err) {
        console.error("getAllPatients error:", err);
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 60_000,
  });
}

export function useDatasetConfig() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["datasetConfig"],
    queryFn: async () => {
      if (!actor) return { ageMin: 30, ageMax: 69 };
      try {
        const result = await actor.getConfiguration();
        return {
          ageMin: Number(result.ageMin),
          ageMax: Number(result.ageMax),
        };
      } catch (err) {
        console.error("getConfiguration error:", err);
        return { ageMin: 30, ageMax: 69 };
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 300_000,
  });
}

export function useDatasetSize() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["datasetSize"],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        const result = await actor.getDatasetSize();
        return Number(result);
      } catch (err) {
        console.error("getDatasetSize error:", err);
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 300_000,
  });
}
