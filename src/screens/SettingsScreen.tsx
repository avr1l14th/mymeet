import { useState } from "react";
import { assets } from "../assets";
import { TrailingChevron } from "../components/TrailingChevron";

type SettingsTab = "settings" | "workspace" | "plan";

type SettingSelectRow = {
  id: string;
  icon: string;
  title: string;
  subtitle: React.ReactNode;
  value: string;
  valueWithIcon?: boolean;
};

type SettingsActionRow = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
  arrow?: boolean;
  trailingIcon?: string;
};

type SettingsPlanActionRow = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
};

const workspaceCover = "https://www.figma.com/api/mcp/asset/f8ef8091-9109-4043-9dbf-b268ebc44b43";
const workspaceBadge = "https://www.figma.com/api/mcp/asset/9d04ab95-bd68-4b40-9275-e4d7a72b9f44";
const workspaceLogo = "https://www.figma.com/api/mcp/asset/5c0c66d2-9247-4f36-a17e-f7d7dc0f87bc";
const settingsDropdownChevron = "icons/settings-chevron-down.svg";
const settingsWorkspaceAvatar = "https://www.figma.com/api/mcp/asset/d1ef5562-b60c-4641-bfd9-037d00502a11";

const settingsDefaultReportIcon = "https://www.figma.com/api/mcp/asset/ad53988b-019c-41ba-9b4b-775c54d7c595";
const settingsAutoSendIcon = "https://www.figma.com/api/mcp/asset/edb13bc8-d4a2-4a09-8b53-bb771c99ad5f";
const settingsInterfaceLanguageIcon = "https://www.figma.com/api/mcp/asset/4a9455d1-4add-482d-9d10-b573c7a4eb7b";
const settingsTranscriptionLanguageIcon = "https://www.figma.com/api/mcp/asset/8ee7a52a-4a45-40ab-97c0-2e1fe64a74ac";

const settingsBotCustomizationIcon = "https://www.figma.com/api/mcp/asset/1d47d525-ab8b-439b-bcc4-66e2657adfba";
const settingsCustomWordsIcon = "https://www.figma.com/api/mcp/asset/fff07faf-b949-4339-84a5-4b546deef6b3";
const settingsInviteByEmailIcon = "https://www.figma.com/api/mcp/asset/96cd8229-6170-4978-b5e5-6e25b0a4266d";
const settingsUserCircleSmallIcon = "https://www.figma.com/api/mcp/asset/130bfb94-1b1b-4212-8795-129b15cda444";
const settingsPlanAddSeatsIcon = "https://www.figma.com/api/mcp/asset/926d9c6f-ceb1-48b6-912c-add193491d43";
const settingsPlanRemoveSeatsIcon = "https://www.figma.com/api/mcp/asset/740e7cf7-a091-40b2-a4a4-11452c291036";
const settingsPlanChangePlanIcon = "https://www.figma.com/api/mcp/asset/f5d893b2-2adb-483a-a757-c2acfef54dca";
const settingsPlanCancelSubscriptionIcon = "https://www.figma.com/api/mcp/asset/02249346-0dc2-462f-b456-50c646a45616";
const settingsPlanAddMinutesIcon = "https://www.figma.com/api/mcp/asset/1c2abff0-5fe5-45ea-9527-be9efb7c6af7";
const settingsPlanInvoiceIcon = "https://www.figma.com/api/mcp/asset/e0f2db00-f394-47d5-a932-ec04bf6fe889";

const generalSettingsRows: SettingSelectRow[] = [
  {
    id: "ai-report-default",
    icon: settingsDefaultReportIcon,
    title: "AI отчет по умолчанию",
    subtitle: (
      <>
        Применяется ко всем встречам. <span className="settings-link">Обзор отчетов</span>
      </>
    ),
    value: "Встреча с клиентом",
    valueWithIcon: true
  },
  {
    id: "auto-email-send",
    icon: settingsAutoSendIcon,
    title: "Авто-отправка отчета по почте",
    subtitle: "Не придется отправлять вручную",
    value: "Только мне"
  }
];

