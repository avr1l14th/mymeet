import { useEffect, useMemo, useRef, useState } from "react";
import { assets } from "../assets";
import { getParticipantColor, getParticipantInitial } from "../constants/participantColors";
import { sourceOptions } from "../constants/sourceOptions";
import type { FilterState, Meeting } from "../types";

type ParticipantOption = {
  value: string;
  label: string;
};

type FilterMenuButtonProps = {
  hasActiveFilters: boolean;
  activeFilterKindsCount: number;
  selectedSources: Meeting["source"][];
  selectedParticipants: string[];
  selectedDate: FilterState["date"];
  participantOptions: ParticipantOption[];
  onToggleSource: (source: Meeting["source"]) => void;
  onToggleParticipant: (participant: string) => void;
  onApplyDate: (date: FilterState["date"]) => void;
  onClearFilters: () => void;
};

type SubmenuKey = "source" | "authors" | "date";
type CalendarDay = {
  date: Date;
  iso: string;
  inCurrentMonth: boolean;
};
type RangeSegment = {
  row: number;
  startCol: number;
  endCol: number;
  isStartRow: boolean;
  isEndRow: boolean;
};

const menuItems = [
  { key: "source", label: "Источник", icon: assets.filterSourceIcon },
  { key: "authors", label: "Автор", icon: assets.filterAuthorsIcon },
  { key: "date", label: "Дата", icon: assets.filterDateIcon }
] as const;

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря"
] as const;
const monthNamesTitle = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
] as const;

function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISODate(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function normalizeMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildCalendarDays(monthDate: Date): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const weekDayOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const firstCellDate = new Date(year, month, 1 - weekDayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(firstCellDate);
    cellDate.setDate(firstCellDate.getDate() + index);

    return {
      date: cellDate,
      iso: formatDateISO(cellDate),
      inCurrentMonth: cellDate.getMonth() === month
    };
  });
}

function getInitialMonth(date: FilterState["date"]): Date {
  if (date.kind === "single") {
    return normalizeMonth(parseISODate(date.dateISO));
  }

  if (date.kind === "range") {
    return normalizeMonth(parseISODate(date.endDateISO));
  }

  return normalizeMonth(new Date());
}

function selectDate(prev: FilterState["date"], nextDateISO: string): FilterState["date"] {
  if (prev.kind === "none") {
    return { kind: "single", dateISO: nextDateISO };
  }

  if (prev.kind === "single") {
    if (prev.dateISO === nextDateISO) {
      return { kind: "none" };
    }

    const [startDateISO, endDateISO] = [prev.dateISO, nextDateISO].sort();
    return { kind: "range", startDateISO, endDateISO };
  }

  return { kind: "single", dateISO: nextDateISO };
}

