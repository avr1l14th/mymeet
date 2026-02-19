import { useEffect, useMemo, useRef, useState } from "react";
import { FilterMenuButton } from "../components/FilterMenuButton";
import { MeetingsEmpty, MeetingsError, MeetingsList, MeetingsSkeleton } from "../components/MeetingsList";
import type { FilterState, MeetingGroup } from "../types";
import { hasActiveFilters } from "../utils/filters";

type MeetingsHomeScreenProps = {
  groups: MeetingGroup[];
  filters: FilterState;
  activeFilterKindsCount: number;
  participantOptions: Array<{ value: string; label: string }>;
  onClearFilters: () => void;
  onToggleParticipant: (participant: string) => void;
  onToggleSource: (source: FilterState["source"][number]) => void;
};

export function MeetingsHomeScreen({
  groups,
  filters,
  activeFilterKindsCount,
  participantOptions,
  onClearFilters,
  onToggleParticipant,
  onToggleSource
}: MeetingsHomeScreenProps) {
  const activeFilters = useMemo(() => hasActiveFilters(filters), [filters]);
  const [isFiltering, setIsFiltering] = useState(false);
  const isInitialRenderRef = useRef(true);
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    setIsFiltering(true);
    const timer = window.setTimeout(() => {
      setIsFiltering(false);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [filtersKey]);

  return (
    <>
      <section className="meetings-tabs-row">
        <div className="meetings-tabs">
          <button className="meetings-tab is-active" type="button">
            Мои встречи
          </button>
          <button className="meetings-tab" type="button">
            Доступные мне
          </button>
        </div>
        <FilterMenuButton
          activeFilterKindsCount={activeFilterKindsCount}
          hasActiveFilters={activeFilters}
          onClearFilters={onClearFilters}
          onToggleParticipant={onToggleParticipant}
          onToggleSource={onToggleSource}
          participantOptions={participantOptions}
          selectedParticipants={filters.participants}
          selectedSources={filters.source}
        />
      </section>

      {isFiltering ? <MeetingsSkeleton /> : null}
      {!isFiltering && groups.length > 0 ? <MeetingsList groups={groups} /> : null}
      {!isFiltering && groups.length === 0 && activeFilters ? (
        <MeetingsError message="Для выбранных фильтров встречи не найдены. Измените параметры фильтрации." />
      ) : null}
      {!isFiltering && groups.length === 0 && !activeFilters ? (
        <MeetingsEmpty title="Встреч пока нет" description="Добавьте первую встречу или подключите источник записи." />
      ) : null}
    </>
  );
}