const languageSettingsRows: SettingSelectRow[] = [
  {
    id: "interface-language",
    icon: settingsInterfaceLanguageIcon,
    title: "Язык интерфейса",
    subtitle: "Язык отображения системы",
    value: "Русский"
  },
  {
    id: "transcription-language",
    icon: settingsTranscriptionLanguageIcon,
    title: "Язык транскрибации",
    subtitle: "Язык обработки встреч",
    value: "Авто"
  }
];

const workspaceCustomizationRows: SettingsActionRow[] = [
  {
    id: "bot-customization",
    icon: settingsBotCustomizationIcon,
    title: "Кастомизация бота",
    subtitle: "Настройка внешнего вида бота на встречах",
    badge: "СКОРО"
  },
  {
    id: "custom-words",
    icon: settingsCustomWordsIcon,
    title: "Словарь кастомных слов",
    subtitle: "Слова и термины для точного распознавания",
    arrow: true,
    trailingIcon: assets.filterArrowRightIcon
  }
];

const participantsRows: SettingsActionRow[] = [
  {
    id: "invite-by-email",
    icon: settingsInviteByEmailIcon,
    title: "Пригласить по почте",
    subtitle: "Пользователи получат приглашение на почту",
    arrow: true,
    trailingIcon: assets.filterArrowRightIcon
  }
];

const settingsPlanRows: SettingsPlanActionRow[] = [
  {
    id: "add-seats",
    icon: settingsPlanAddSeatsIcon,
    title: "Добавить места",
    subtitle: "Больше пользователей смогут присоединиться к пространству"
  },
  {
    id: "remove-seats",
    icon: settingsPlanRemoveSeatsIcon,
    title: "Удалить места",
    subtitle: "Количество мест будет уменьшено"
  },
  {
    id: "change-plan",
    icon: settingsPlanChangePlanIcon,
    title: "Сменить тариф",
    subtitle: "Доступны Lite, Pro и Business тарифы"
  },
  {
    id: "cancel-subscription",
    icon: settingsPlanCancelSubscriptionIcon,
    title: "Отменить подписку",
    subtitle: "Доступ ко встречам закроется через 30 дней после отмены"
  }
];

const settingsExtraMinutesRows: SettingsPlanActionRow[] = [
  {
    id: "add-minutes",
    icon: settingsPlanAddMinutesIcon,
    title: "Добавить минуты",
    subtitle: "Покупка минут для обработки встреч"
  }
];

const settingsInvoiceRows: SettingsPlanActionRow[] = [
  {
    id: "invoice",
    icon: settingsPlanInvoiceIcon,
    title: "Выставить счет",
    subtitle: "Коммуникация происходит через менеджера"
  }
];

function SettingsSelectRow({ row }: { row: SettingSelectRow }) {
  return (
    <div className="settings-row" key={row.id}>
      <div className="settings-row-main">
        <div className="settings-row-icon-box">
          <img alt="" className="settings-row-icon" src={row.icon} />
        </div>
        <div className="settings-row-text">
          <p className="settings-row-title">{row.title}</p>
          <p className="settings-row-subtitle">{row.subtitle}</p>
        </div>
      </div>

      <button className="settings-row-select" type="button">
        {row.valueWithIcon ? <span aria-hidden="true" className="settings-row-select-mark" /> : null}
        <span>{row.value}</span>
        <img alt="" src={settingsDropdownChevron} />
      </button>
    </div>
  );
}

