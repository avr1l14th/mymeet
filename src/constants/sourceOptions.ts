import { assets } from "../assets";
import type { Meeting } from "../types";

export type SourceOption = {
  value: Meeting["source"];
  label: string;
  icon: string;
};

export const sourceOptions: SourceOption[] = [
  { value: "uploaded", label: "Загружено", icon: assets.sourceUploadedIcon },
  { value: "google-meet", label: "Google Meet", icon: assets.sourceGoogleMeetIcon },
  { value: "extension", label: "Расширение", icon: assets.sourceExtensionIcon },
  { value: "zoom", label: "Zoom", icon: assets.sourceZoomIcon },
  { value: "yandex-telemost", label: "Я.Телемост", icon: assets.sourceYandexTelemostIcon },
  { value: "microsoft-teams", label: "Microsoft Teams", icon: assets.sourceTeamsIcon },
  { value: "kontur-talk", label: "Контур.Толк", icon: assets.sourceKonturTalkIcon },
  { value: "jitsi", label: "Jitsi", icon: assets.sourceJitsiIcon },
  { value: "salutejazz", label: "SaluteJazz", icon: assets.sourceSaluteJazzIcon },
  { value: "trueconf", label: "TrueConf", icon: assets.sourceTrueConfIcon },
  { value: "upload", label: "Загружено", icon: assets.sourceUploadedIcon }
];

export function getSourceOption(source: Meeting["source"]): SourceOption {
  const fallback = sourceOptions[0];
  return sourceOptions.find((item) => item.value === source) ?? fallback;
}
