export type Screen = "search" | "home" | "integrations" | "settings";

export type MenuItem = {
  key: Screen;
  label: string;
  icon: string;
};

export type Meeting = {
  id: string;
  title: string;
  titlePrefix?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  time: string;
  duration: string;
  participant: string;
  authors?: string[];
  participantDisplay?: string;
  participantVariant?: "single" | "authors";
  source:
    | "uploaded"
    | "google-meet"
    | "extension"
    | "zoom"
    | "yandex-telemost"
    | "microsoft-teams"
    | "kontur-talk"
    | "jitsi"
    | "salutejazz"
    | "trueconf"
    | "upload";
  dateISO: string;
  status: string;
  thumb: "audio1" | "audio2" | "legacy";
  previewState?: "default" | "processing";
  thumbBadge?: string;
  thumbBadgePosition?: "center" | "top-left";
  muted?: boolean;
};

export type MeetingGroup = {
  date: string;
  weekday: string;
  meetings: Meeting[];
};

export type FilterState = {
  participants: string[];
  source: Meeting["source"][];
  date:
    | { kind: "none" }
    | { kind: "single"; dateISO: string }
    | { kind: "range"; startDateISO: string; endDateISO: string };
};