function SettingsActionRowItem({ row, withTopBorder = false }: { row: SettingsActionRow; withTopBorder?: boolean }) {
  return (
    <div className={`settings-row${withTopBorder ? " settings-row-with-border" : ""}`}>
      <div className="settings-row-main">
        <div className="settings-row-icon-box">
          <img alt="" className="settings-row-icon" src={row.icon} />
        </div>
        <div className="settings-row-text">
          <p className="settings-row-title">{row.title}</p>
          <p className="settings-row-subtitle">{row.subtitle}</p>
        </div>
      </div>

      {row.badge ? <span className="settings-soon-badge">{row.badge}</span> : null}
      {row.arrow ? <TrailingChevron className="settings-row-trailing" iconClassName="settings-row-arrow" iconSrc={row.trailingIcon ?? ""} /> : null}
    </div>
  );
}

function SettingsPlanActionRowItem({ row, withTopBorder = false }: { row: SettingsPlanActionRow; withTopBorder?: boolean }) {
  return (
    <div className={`settings-row${withTopBorder ? " settings-row-with-border" : ""}`}>
      <div className="settings-row-main">
        <div className="settings-row-icon-box">
          <img alt="" className="settings-row-icon" src={row.icon} />
        </div>
        <div className="settings-row-text">
          <p className="settings-row-title">{row.title}</p>
          <p className="settings-row-subtitle">{row.subtitle}</p>
        </div>
      </div>

      <TrailingChevron className="settings-row-trailing" iconClassName="settings-row-arrow" iconSrc={assets.filterArrowRightIcon} />
    </div>
  );
}

function SettingsWorkspaceTab() {
  return (
    <>
      <section className="settings-workspace-name-block">
        <div className="settings-workspace-name-row">
          <img alt="" className="settings-workspace-name-avatar" src={settingsWorkspaceAvatar} />
          <div className="settings-workspace-name-content">
            <p className="settings-workspace-name-label">Название пространства</p>
            <input
              aria-label="Название пространства"
              className="settings-workspace-name-input"
              defaultValue="Mymeet.ai"
              type="text"
            />
          </div>
        </div>
      </section>

      <div className="settings-divider" />

      <section className="settings-group">
        <h2 className="settings-group-title">Настройки кастомизации</h2>
        <div className="settings-card">
          {workspaceCustomizationRows.map((row, index) => (
            <div key={row.id}>
              <SettingsActionRowItem row={row} withTopBorder={index === 1} />
            </div>
          ))}
        </div>
      </section>

      <section className="settings-group">
        <h2 className="settings-group-title">Участники</h2>
        <div className="settings-card settings-participants-invite-card">
          {participantsRows.map((row) => (
            <SettingsActionRowItem key={row.id} row={row} />
          ))}
        </div>

        <div className="settings-participants-table">
          <div className="settings-participants-header">
            <span>Сотрудник</span>
            <span>Роль</span>
            <span>Минуты</span>
            <span>План до</span>
          </div>

          <div className="settings-participants-row">
            <div className="settings-participants-user">
              <img alt="" src={settingsUserCircleSmallIcon} />
              <span>hello@mymeet.ai</span>
            </div>

            <div>
              <span className="settings-role-badge">Владелец</span>
            </div>

            <div className="settings-minutes-cell">
              <span className="settings-minutes-main">500</span>
              <span className="settings-minutes-total">/4300</span>
            </div>

            <span className="settings-plan-date">05.08.2025</span>
          </div>
        </div>
      </section>
    </>
  );
}

