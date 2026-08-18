import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Beaker,
  Menu,
  X,
  AlertCircle,
  User,
  ShoppingCart,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import BetaTesterModal from "./BetaTesterModal";
import useHeader from "../hooks/useHeader";
import useContent from "../hooks/useContent";
import useCartStore from "../stores/useCartStore";
import useCartUIStore from "../stores/useCartUIStore";
import lang from "../lang";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors duration-200 md:text-base ${
    isActive ? "text-plumbob" : "text-text-sub hover:text-text-main"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block text-sm font-medium py-2 ${isActive ? "text-plumbob" : "text-text-sub"}`;

function Header() {
  const { content: headerContent } = useContent("header");
  const { content: cartContent } = useContent("cart");
  const {
    user,
    email,
    isBetaTester,
    isAdmin,
    profileComplete,
    isLoggedIn,
    mobileOpen,
    modalOpen,
    betaLoading,
    betaSuccess,
    betaError,
    showBetaButton,
    theme,
    toggleTheme,
    handleLogout,
    toggleMobile,
    closeMobile,
    openModal,
    closeModal,
    becomeBetaTester,
  } = useHeader();

  const itemsCount = useCartStore((state) => state.itemsCount);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const cartOpen = useCartUIStore((state) => state.open);

  useEffect(() => {
    if (isLoggedIn && email) fetchCart(email);
  }, [isLoggedIn, email, fetchCart]);

  useEffect(() => {
    const unsubscribe = lang.onChange(() => {
      if (isLoggedIn && email) fetchCart(email);
    });
    return unsubscribe;
  }, [isLoggedIn, email, fetchCart]);

  return (
    <header className="w-full sticky top-0 z-50 bg-surface border-b border-border">
      {isLoggedIn && !profileComplete && (
        <div className="bg-azure/10 border-b border-azure/20 px-4 py-2 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs md:text-sm text-azure">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {headerContent.profile_warning_prefix}{" "}
              <NavLink to="/perfil" className="underline font-medium">
                {headerContent.profile_warning_link}
              </NavLink>
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            {headerContent.nav_home}
          </NavLink>

          {!isLoggedIn && (
            <>
              <NavLink to="/registro" className={navLinkClass}>
                {headerContent.nav_register}
              </NavLink>
              <NavLink to="/login" className={navLinkClass}>
                {headerContent.nav_login}
              </NavLink>
            </>
          )}

          {showBetaButton && (
            <button
              onClick={openModal}
              className="relative inline-flex items-center gap-1.5 rounded-full bg-plumbob/10 border border-plumbob/30 px-3.5 py-1.5 text-xs font-semibold text-plumbob transition-all duration-300 hover:bg-plumbob/20 hover:border-plumbob/50 hover:shadow-lg hover:shadow-plumbob/20 beta-glow cursor-pointer"
            >
              <Beaker className="w-3.5 h-3.5" />
              {headerContent.beta_cta}
            </button>
          )}

          {isLoggedIn && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border/50">
              <NavLink
                to="/car"
                aria-label={cartContent.aria_label}
                className={({ isActive }) =>
                  `relative p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-plumbob bg-plumbob/10"
                      : "text-text-dim hover:text-plumbob hover:bg-plumbob/10"
                  }`
                }
              >
                <ShoppingCart className="w-4 h-4" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-plumbob text-[0.625rem] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/perfil"
                className="p-2 rounded-lg text-text-dim hover:text-plumbob hover:bg-plumbob/10 transition-all duration-200 cursor-pointer"
                aria-label={headerContent.profile_link_aria}
              >
                <User className="w-4 h-4" />
              </NavLink>
              <span className="text-sm font-medium text-text-sub truncate max-w-[8.75rem]">
                {user?.fullName || email}
              </span>
              {isBetaTester && (
                <span className="inline-flex items-center gap-1 rounded-full bg-plumbob/15 border border-plumbob/30 px-2.5 py-0.5 text-xs font-semibold text-plumbob">
                  <Beaker className="w-3 h-3" />
                  {headerContent.beta_badge_label}
                </span>
              )}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="inline-flex items-center gap-1 rounded-full bg-azure/15 border border-azure/30 px-2.5 py-0.5 text-xs font-semibold text-azure transition-all duration-200 hover:bg-azure/25"
                >
                  {headerContent.nav_admin}
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                aria-label={headerContent.logout_aria}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          {isLoggedIn === true && (
            <NavLink
              to="/car"
              aria-label={cartContent.aria_label}
              className={({ isActive }) =>
                `relative p-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "text-plumbob bg-surface/50"
                    : "text-text-sub hover:text-plumbob hover:bg-surface/50"
                }`
              }
            >
              <ShoppingCart className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-plumbob text-[0.625rem] font-bold text-white">
                  {itemsCount}
                </span>
              )}
            </NavLink>
          )}
          <LanguageToggle />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            onClick={toggleMobile}
            className="p-2 rounded-lg text-text-sub hover:text-text-main hover:bg-surface/50 transition-colors cursor-pointer"
            aria-label={headerContent.menu_aria}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 px-4 py-4 space-y-3 animate-slide-down">
          <NavLink to="/" end onClick={closeMobile} className={mobileLinkClass}>
            {headerContent.nav_home}
          </NavLink>

          {!isLoggedIn && (
            <>
              <NavLink
                to="/registro"
                onClick={closeMobile}
                className={mobileLinkClass}
              >
                {headerContent.nav_register}
              </NavLink>
              <NavLink
                to="/login"
                onClick={closeMobile}
                className={mobileLinkClass}
              >
                {headerContent.nav_login}
              </NavLink>
            </>
          )}

          {showBetaButton && (
            <button
              onClick={() => {
                closeMobile();
                openModal();
              }}
              className="flex items-center gap-2 text-sm font-medium text-plumbob py-2 cursor-pointer"
            >
              <Beaker className="w-4 h-4" />
              {headerContent.beta_cta}
            </button>
          )}

          {isLoggedIn && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-sm text-text-sub mb-3">
                {user?.fullName || email}
              </p>
              <NavLink
                to="/perfil"
                onClick={closeMobile}
                className="flex items-center gap-2 text-sm text-text-sub hover:text-text-main py-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                {headerContent.mobile_profile_link}
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMobile}
                  className="flex items-center gap-2 text-sm text-text-sub hover:text-text-main py-2 cursor-pointer"
                >
                  {headerContent.nav_admin}
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {headerContent.logout_aria}
              </button>
            </div>
          )}
        </div>
      )}

      <BetaTesterModal
        open={modalOpen}
        loading={betaLoading}
        success={betaSuccess}
        error={betaError}
        onConfirm={becomeBetaTester}
        onClose={closeModal}
      />
    </header>
  );
}

export default Header;
