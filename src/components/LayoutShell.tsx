import { assets } from "../assets";
import { primaryMenu, secondaryMenu } from "../data";
import type { Screen } from "../types";

type LayoutShellProps = {
  screen: Screen;
  title: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  onNavigate: (screen: Screen) => void;
  children: React.ReactNode;
};

function isMenuItemActive(activeScreen: Screen, itemScreen: Screen): boolean {
  return activeScreen === itemScreen;
}

function MenuList({ activeScreen, onNavigate }: { activeScreen: Screen; onNavigate: (screen: Screen) => void }) {
  return (
    <div className="menu-list">
      {primaryMenu.map((item) => {
        const active = isMenuItemActive(activeScreen, item.key);

        return (
          <button
            className={`menu-item${active ? " is-active" : ""}`}
            key={item.key}
            onClick={() => onNavigate(item.key)}
            type="button"
          >
            <img alt="" className="menu-icon" src={item.icon} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LayoutShell({
  screen,
  title,
  sidebarOpen,
  onToggleSidebar,
  onCloseSidebar,
  onNavigate,
  children
}: LayoutShellProps) {
  return (
    <div className="app-shell" data-node-id="27141:3290">
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div>
          <div className="brand">
            <img alt="" className="brand-mark" src={assets.logoMark} />
            <img alt="mymeet.ai" className="brand-text" src={assets.logoText} />
          </div>

          <button className="add-meeting-btn" type="button">
            <span>Добавить встречу</span>
            <span className="plus">+</span>
          </button>

          <MenuList activeScreen={screen} onNavigate={onNavigate} />
          <div className="divider" />
          <div className="menu-list">
            {secondaryMenu.map((item) => (
              <button className="menu-item" key={item.label} type="button">
                <img alt="" className="menu-icon" src={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <button className="menu-item logout" type="button">
            <img alt="" className="menu-icon" src={assets.powerIcon} />
            <span>Выйти</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="account-row">
            <img alt="" className="avatar" src={assets.userAvatar} />
            <div>
              <div className="account-name">Mymeet.ai</div>
              <div className="account-role">Владелец</div>
            </div>
          </div>
          <div className="plan-row">
            <div className="plan-title-line">
              <span className="plan-title">Pro plan</span>
              <span className="plan-usage">Доступно 1850 из 2500</span>
            </div>
            <div className="plan-progress-bg">
              <div className="plan-progress-fill" />
            </div>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button aria-label="Открыть меню" className="menu-toggle" onClick={onToggleSidebar} type="button">
              ≡
            </button>
            <h1>{title}</h1>
          </div>
          <div className="user-email">
            <img alt="" src={assets.profileIcon} />
            <span>hello@mymeet.ai</span>
          </div>
        </header>

        <div className="main-scroll">{children}</div>
      </main>

      {sidebarOpen ? <button aria-label="Закрыть меню" className="overlay" onClick={onCloseSidebar} type="button" /> : null}
    </div>
  );
}
