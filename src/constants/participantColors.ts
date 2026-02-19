const participantPalette = [
  "#4F46E5",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#22C55E",
  "#3B82F6"
] as const;

function hashParticipant(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getParticipantColor(participant: string): string {
  const index = hashParticipant(participant.toLowerCase()) % participantPalette.length;
  return participantPalette[index];
}

export function getParticipantInitial(participant: string): string {
  const normalized = participant.trim();
  if (!normalized) {
    return "?";
  }
  return normalized[0]?.toUpperCase() ?? "?";
}

