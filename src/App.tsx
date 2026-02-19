import { useMemo, useState } from "react";
import { defaultFilters, meetingsByDate } from "./data";
import { LayoutShell } from "./components/LayoutShell";
import { IntegrationsScreen } from "./screens/IntegrationsScreen";
import { MeetingsHomeScreen } from "./screens/MeetingsHomeScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import type { FilterState, Screen } from "./types";
import { applyFilters } from "./utils/filters";

const screenTitles: Record<Screen, string> = {
  search: "Поиск",
  home: "Встречи",
  integrations: "Интеграции",
  settings: "Настройки"
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("search");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredGroups = useMemo(() => applyFilters(meetingsByDate, filters), [filters]);
  const participantOptions = useMemo(() => {
    const unique = new Set<string>();
    const allParticipants = meetingsByDate
      .flatMap((group) => group.meetings)
      .flatMap((meeting) => [meeting.participant, ...(meeting.authors ?? [])]);

    return allParticipants
      .filter((participant) => {
        if (unique.has(participant)) {
          return false;
        }
        unique.add(participant);
        return true;
      })
      .map((participant) => ({
        value: participant,
        label: participant
      }));
  }, []);
  const resetFilters = () => setFilters(defaultFilters);
  const toggleSourceFilter = (source: FilterState["source"][number]) => {
    setFilters((prev) => {
      const hasSource = prev.source.includes(source);
      return {
        ...prev,
        source: hasSource ? prev.source.filter((item) => item !== source) : [...prev.source, source]
      };
    });
  };
  const toggleParticipantFilter = (participant: string) => {
    setFilters((prev) => {
      const hasParticipant = prev.participants.includes(participant);
      return {
        ...prev,
        participants: hasParticipant
          ? prev.participants.filter((item) => item !== participant)
          : [...prev.participants, participant]
      };
    });
  };
  const activeFilterKindsCount = useMemo(
    () => [filters.source.length > 0, filters.participants.length > 0, filters.dateRange !== "all"].filter(Boolean).length,
    [filters]
  );

  const screenContent = {
    search: (
      <SearchScreen
        activeFilterKindsCount={activeFilterKindsCount}
        filters={filters}
        groups={filteredGroups}
        onClearFilters={resetFilters}
        onToggleParticipant={toggleParticipantFilter}
        onToggleSource={toggleSourceFilter}
        participantOptions={participantOptions}
      />
    ),
    home: (
      <MeetingsHomeScreen
        activeFilterKindsCount={activeFilterKindsCount}
        filters={filters}
        groups={filteredGroups}
        onClearFilters={resetFilters}
        onToggleParticipant={toggleParticipantFilter}
        onToggleSource={toggleSourceFilter}
        participantOptions={participantOptions}
      />
    ),
    integrations: <IntegrationsScreen />,
    settings: <SettingsScreen />
  } satisfies Record<Screen, React.ReactNode>;

  return (
    <LayoutShell
      onCloseSidebar={() => setSidebarOpen(false)}
      onNavigate={(nextScreen) => {
        setScreen(nextScreen);
        setSidebarOpen(false);
      }}
      onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      screen={screen}
      sidebarOpen={sidebarOpen}
      title={screenTitles[screen]}
    >
      {screenContent[screen]}
    </LayoutShell>
  );
}
