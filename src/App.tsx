import { Suspense, lazy, useEffect, useRef, useState } from "react";
import About from "./components/about/about";
import Certifications from "./components/certifications/certifications";
import Hero from "./components/hero/hero";
import Navbar from "./components/navbar/navbar";
import Cursor from "./utils/cursor/cursor";
import "./styles/style.scss";
import Contact from "./components/footer/footer";
import { fetchRepos } from "./utils/api/api";
import MenuBurger from "./components/navbar/menuBurger/menuBurger";
import Preloader from "./utils/preloader/preloader";
import { AnimatePresence } from "framer-motion";
import { SmoothScrollProvider } from "./utils/scroll/smoothScroll";
import type { Project } from "./data/projects";

const NAV_DESKTOP_MIN_WIDTH = 1024;
const DESKTOP_NAV_HIDE_THRESHOLD = 120;
const DESKTOP_NAV_RESTORE_THRESHOLD = 24;

const Projects = lazy(() => import("./components/projects/projects"));

function App() {
  const preloaderMode = (
    import.meta.env.VITE_PRELOADER_MODE ?? "prod"
  ).toLowerCase();
  const shouldUsePreloader =
    preloaderMode === "always" ||
    (preloaderMode !== "off" && import.meta.env.PROD);

  const [repos, setRepos] = useState<Project[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const showNavbarRef = useRef(true);
  const [isWideViewport, setIsWideViewport] = useState(
    typeof window !== "undefined"
      ? window.innerWidth >= NAV_DESKTOP_MIN_WIDTH
      : true,
  );
  const [isLoading, setIsLoading] = useState(shouldUsePreloader);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchRepos();
        setRepos(data);
      } catch (error) {
        console.error("Error loading projects data:", error);
      } finally {
        setIsDataFetched(true);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const updateViewportMode = () => {
      const wideViewport = window.innerWidth >= NAV_DESKTOP_MIN_WIDTH;
      setIsWideViewport(wideViewport);

      if (wideViewport) {
        const currentY = window.scrollY;
        const nextShowNavbar = showNavbarRef.current
          ? currentY <= DESKTOP_NAV_HIDE_THRESHOLD
          : currentY <= DESKTOP_NAV_RESTORE_THRESHOLD;

        showNavbarRef.current = nextShowNavbar;
        setShowNavbar(nextShowNavbar);
        setShowMenu(!nextShowNavbar);
      } else {
        showNavbarRef.current = false;
        setShowNavbar(false);
        setShowMenu(true);
      }
    };

    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);

    return () => {
      window.removeEventListener("resize", updateViewportMode);
    };
  }, []);

  useEffect(() => {
    if (!isWideViewport) {
      showNavbarRef.current = false;
      setShowNavbar(false);
      setShowMenu(true);
      return;
    }

    if (isMenuToggled && window.scrollY < DESKTOP_NAV_RESTORE_THRESHOLD) {
      setIsMenuToggled(false);
      setShowMenu(false);
      setShowNavbar(true);
      showNavbarRef.current = true;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      let nextShowNavbar = showNavbarRef.current;

      if (nextShowNavbar) {
        nextShowNavbar = currentY <= DESKTOP_NAV_HIDE_THRESHOLD;
      } else if (currentY <= DESKTOP_NAV_RESTORE_THRESHOLD) {
        nextShowNavbar = true;
      }

      showNavbarRef.current = nextShowNavbar;
      setShowNavbar(nextShowNavbar);
      setShowMenu(!nextShowNavbar);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuToggled, isWideViewport]);

  return (
    <SmoothScrollProvider>
      <div id="home" className="App">
        <div className="grain-overlay"></div>
        <AnimatePresence mode="wait">
          {shouldUsePreloader && isLoading && (
            <Preloader
              setIsLoading={setIsLoading}
              isDataFetched={isDataFetched}
            />
          )}
        </AnimatePresence>
        <div className="wrapper">
          {isLoading ? (
            <></>
          ) : (
            <>
              <header className="app_header">
                {isWideViewport && (
                  <div
                    className={`desktop_nav_shell ${showNavbar ? "visible" : "hidden"}`}
                    aria-hidden={!showNavbar}
                  >
                    <Navbar />
                  </div>
                )}
                <div>
                  <MenuBurger
                    isVisible={isWideViewport ? showMenu : true}
                    isMenuToggled={isMenuToggled}
                    setIsMenuToggled={setIsMenuToggled}
                    isPinned={!isWideViewport}
                  />
                </div>
              </header>
              <main>
                <Cursor isDataFetched={isDataFetched} />
                <div className="content_wrapper" ref={containerRef}>
                  <div className="container">
                    <Hero />
                    <About />
                    <Certifications />
                    <Suspense
                      fallback={
                        <section
                          className="projects_suspense_placeholder"
                          aria-hidden="true"
                        >
                          <div className="projects_suspense_line" />
                          <div className="projects_suspense_line" />
                          <div className="projects_suspense_line" />
                          <div className="projects_suspense_line" />
                        </section>
                      }
                    >
                      <Projects repos={repos} isDataFetched={isDataFetched} />
                    </Suspense>
                    <Contact />
                  </div>
                </div>
              </main>
            </>
          )}
        </div>
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
