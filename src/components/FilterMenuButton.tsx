import { useEffect, useRef, useState } from "react";
import { assets } from "../assets";
import { getParticipantColor, getParticipantInitial } from "../constants/participantColors";
import { sourceOptions } from "../constants/sourceOptions";
import type { Meeting } from "../types";

type ParticipantOption = {
  value: string;
  label: string;
};

type FilterMenuButtonProps = {
  hasActiveFilters: boolean;
  activeFilterKindsCount: number;
  selectedSources: Meeting["source"][];
  selectedParticipants: string[];
  participantOptions: ParticipantOption[];
  onToggleSource: (source: Meeting["source"]) => void;
  onToggleParticipant: (participant: string) => void;
  onClearFilters: () => void;
};

const menuItems = [
  { key: "source", label: "Источник", icon: assets.filterSourceIcon },
  { key: "authors", label: "Авторы", icon: assets.filterAuthorsIcon },
  { key: "date", label: "Дата", icon: assets.filterDateIcon }
] as const;

export function FilterMenuButton({
  hasActiveFilters,
  activeFilterKindsCount,
  selectedSources,
  selectedParticipants,
  participantOptions,
  onToggleSource,
  onToggleParticipant,
  onClearFilters
}: FilterMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<"source" | "authors" | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const submenuCloseTimerRef = useRef<number | null>(null);
  const hasActiveSourceFilters = selectedSources.length > 0;
  const hasActiveParticipantFilters = selectedParticipants.length > 0;

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
            if (item.key === "source" || item.key === "authors") {
              const submenuKey = item.key;
              const isSubmenuOpen = activeSubmenu === submenuKey;
              const isTypeActive = submenuKey === "source" ? hasActiveSourceFilters : hasActiveParticipantFilters;

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
                      className="filters-source-popover"
                      onMouseEnter={clearSubmenuCloseTimer}
                      onMouseLeave={scheduleSubmenuClose}
                      role="menu"
                    >
                      {submenuKey === "source"
                        ? sourceOptions.map((source) => (
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
                          ))
                        : participantOptions.map((participant) => (
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
                                <span className="filters-participant-icon-label">
                                  {getParticipantInitial(participant.value)}
                                </span>
                              </span>
                              <span className="filters-source-label">{participant.label}</span>
                            </button>
                          ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <button className="filters-popover-item" key={item.key} role="menuitem" type="button">
                <span className="filters-popover-item-left">
                  <img alt="" src={item.icon} />
                  <span>{item.label}</span>
                </span>
                <img alt="" className="filters-popover-item-arrow" src={assets.filterArrowRightIcon} />
              </button>
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