function formatSummary(date: FilterState["date"]): string {
  if (date.kind === "none") {
    return "";
  }

  if (date.kind === "single") {
    const selectedDate = parseISODate(date.dateISO);
    return `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
  }

  const startDate = parseISODate(date.startDateISO);
  const endDate = parseISODate(date.endDateISO);
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();
  const isSameMonth = isSameYear && startDate.getMonth() === endDate.getMonth();

  if (isSameMonth) {
    return `${startDate.getDate()} - ${endDate.getDate()} ${monthNames[endDate.getMonth()]}, ${endDate.getFullYear()}`;
  }

  if (isSameYear) {
    return `${startDate.getDate()} ${monthNames[startDate.getMonth()]} - ${endDate.getDate()} ${monthNames[endDate.getMonth()]}, ${endDate.getFullYear()}`;
  }

  return `${startDate.getDate()} ${monthNames[startDate.getMonth()]}, ${startDate.getFullYear()} - ${endDate.getDate()} ${monthNames[endDate.getMonth()]}, ${endDate.getFullYear()}`;
}

function isDateInRange(dateISO: string, date: FilterState["date"]): boolean {
  if (date.kind !== "range") {
    return false;
  }

  return dateISO > date.startDateISO && dateISO < date.endDateISO;
}

function buildRangeSegments(days: CalendarDay[], date: FilterState["date"]): RangeSegment[] {
  if (date.kind !== "range") {
    return [];
  }

  const firstVisibleISO = days[0]?.iso;
  const lastVisibleISO = days[days.length - 1]?.iso;

  if (!firstVisibleISO || !lastVisibleISO) {
    return [];
  }

  const clippedStartISO = date.startDateISO < firstVisibleISO ? firstVisibleISO : date.startDateISO;
  const clippedEndISO = date.endDateISO > lastVisibleISO ? lastVisibleISO : date.endDateISO;

  if (clippedEndISO < clippedStartISO) {
    return [];
  }

  const startIndex = days.findIndex((day) => day.iso === clippedStartISO);
  const endIndex = days.findIndex((day) => day.iso === clippedEndISO);

  if (startIndex < 0 || endIndex < 0 || endIndex < startIndex) {
    return [];
  }

  const startRow = Math.floor(startIndex / 7);
  const endRow = Math.floor(endIndex / 7);
  const segments: RangeSegment[] = [];

  for (let row = startRow; row <= endRow; row += 1) {
    const startCol = row === startRow ? startIndex % 7 : 0;
    const endCol = row === endRow ? endIndex % 7 : 6;
    segments.push({
      row,
      startCol,
      endCol,
      isStartRow: row === startRow,
      isEndRow: row === endRow
    });
  }

  return segments;
}

export function FilterMenuButton({
  hasActiveFilters,
  activeFilterKindsCount,
  selectedSources,
  selectedParticipants,
  selectedDate,
  participantOptions,
  onToggleSource,
  onToggleParticipant,
  onApplyDate,
  onClearFilters
}: FilterMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<SubmenuKey | null>(null);
  const [draftDate, setDraftDate] = useState<FilterState["date"]>(selectedDate);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => getInitialMonth(selectedDate));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const submenuCloseTimerRef = useRef<number | null>(null);
  const hasActiveSourceFilters = selectedSources.length > 0;
  const hasActiveParticipantFilters = selectedParticipants.length > 0;
  const hasActiveDateFilter = selectedDate.kind !== "none";

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const rangeSegments = useMemo(() => buildRangeSegments(calendarDays, draftDate), [calendarDays, draftDate]);
  const monthTitle = `${monthNamesTitle[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;
  const draftDateSummary = formatSummary(draftDate);
  const todayISO = formatDateISO(new Date());
  const currentMonth = useMemo(() => normalizeMonth(new Date()), []);
  const canGoToNextMonth = visibleMonth.getTime() < currentMonth.getTime();
  const clearSubmenuCloseTimer = () => {
    if (submenuCloseTimerRef.current !== null) {
      window.clearTimeout(submenuCloseTimerRef.current);
      submenuCloseTimerRef.current = null;
    }
  };

  const scheduleSubmenuClose = () => {
    clearSubmenuCloseTimer();
    submenuCloseTimerRef.current = window.setTimeout(() => {
      setActiveSubmenu(null);
      submenuCloseTimerRef.current = null;
    }, 120);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveSubmenu(null);
        clearSubmenuCloseTimer();
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(
    () => () => {
      clearSubmenuCloseTimer();
    },
    []
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraftDate(selectedDate);
    setVisibleMonth(getInitialMonth(selectedDate));
  }, [open, selectedDate]);

  return (
    <div className="filters-menu" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="filters-btn"
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (!next) {
              setActiveSubmenu(null);
            }
            return next;
          });
        }}
        type="button"
      >
        <img alt="" src={assets.filterIcon} />
        <span>Фильтры</span>
        {activeFilterKindsCount > 0 ? <span className="filters-btn-badge">{activeFilterKindsCount}</span> : null}
      </button>

      {open ? (
        <div className="filters-popover" role="menu">
          {menuItems.map((item) => {
            const submenuKey = item.key;
            const isSubmenuOpen = activeSubmenu === submenuKey;
            const isTypeActive =
              submenuKey === "source"
                ? hasActiveSourceFilters
                : submenuKey === "authors"
                  ? hasActiveParticipantFilters
                  : hasActiveDateFilter;

            return (
              <div
                className="filters-source-hover-zone"
                key={item.key}
                onMouseEnter={() => {
                  clearSubmenuCloseTimer();
                  setActiveSubmenu(submenuKey);
                }}
                onMouseLeave={scheduleSubmenuClose}
              >
                <button
                  className={`filters-popover-item${isSubmenuOpen ? " is-submenu-open" : ""}`}
                  role="menuitem"
                  type="button"
                >
                  <span className="filters-popover-item-left">
                    <img alt="" src={item.icon} />
                    <span>{item.label}</span>
                  </span>
                  <span className="filters-popover-item-trailing">
                    {isTypeActive ? <span className="filters-popover-item-dot" /> : null}
                    <img alt="" className="filters-popover-item-arrow" src={assets.filterArrowRightIcon} />
                  </span>
                </button>

                {isSubmenuOpen ? (
                  <div
                    className={submenuKey === "date" ? "filters-date-popover" : "filters-source-popover"}
                    onMouseEnter={clearSubmenuCloseTimer}
                    onMouseLeave={scheduleSubmenuClose}
                    role="menu"
                  >
                    {submenuKey === "source" ? (
                      <>
                        {sourceOptions.map((source) => (
                            <button
                              aria-checked={selectedSources.includes(source.value)}
                              className="filters-source-item"
                              key={source.value}
                              onClick={() => onToggleSource(source.value)}
                              role="menuitemcheckbox"
                              type="button"
                            >
                              <span
                                className={`filters-source-checkbox${selectedSources.includes(source.value) ? " is-checked" : ""}`}
                              >
                                {selectedSources.includes(source.value) ? (
                                  <img alt="" className="filters-source-check-icon" src={assets.filterCheckIcon} />
                                ) : null}
                              </span>
                              <img alt="" className="filters-source-icon" src={source.icon} />
                              <span className="filters-source-label">{source.label}</span>
                            </button>
                          ))}
                      </>
                    ) : null}

                    {submenuKey === "authors" ? (
                      <>
                        {participantOptions.map((participant) => (
                            <button
                              aria-checked={selectedParticipants.includes(participant.value)}
                              className="filters-source-item"
                              key={participant.value}
                              onClick={() => onToggleParticipant(participant.value)}
                              role="menuitemcheckbox"
                              type="button"
                            >
                              <span
                                className={`filters-source-checkbox${selectedParticipants.includes(participant.value) ? " is-checked" : ""}`}
                              >
                                {selectedParticipants.includes(participant.value) ? (
                                  <img alt="" className="filters-source-check-icon" src={assets.filterCheckIcon} />
                                ) : null}
                              </span>
                              <span
                                className="filters-source-icon filters-participant-icon"
                                style={{ backgroundColor: getParticipantColor(participant.value) }}
                              >
                                <span className="filters-participant-icon-label">{getParticipantInitial(participant.value)}</span>
                              </span>
                              <span className="filters-source-label">{participant.label}</span>
                            </button>
                          ))}
                      </>
                    ) : null}

                    {submenuKey === "date" ? (
                      <>
                        <div className="filters-date-header">
                          <button
                            aria-label="Предыдущий месяц"
                            className="filters-date-nav"
                            onClick={() =>
                              setVisibleMonth(
                                (prev) =>
                                  new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                              )
                            }
                            type="button"
                          >
                            <img alt="" src={assets.calendarChevronLeftIcon} />
                          </button>
                          <span className="filters-date-title">{monthTitle}</span>
                          <button
                            aria-label="Следующий месяц"
                            className="filters-date-nav"
                            disabled={!canGoToNextMonth}
                            onClick={() =>
                              setVisibleMonth(
                                (prev) =>
                                  new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                              )
                            }
                            type="button"
                          >
                            <img
                              alt=""
                              src={
                                canGoToNextMonth
                                  ? assets.calendarChevronRightIcon
                                  : assets.calendarChevronRightDisabledIcon
                              }
                            />
                          </button>
                        </div>

                        <div className="filters-date-weekdays">
                          {weekDays.map((day) => (
                            <span className="filters-date-weekday" key={day}>
                              {day}
                            </span>
                          ))}
                        </div>

                        <div className="filters-date-grid-wrap">
                          {rangeSegments.length > 0 ? (
                            <div className="filters-date-range-overlay" aria-hidden="true">
                              {rangeSegments.map((segment) => (
                                <span
                                  className="filters-date-range-segment"
                                  key={`${segment.row}-${segment.startCol}-${segment.endCol}`}
                                  style={{
                                    left: `${segment.startCol * 37 + (segment.isStartRow ? 1 : 0)}px`,
                                    top: `${segment.row * 29}px`,
                                    width: `${(segment.endCol - segment.startCol) * 37 + 24 - (segment.isStartRow ? 1 : 0) - (segment.isEndRow ? 1 : 0)}px`
                                  }}
                                />
                              ))}
                            </div>
                          ) : null}

                          <div className="filters-date-grid">
                            {calendarDays.map((day) => {
                              const isFuture = day.iso > todayISO;
                              const isSingleSelected = draftDate.kind === "single" && draftDate.dateISO === day.iso;
                              const isRangeStart = draftDate.kind === "range" && draftDate.startDateISO === day.iso;
                              const isRangeEnd = draftDate.kind === "range" && draftDate.endDateISO === day.iso;
                              const isInRange = isDateInRange(day.iso, draftDate);
                              const isRangeMiddle =
                                draftDate.kind === "range" &&
                                day.iso > draftDate.startDateISO &&
                                day.iso < draftDate.endDateISO;

                              return (
                                <div className="filters-date-cell" key={day.iso}>
                                  <button
                                    className={[
                                      "filters-date-day",
                                      !day.inCurrentMonth ? "is-outside-month" : "",
                                      isFuture ? "is-future" : "",
                                      isInRange ? "is-in-range" : "",
                                      isRangeMiddle ? "is-range-middle" : "",
                                      isSingleSelected ? "is-selected-single" : "",
                                      isRangeStart ? "is-selected-start" : "",
                                      isRangeEnd ? "is-selected-end" : ""
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                    onClick={() => {
                                      if (isFuture) {
                                        return;
                                      }
                                      const nextDate = selectDate(draftDate, day.iso);
                                      setDraftDate(nextDate);

                                      if (nextDate.kind === "none" && selectedDate.kind !== "none") {
                                        onApplyDate(nextDate);
                                      }
                                    }}
                                    type="button"
                                  >
                                    {day.date.getDate()}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {draftDate.kind !== "none" ? (
                          <div className="filters-date-actions">
                            <button
                              className="filters-date-apply"
                              onClick={() => {
                                onApplyDate(draftDate);
                                setActiveSubmenu(null);
                              }}
                              type="button"
                            >
                              Применить
                            </button>
                            <p className="filters-date-summary">{draftDateSummary}</p>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}

          <div className="filters-popover-divider" />

          <button
            className="filters-popover-clear"
            disabled={!hasActiveFilters}
            onClick={onClearFilters}
            role="menuitem"
            type="button"
          >
            Очистить фильтры
          </button>
        </div>
      ) : null}
    </div>
  );
}
