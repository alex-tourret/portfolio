import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../../styles/menuBurger.scss";
import ArrowDiagonalRight from "../../../utils/svgs/arrowDiagonalRight";
import MagneticButton, { MagneticLayer } from "./magneticButton";
import { useSmoothScroll } from "../../../utils/scroll/useSmoothScroll";
import { PROFILE, getCurrentYear } from "../../../config/profile";

const SCROLL_SHOW_THRESHOLD = 220;
const SCROLL_HIDE_THRESHOLD = 170;
const TOP_RESET_THRESHOLD = 24;
const MENU_PANEL_ID = "site-navigation-drawer";
const MENU_TITLE_ID = "site-navigation-title";
const MENU_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const DRAWER_TRANSITION = {
  duration: 0.55,
  ease: [0.7, 0, 0.2, 1] as const,
};

const navigationLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "certifications", label: "Certifications" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function BurgerVisual({ isOpen }: { isOpen: boolean }) {
  const area = 48;
  const width = 32;
  const room = 8;
  const barHeight = 3;
  const margin = 9;
  const topOffset = 17;
  const easing = "cubic-bezier(0, 0, 0, 1)";
  const time = 0.4;
  const offset = barHeight / 2 + margin / 2;
  const groupTransition = `${time / 2}s ${easing} ${isOpen ? "0s" : `${time / 2}s`}`;
  const lineTransition = `${time / 2}s ${easing} ${isOpen ? `${time / 2}s` : "0s"}`;

  return (
    <span
      className="burger-visual"
      aria-hidden="true"
      style={{
        width: `${area}px`,
        height: `${area}px`,
        position: "relative",
        display: "inline-block",
        transform: isOpen ? "rotate(-90deg)" : "none",
        transition: `${time}s ${easing}`,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          transition: groupTransition,
          transform: isOpen ? `translateY(${offset}px)` : "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            background: "currentColor",
            height: `${barHeight}px`,
            width: `${width}px`,
            left: `${room}px`,
            top: `${topOffset}px`,
            borderRadius: "999px",
            transition: lineTransition,
            transform: isOpen ? "rotate(45deg)" : "none",
          }}
        />
      </span>
      <span
        style={{
          position: "absolute",
          inset: 0,
          transition: groupTransition,
          transform: isOpen ? `translateY(-${offset}px)` : "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            background: "currentColor",
            height: `${barHeight}px`,
            width: `${width}px`,
            left: `${room}px`,
            top: `${topOffset + barHeight + margin}px`,
            borderRadius: "999px",
            transition: lineTransition,
            transform: isOpen ? "rotate(-45deg)" : "none",
          }}
        />
      </span>
    </span>
  );
}

function MenuBurger({
  isVisible,
  isMenuToggled,
  setIsMenuToggled,
  isPinned = false,
}: {
  isVisible: boolean;
  isMenuToggled: boolean;
  setIsMenuToggled: React.Dispatch<React.SetStateAction<boolean>>;
  isPinned?: boolean;
}) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const currentYear = getCurrentYear();

  const { scrollToSection: navigateToSection } = useSmoothScroll();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);
  const shouldRestoreFocusRef = useRef(true);

  const isMenuOpen = isMenuToggled;

  const closeMenu = useCallback(
    ({ restoreFocus = true }: { restoreFocus?: boolean } = {}) => {
      shouldRestoreFocusRef.current = restoreFocus;
      setIsMenuToggled(false);
    },
    [setIsMenuToggled],
  );

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
      return;
    }

    setIsMenuToggled(true);
  }

  useEffect(() => {
    if (isPinned) {
      setHasScrolled(true);
      return;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;

      setHasScrolled((prev) => {
        if (prev) return currentY > SCROLL_HIDE_THRESHOLD;
        return currentY > SCROLL_SHOW_THRESHOLD;
      });

      if (currentY <= TOP_RESET_THRESHOLD && isMenuOpen) {
        closeMenu({ restoreFocus: false });
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeMenu, isMenuOpen, isPinned]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      firstMenuItemRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusableElements = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(MENU_FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  const shouldShowBurger = isPinned || (hasScrolled && isVisible);

  return (
    <>
      <MagneticButton
        ref={triggerRef}
        className={`button-2 ${shouldShowBurger ? "visible" : "hidden"}`}
        speed={0.3}
        scale={1.2}
        tolerance={0.6}
        type="button"
        aria-label={
          isMenuOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-controls={MENU_PANEL_ID}
        aria-expanded={isMenuOpen}
        aria-haspopup="dialog"
        onClick={toggleMenu}
      >
        <MagneticLayer
          className="button-1 burger-trigger_shell"
          speed={0.3}
          scale={1.2}
          tolerance={0.9}
          aria-hidden="true"
        >
          <BurgerVisual isOpen={isMenuOpen} />
        </MagneticLayer>
      </MagneticButton>

      <AnimatePresence
        onExitComplete={() => {
          if (shouldRestoreFocusRef.current) {
            triggerRef.current?.focus();
          }
          shouldRestoreFocusRef.current = true;
        }}
      >
        {isMenuOpen ? (
          <motion.aside
            ref={menuRef}
            id={MENU_PANEL_ID}
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={MENU_TITLE_ID}
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "120%" }}
            transition={DRAWER_TRANSITION}
          >
            <div className="menu-content">
              <h2 className="menu-title" id={MENU_TITLE_ID}>
                Navigation
              </h2>

              <nav className="menu-navigation" aria-label="Site sections">
                <div className="menu-items">
                  {navigationLinks.map((link, index) => (
                    <a
                      key={link.id}
                      ref={index === 0 ? firstMenuItemRef : undefined}
                      className="menu-item"
                      href={`#${link.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        closeMenu({ restoreFocus: false });
                        navigateToSection(link.id);
                      }}
                    >
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </nav>

              <div className="menu-footer">
                <div className="menu-links">
                  <a
                    href={PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-link"
                    onClick={() => closeMenu({ restoreFocus: false })}
                  >
                    LinkedIn
                    <ArrowDiagonalRight />
                  </a>
                  <a
                    href={PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-link"
                    onClick={() => closeMenu({ restoreFocus: false })}
                  >
                    GitHub
                    <ArrowDiagonalRight />
                  </a>
                  <a
                    href={PROFILE.cvPublicPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="menu-link"
                    onClick={() => closeMenu({ restoreFocus: false })}
                  >
                    CV
                    <span aria-hidden="true">↓</span>
                  </a>
                </div>
                <p className="menu-copyright">
                  © {currentYear} Alexandre Tourret
                </p>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MenuBurger;
