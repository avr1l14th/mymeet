import type { FilterState } from "../types";

type MeetingFiltersScreenProps = {
  filters: FilterState;
  participants: string[];
  onChange: (filters: FilterState) => void;
  onApply: () => void;
};

const sourceOptions: Array<{ value: FilterState["source"][number]; label: string }> = [
  { value: "zoom", label: "Zoom" },
  { value: "google-meet", label: "Google Meet" },
  { value: "upload", label: "Ручная загрузка" }
];

export function MeetingFiltersScreen({ filters, participants, onChange, onApply }: MeetingFiltersScreenProps) {
  const toggleParticipant = (participant: string) => {
    const alreadySelected = filters.participants.includes(participant);
    const nextParticipants = alreadySelected
      ? filters.participants.filter((item) => item !== participant)
      : [...filters.participants, participant];

    onChange({ ...filters, participants: nextParticipants });
  };

  const toggleSource = (source: FilterState["source"][number]) => {
    const alreadySelected = filters.source.includes(source);
    const nextSources = alreadySelected ? filters.source.filter((item) => item !== source) : [...filters.source, source];
    onChange({ ...filters, source: nextSources });
  };

  return (
    <section className="filters-screen">
      <div className="filters-card">
        <h2>Контрол фильтров встречи</h2>
        <p>Фильтрация едина для поиска и домашнего экрана.</p>

        <div className="filter-block">
          <h3>Участники</h3>
          <div className="chip-grid">
            {participants.map((participant) => {
              const selected = filters.participants.includes(participant);

              return (
                <button
                  className={`filter-chip${selected ? " is-selected" : ""}`}
                  key={participant}
                  onClick={() => toggleParticipant(participant)}
                  type="button"
                >
                  {participant}
                </button>
              );
            })}
          </div>
        </div>

        <div className="filter-block">
          <h3>Источник</h3>
          <div className="chip-grid">
            {sourceOptions.map((option) => (
              <button
                className={`filter-chip${filters.source.includes(option.value) ? " is-selected" : ""}`}
                key={option.value}
                onClick={() => toggleSource(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <h3>Дата</h3>
          <p>Фильтр даты настраивается через popover «Фильтры» в экранах Поиск/Встречи.</p>
        </div>

        <div className="filters-actions">
          <button className="filters-action secondary" onClick={() => onChange({ participants: [], source: [], date: { kind: "none" } })} type="button">
            Сбросить
          </button>
          <button className="filters-action primary" onClick={onApply} type="button">
            Применить
          </button>
        </div>
      </div>
    </section>
  );
}
