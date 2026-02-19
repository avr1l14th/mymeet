import { useEffect, useMemo, useState } from "react";
import { assets } from "../assets";
import { FilterMenuButton } from "../components/FilterMenuButton";
import { MeetingsEmpty, MeetingsError, MeetingsList, MeetingsSkeleton } from "../components/MeetingsList";
import type { FilterState, MeetingGroup } from "../types";
import { hasActiveFilters } from "../utils/filters";

type SearchScreenProps = {
  groups: MeetingGroup[];
  filters: FilterState;
  activeFilterKindsCount: number;
  participantOptions: Array<{ value: string; label: string }>;
  onClearFilters: () => void;
  onApplyDate: (date: FilterState["date"]) => void;
  onToggleParticipant: (participant: string) => void;
  onToggleSource: (source: FilterState["source"][number]) => void;
};

export function SearchScreen({
  groups,
  filters,
  activeFilterKindsCount,
  participantOptions,
  onClearFilters,
  onApplyDate,
  onToggleParticipant,
  onToggleSource
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState<"idle" | "loading" | "results" | "error">("idle");

  const isSearching = searchQuery.trim().length > 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMeetingsByDate = useMemo(() => {
    if (!isSearching) {
      return [];
    }

    return groups
      .map((group) => {
        const meetings = group.meetings.filter((meeting) => {
          const searchSpace = [
            meeting.title,
            meeting.participant,
            meeting.status,
            meeting.source,
            group.date,
            group.weekday
          ]
            .join(" ")
            .toLowerCase();

          return searchSpace.includes(normalizedQuery);
        });

        return { ...group, meetings };
      })
      .filter((group) => group.meetings.length > 0);
  }, [groups, isSearching, normalizedQuery]);

  useEffect(() => {
    if (!isSearching) {
      setSearchState("idle");
      return;
    }

    setSearchState("loading");
    const timer = window.setTimeout(() => {
      setSearchState(filteredMeetingsByDate.length > 0 ? "results" : "error");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [filteredMeetingsByDate.length, isSearching]);

  return (
    <>
      <section className="search-row">
        <label className={`search-field${isSearching ? " is-active" : ""}`}>
          <img alt="" src={assets.searchIcon} />
          <input
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Название встречи"
            type="text"
            value={searchQuery}
          />
          {isSearching ? (
            <button aria-label="Очистить поиск" className="search-clear-btn" onClick={() => setSearchQuery("")} type="button">
              <img alt="" src={assets.cancelIcon} />
            </button>
          ) : null}
        </label>
        <FilterMenuButton
          activeFilterKindsCount={activeFilterKindsCount}
          hasActiveFilters={hasActiveFilters(filters)}
          onApplyDate={onApplyDate}
          onClearFilters={onClearFilters}
          onToggleParticipant={onToggleParticipant}
          onToggleSource={onToggleSource}
          participantOptions={participantOptions}
          selectedDate={filters.date}
          selectedParticipants={filters.participants}
          selectedSources={filters.source}
        />
      </section>

      {searchState === "loading" ? <MeetingsSkeleton /> : null}
      {searchState === "results" ? <MeetingsList groups={filteredMeetingsByDate} /> : null}
      {searchState === "error" ? (
        <MeetingsError message="Попробуйте другой запрос или смените фильтры" />
      ) : null}
      {searchState === "idle" ? (
        <MeetingsEmpty
          description="Введите ключевые слова — найдем все совпадения в этом рабочем пространстве"
          title="Поиск по встречам"
        />
      ) : null}
    </>
  );
}
