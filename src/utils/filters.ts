import type { FilterState, Meeting, MeetingGroup } from "../types";

function isInDateRange(meeting: Meeting, dateRange: FilterState["dateRange"]): boolean {
  if (dateRange === "all") {
    return true;
  }

  const meetingDate = new Date(meeting.dateISO);
  const today = new Date();
  const daysDiff = (today.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24);

  if (dateRange === "last7") {
    return daysDiff <= 7;
  }

  if (dateRange === "last30") {
    return daysDiff <= 30;
  }

  return daysDiff > 30;
}

export function applyFilters(groups: MeetingGroup[], filters: FilterState): MeetingGroup[] {
  return groups
    .map((group) => {
      const meetings = group.meetings.filter((meeting) => {
        const participantsPool = meeting.authors?.length ? meeting.authors : [meeting.participant];
        const participantMatch =
          filters.participants.length === 0 ||
          participantsPool.some((participant) => filters.participants.includes(participant));
        const sourceMatch = filters.source.length === 0 || filters.source.includes(meeting.source);
        const dateMatch = isInDateRange(meeting, filters.dateRange);

        return participantMatch && sourceMatch && dateMatch;
      });

      return { ...group, meetings };
    })
    .filter((group) => group.meetings.length > 0);
}

export function hasActiveFilters(filters: FilterState): boolean {
  return filters.participants.length > 0 || filters.source.length > 0 || filters.dateRange !== "all";
}
