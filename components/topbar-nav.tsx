import Link from "next/link";

type CurrentNav = "home" | "login" | "dashboard" | "public" | "none";

type TopbarNavProps = {
  currentNav: CurrentNav;
  publicHref: string;
  isLoggedIn: boolean;
  logoutAction?: () => Promise<void>;
  brandLabel?: string;
};

function buttonClass(isActive: boolean) {
  return isActive ? "secondary-button" : "ghost-button";
}

export function TopbarNav({
  currentNav,
  publicHref,
  isLoggedIn,
  logoutAction,
  brandLabel = "LiveCV"
}: TopbarNavProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">L</span>
        <span>{brandLabel}</span>
      </div>

      <nav className="nav-links">
        <Link className={buttonClass(currentNav === "home")} href="/">
          Home
        </Link>
        {isLoggedIn && logoutAction
          ? <>
            <Link className={buttonClass(currentNav === "dashboard")} href="/dashboard">
              Dashboard
            </Link>
            <a className={buttonClass(currentNav === "public")} href={publicHref}>
              Pagina pubblica
            </a>
            <form action={logoutAction}>
              <button className="ghost-button" type="submit">
                Logout
              </button>
            </form>
          </>
          : <Link className={buttonClass(currentNav === "login")} href="/login">
            Login
          </Link>
        }
      </nav>
    </header>
  );
}