function SettingsMainTab() {
  return (
    <>
      <section className="settings-group">
        <h2 className="settings-group-title">Общие настройки</h2>
        <div className="settings-card">
          {generalSettingsRows.map((row, index) => (
            <div key={row.id}>
              <SettingsSelectRow row={row} />
              {index !== generalSettingsRows.length - 1 ? <div className="settings-card-divider" /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="settings-group">
        <h2 className="settings-group-title">Настройки языка</h2>
        <div className="settings-card">
          {languageSettingsRows.map((row, index) => (
            <div key={row.id}>
              <SettingsSelectRow row={row} />
              {index !== languageSettingsRows.length - 1 ? <div className="settings-card-divider" /> : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SettingsPlanTab() {
  return (
    <>
      <section className="settings-group">
        <h2 className="settings-group-title">Текущий тариф</h2>
        <div className="settings-card">
          <div className="settings-plan-summary">
            <p className="settings-plan-line">
              <span className="settings-plan-line-label">Plan:</span>
              <span className="settings-plan-line-value">PRO x 4</span>
            </p>
            <p className="settings-plan-line">
              <span className="settings-plan-line-label">Active seats:</span>
              <span className="settings-plan-line-value">4</span>
            </p>
            <p className="settings-plan-line">
              <span className="settings-plan-line-label">Price:</span>
              <span className="settings-plan-line-value">64$ / 6 months</span>
            </p>
            <p className="settings-plan-line">
              <span className="settings-plan-line-label">Next payment:</span>
              <span className="settings-plan-line-value">01.12.2025 08:52:35 (GMT+3)</span>
            </p>
          </div>

          {settingsPlanRows.map((row, index) => (
            <SettingsPlanActionRowItem key={row.id} row={row} withTopBorder={index > 0} />
          ))}
        </div>
      </section>

      <section className="settings-group">
        <h2 className="settings-group-title">Дополнительные минуты</h2>
        <div className="settings-card">
          {settingsExtraMinutesRows.map((row) => (
            <SettingsPlanActionRowItem key={row.id} row={row} />
          ))}
        </div>
      </section>

      <section className="settings-group">
        <h2 className="settings-group-title">Оплата по счету</h2>
        <div className="settings-card">
          {settingsInvoiceRows.map((row) => (
            <SettingsPlanActionRowItem key={row.id} row={row} />
          ))}
        </div>
      </section>
    </>
  );
}

export function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("settings");

  return (
    <section className="settings-page" data-node-id="27326:8368">
      <div className="settings-content">
        <article className="settings-workspace-card">
          <div className="settings-workspace-cover-wrap">
            <img alt="" className="settings-workspace-cover" src={workspaceCover} />
            <div className="settings-workspace-cover-tint" />
            <div className="settings-workspace-badge">
              <img alt="" src={workspaceLogo} />
              <img alt="Pro" className="settings-workspace-pro" src={workspaceBadge} />
            </div>
          </div>

          <div className="settings-workspace-meta">
            <div>
              <p className="settings-meta-label">Пространство</p>
              <p className="settings-meta-value">Mymeet.ai</p>
            </div>
            <div className="settings-meta-stats">
              <div>
                <p className="settings-meta-label">Встречи</p>
                <p className="settings-meta-value">254</p>
              </div>
              <div>
                <p className="settings-meta-label">Места</p>
                <p className="settings-meta-value">4</p>
              </div>
            </div>
          </div>
        </article>

        <div className="settings-divider" />

        <div className="settings-segmented" role="tablist">
          <button
            aria-selected={activeTab === "settings"}
            className={`settings-segmented-item${activeTab === "settings" ? " is-active" : ""}`}
            onClick={() => setActiveTab("settings")}
            role="tab"
            type="button"
          >
            Настройки
          </button>
          <button
            aria-selected={activeTab === "workspace"}
            className={`settings-segmented-item${activeTab === "workspace" ? " is-active" : ""}`}
            onClick={() => setActiveTab("workspace")}
            role="tab"
            type="button"
          >
            Рабочее пространство
          </button>
          <button
            aria-selected={activeTab === "plan"}
            className={`settings-segmented-item${activeTab === "plan" ? " is-active" : ""}`}
            onClick={() => setActiveTab("plan")}
            role="tab"
            type="button"
          >
            Тариф
          </button>
        </div>

        {activeTab === "settings" ? <SettingsMainTab /> : null}
        {activeTab === "workspace" ? <SettingsWorkspaceTab /> : null}
        {activeTab === "plan" ? <SettingsPlanTab /> : null}
      </div>
    </section>
  );
}
