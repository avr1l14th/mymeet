import { assets } from "./assets";
import type { FilterState, MeetingGroup, MenuItem } from "./types";

export const primaryMenu: MenuItem[] = [
  { key: "search", label: "Поиск", icon: assets.sidebarSearchIcon },
  { key: "home", label: "Встречи", icon: assets.meetingsIcon },
  { key: "integrations", label: "Интеграции", icon: assets.integrationsIcon },
  { key: "settings", label: "Настройки", icon: assets.settingsIcon }
];

export const secondaryMenu: MenuItem[] = [{ key: "settings", label: "Поддержка", icon: assets.supportIcon }];

export const meetingsByDate: MeetingGroup[] = [
  {
    date: "Сегодня",
    weekday: "Четверг",
    meetings: [
      {
        id: "m2",
        title: "Разбор UX-замечаний по фильтрам",
        time: "14:30",
        duration: "42 мин",
        participant: "design@mymeet.ai",
        authors: ["design@mymeet.ai", "irina.pm@mymeet.ai", "backend@mymeet.ai"],
        participantDisplay: "3 автора",
        participantVariant: "authors",
        muted: true,
        source: "google-meet",
        dateISO: "2026-02-19",
        status: "Загружено",
        thumb: "audio2",
        previewState: "processing",
        thumbBadge: "55%",
        thumbBadgePosition: "center"
      },
      {
        id: "m1",
        title: "Планирование sprint 14: продукт и аналитика",
        time: "10:00",
        duration: "58 мин",
        participant: "irina.pm@mymeet.ai",
        source: "microsoft-teams",
        dateISO: "2026-02-19",
        status: "Загружено",
        thumb: "audio1"
      },
      {
        id: "m3",
        title: "Синк с интеграцией Zoom и webhook-событиями",
        time: "12:00",
        duration: "31 мин",
        participant: "backend@mymeet.ai",
        source: "zoom",
        dateISO: "2026-02-19",
        status: "Загружено",
        thumb: "legacy"
      }
    ]
  },
  {
    date: "Вчера",
    weekday: "Среда",
    meetings: [
      {
        id: "m4",
        title: "Демонстрация MVP для sales-команды",
        time: "11:20",
        duration: "67 мин",
        participant: "sales@mymeet.ai",
        source: "uploaded",
        dateISO: "2026-02-18",
        status: "Загружено",
        thumb: "audio1"
      },
      {
        id: "m5",
        title: "Ревью качества транскрибации звонков",
        time: "16:40",
        duration: "49 мин",
        participant: "qa@mymeet.ai",
        source: "extension",
        dateISO: "2026-02-18",
        status: "Обработано",
        thumb: "audio2"
      }
    ]
  },
  {
    date: "17 февраля",
    weekday: "Вторник",
    meetings: [
      {
        id: "m6",
        title: "Онбординг партнёра: Я.Телемост",
        time: "09:50",
        duration: "36 мин",
        participant: "partners@mymeet.ai",
        source: "yandex-telemost",
        dateISO: "2026-02-17",
        status: "Загружено",
        thumb: "legacy"
      },
      {
        id: "m7",
        title: "Архитектурная сессия по events pipeline",
        time: "13:10",
        duration: "74 мин",
        participant: "arch@mymeet.ai",
        source: "kontur-talk",
        dateISO: "2026-02-17",
        status: "Загружено",
        thumb: "audio2"
      },
      {
        id: "m8",
        title: "Интервью клиента: сценарии поиска встреч",
        time: "18:05",
        duration: "29 мин",
        participant: "research@mymeet.ai",
        source: "jitsi",
        dateISO: "2026-02-17",
        status: "Загружено",
        thumb: "audio1"
      },
      {
        id: "m9",
        title: "Инцидент-ретро по задержке загрузок",
        time: "19:00",
        duration: "52 мин",
        participant: "sre@mymeet.ai",
        source: "salutejazz",
        dateISO: "2026-02-17",
        status: "Загружено",
        thumb: "audio1"
      },
      {
        id: "m10",
        title: "Подготовка release notes и changelog",
        time: "20:10",
        duration: "24 мин",
        participant: "release@mymeet.ai",
        source: "trueconf",
        dateISO: "2026-02-17",
        status: "Загружено",
        thumb: "audio2"
      }
    ]
  },
  {
    date: "15 января",
    weekday: "Четверг",
    meetings: [
      {
        id: "m11",
        title: "Анализ падения конверсии после редизайна onboarding",
        time: "16:55",
        duration: "47 мин",
        participant: "analytics@mymeet.ai",
        source: "uploaded",
        dateISO: "2026-01-15",
        status: "Загружено",
        thumb: "audio1"
      },
      {
        id: "m12",
        title: "Согласование roadmap интеграций на Q2",
        time: "09:20",
        duration: "39 мин",
        participant: "pm@mymeet.ai",
        source: "trueconf",
        dateISO: "2026-01-15",
        status: "Загружено",
        thumb: "audio2"
      }
    ]
  },
  {
    date: "9 января",
    weekday: "Пятница",
    meetings: [
      {
        id: "m13",
        title: "Клиентский созвон: автоматические саммари встреч",
        time: "13:35",
        duration: "54 мин",
        participant: "customer.success@mymeet.ai",
        source: "google-meet",
        dateISO: "2026-01-09",
        status: "Загружено",
        thumb: "audio1"
      },
      {
        id: "m14",
        title: "Техдолг: чистка очередей воркеров обработки",
        time: "08:45",
        duration: "26 мин",
        participant: "platform@mymeet.ai",
        source: "salutejazz",
        dateISO: "2026-01-09",
        status: "Загружено",
        thumb: "audio2"
      }
    ]
  },
  {
    date: "3 января",
    weekday: "Суббота",
    meetings: [
      {
        id: "m15",
        title: "Ретро релиза мобильного виджета встреч",
        time: "15:25",
        duration: "33 мин",
        participant: "mobile@mymeet.ai",
        source: "microsoft-teams",
        dateISO: "2026-01-03",
        status: "Загружено",
        thumb: "audio1"
      }
    ]
  }
];

export const defaultFilters: FilterState = {
  participants: [],
  source: [],
  date: { kind: "none" }
};
