import { assets } from "../assets";
import { TrailingChevron } from "../components/TrailingChevron";

export function IntegrationsScreen() {
  const connectedIntegrations = [
    {
      id: "c1",
      title: "Yandex Calendar",
      subtitle: "fz4884@gmail.com",
      updatedAt: "Обновлено в 19:45",
      workspace: "Workspace's name",
      icon: "https://www.figma.com/api/mcp/asset/c1004a52-be07-4b17-9094-8fcf2975ffca"
    },
    {
      id: "c2",
      title: "Google Calendar",
      subtitle: "fz4884@gmail.com",
      updatedAt: "Обновлено в 19:45",
      workspace: "Workspace's name",
      icon: "https://www.figma.com/api/mcp/asset/65f3b0bc-8d7f-4d74-9222-e64e7be76788"
    },
    {
      id: "c3",
      title: "Telegram",
      subtitle: "@avr1l14th",
      workspace: "Workspace's name",
      icon: "https://www.figma.com/api/mcp/asset/722bb05b-c94a-42ad-992a-60075e595cea"
    },
    {
      id: "c4",
      title: "amoCRM",
      subtitle: "mymeet.amo",
      workspace: "Workspace's name",
      icon: "https://www.figma.com/api/mcp/asset/f4c6052e-c026-4f0d-9f9d-f175f29ccbb6"
    }
  ];

  const availableIntegrations = [
    {
      id: "a1",
      title: "Chrome расширение",
      description: "Запись, транскрибация и анализ встреч в GMeet, Zoom и Я.Телемост",
      icon: "https://www.figma.com/api/mcp/asset/703cea9d-8d63-4116-9008-f3276b9d625f"
    },
    {
      id: "a2",
      title: "Microsoft Outlook",
      description: "Автоматическое приглашение бота на встречи из календаря",
      icon: "https://www.figma.com/api/mcp/asset/975c44b5-2a70-4bdf-9c73-f456d497474c"
    },
    {
      id: "a3",
      title: "Microsoft Exchange",
      description: "Автоматическое приглашение бота на встречи из корпоративного календаря",
      icon: "https://www.figma.com/api/mcp/asset/a9b6843b-1f57-44b7-a6f7-cdb9eb54f48f"
    },
    {
      id: "a4",
      title: "Ключ API",
      description: "Транскрибация, саммари и аналитика встреч через API",
      icon: "https://www.figma.com/api/mcp/asset/2c0062ec-7a78-4010-a597-f08ef29e6f4f"
    }
  ];

  return (
    <section className="integrations-page" data-node-id="27326:7714">
      <div className="integrations-content" data-node-id="27326:7975">
        <div className="integrations-section">
          <h2 className="integrations-section-title">Подключенные</h2>
          <div className="integrations-connected-card">
            {connectedIntegrations.map((integration, index) => (
              <article className="integrations-connected-row" key={integration.id}>
                <div className="integrations-connected-main">
                  <div className="integrations-icon-box">
                    <img alt="" className="integrations-icon" src={integration.icon} />
                  </div>
                  <div className="integrations-connected-text">
                    <p className="integrations-connected-title">{integration.title}</p>
                    <p className="integrations-connected-subtitle">{integration.subtitle}</p>
                  </div>
                </div>

                {integration.updatedAt ? <p className="integrations-connected-updated">{integration.updatedAt}</p> : <span />}

                <TrailingChevron
                  className="integrations-connected-workspace"
                  iconSrc={assets.filterArrowRightIcon}
                  label={integration.workspace}
                />

                {index !== connectedIntegrations.length - 1 ? <div className="integrations-connected-divider" /> : null}
              </article>
            ))}
          </div>
        </div>

        <div className="integrations-section">
          <h2 className="integrations-section-title">Доступные</h2>
          <div className="integrations-available-grid">
            {availableIntegrations.map((integration) => (
              <article className="integrations-available-item" key={integration.id}>
                <div className="integrations-icon-box">
                  <img alt="" className="integrations-icon" src={integration.icon} />
                </div>
                <div className="integrations-available-text">
                  <p className="integrations-available-title">{integration.title}</p>
                  <p className="integrations-available-description">{integration.description}</p>
                </div>
              </article>
            ))}

            <article className="integrations-available-item integrations-available-item-single">
              <div className="integrations-icon-box integrations-icon-box-dashed">
                <img alt="" className="integrations-icon" src="https://www.figma.com/api/mcp/asset/5fba2794-e76b-4ead-b31b-f8859aa631ab" />
              </div>
              <div className="integrations-available-text">
                <p className="integrations-available-title">Не нашли нужную интеграцию?</p>
                <p className="integrations-available-description">
                  Напишите нам и расскажите, какой интеграции не хватает в mymeet.ai
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
