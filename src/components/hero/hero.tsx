import { useEffect, useRef } from "react";
import "../../styles/hero.scss";
import CvLink from "../shared/cvLink";
import { useSmoothScroll } from "../../utils/scroll/useSmoothScroll";

function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollToHash, subscribe } = useSmoothScroll();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const canvas = cv;

    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    let raf = 0;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const buildLines = () => {
      const H = canvas.height;
      return Array.from({ length: 9 }, (_, i) => ({
        y: H * 0.08 + i * ((H * 0.88) / 8),
        speed: 0.00007 + i * 0.000012,
        amp: 2.5 + i * 1.2,
        freq: 0.0058 - i * 0.0003,
        phase: i * 0.85,
        alpha: i < 3 ? 0 : 0.03 + (i - 3) * 0.016,
      }));
    };

    let lines = buildLines();
    const onResize = () => {
      lines = buildLines();
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    function frame(ts: number) {
      t = ts;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const l of lines) {
        if (l.alpha < 0.004) continue;
        context.beginPath();
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = l.y + l.amp * Math.sin(x * l.freq + t * l.speed + l.phase);
          if (x === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
        context.strokeStyle = `rgba(252, 214, 64, ${l.alpha})`;
        context.lineWidth = 1.1;
        context.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const legacyMotionQuery = motionQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    const resetHeroMotion = () => {
      section.style.setProperty("--hero-primary-shift", "0px");
      section.style.setProperty("--hero-canvas-shift", "0px");
      section.style.setProperty("--hero-canvas-scale", "1");
      section.style.setProperty("--hero-aside-shift", "-6px");
      section.style.setProperty("--hero-aside-opacity", "1");
    };

    const canAnimateHero = () =>
      !motionQuery.matches && window.innerWidth >= 1024;

    const applyHeroMotion = ({ scroll }: { scroll: number }) => {
      if (!canAnimateHero()) {
        resetHeroMotion();
        return;
      }

      const travelWindow = Math.max(window.innerHeight * 0.78, 620);
      const progress = Math.min(1, Math.max(0, scroll / travelWindow));

      section.style.setProperty(
        "--hero-primary-shift",
        `${(progress * 40).toFixed(2)}px`,
      );
      section.style.setProperty(
        "--hero-canvas-shift",
        `${(progress * 26).toFixed(2)}px`,
      );
      section.style.setProperty(
        "--hero-canvas-scale",
        `${(1 + progress * 0.03).toFixed(4)}`,
      );
      section.style.setProperty(
        "--hero-aside-shift",
        `${(-6 + progress * 22).toFixed(2)}px`,
      );
      section.style.setProperty(
        "--hero-aside-opacity",
        `${(1 - progress * 0.18).toFixed(3)}`,
      );
    };

    const unsubscribe = subscribe(applyHeroMotion);

    const handleResize = () => {
      applyHeroMotion({
        scroll: window.scrollY,
      });
    };

    const handleMotionPreferenceChange = () => {
      handleResize();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    if ("addEventListener" in motionQuery) {
      motionQuery.addEventListener("change", handleMotionPreferenceChange);
    } else {
      legacyMotionQuery.addListener?.(handleMotionPreferenceChange);
    }

    return () => {
      unsubscribe();
      resetHeroMotion();
      window.removeEventListener("resize", handleResize);
      if ("removeEventListener" in motionQuery) {
        motionQuery.removeEventListener("change", handleMotionPreferenceChange);
      } else {
        legacyMotionQuery.removeListener?.(handleMotionPreferenceChange);
      }
    };
  }, [subscribe]);

  return (
    <>
      <section ref={sectionRef} className="hero_section">
        <canvas ref={canvasRef} className="hero_canvas" aria-hidden="true" />

        <div className="hero">
          <div className="hero_content">
            <div className="hero_primary_wrap">
              <div className="hero_primary">
                <p className="hero_kicker">
                  HI, I'M ALEX
                </p>
                <h1 className="hero_text">
                  <span>From idea</span>
                  <span>to reliable</span>
                  <span>
                    digital <span className="hero_text_accent">products.</span>
                  </span>
                </h1>
              </div>
            </div>

            <div className="hero_bottom">
              <div className="hero_bottom_left">
                <p className="hero_lead">
                  I like the thinking part most: understanding a problem,
                  designing the solution and making the product better for the
                  people who use it.
                </p>
                <div className="hero_actions">
                  <a
                    href="#projects"
                    className="hero_action ui_button ui_button_primary"
                    data-cursor-hero="black"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToHash("#projects");
                    }}
                  >
                    View Projects
                  </a>
                  <CvLink
                    className="hero_action hero_action_cv"
                    data-cursor-hero="white"
                  />
                  <a
                    href="#contact"
                    className="hero_action ui_button ui_button_secondary"
                    data-cursor-hero="yellow"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToHash("#contact");
                    }}
                  >
                    Let's Talk
                  </a>
                </div>
              </div>

              <div className="hero_bottom_right">
                <ul className="hero_skills" aria-label="Current role">
                  <li className="hero_skill">Currently</li>
                  <li className="hero_skill hero_skill--hi">Instant Rips</li>
                  <li className="hero_skill hero_skill--hi">Fanatics Collect</li>
                </ul>
                <p className="hero_avail">
                  <span className="hero_avail_dot" aria-hidden="true" />
                  Based in Lyon, France
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
