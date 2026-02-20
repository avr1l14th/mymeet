import type { FilterState, Meeting, MeetingGroup } from "../types";

function isInDateRange(meeting: Meeting, date: FilterState["date"]): boolean {
  if (date.kind === "none") {
    return true;
  }

  if (date.kind === "single") {
    return meeting.dateISO === date.dateISO;
  }

  return meeting.dateISO >= date.startDateISO && meeting.dateISO <= date.endDateISO;
}

export function applyFilters(groups: MeetingGroup[], filters: FilterState): MeetingGroup[] {
  return groups
    .map((group) => {
      const meetings = group.meetings
        .filter((meeting) => {
          const participantsPool = meeting.authors?.length ? meeting.authors : [meeting.participant];
          const participantMatch =
            filters.participants.length === 0 ||
            participantsPool.some((participant) => filters.participants.includes(participant));
          const sourceMatch = filters.source.length === 0 || filters.source.includes(meeting.source);
          const dateMatch = isInDateRange(meeting, filters.date);

          return participantMatch && sourceMatch && dateMatch;
        })
        .sort((a, b) => b.time.localeCompare(a.time));

      return { ...group, meetings };
    })
    .filter((group) => group.meetings.length > 0);
}

export function hasActiveFilters(filters: FilterState): boolean {
  return filters.participants.length > 0 || filters.source.length > 0 || filters.date.kind !== "none";
}
