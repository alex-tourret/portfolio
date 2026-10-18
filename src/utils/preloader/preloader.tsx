import "./preloader.scss";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const opacity = {
  initial: {
    opacity: 0,
    y: 18,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: "-100vh",
    transition: { duration: 0.72, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
  },
};

const bootSteps = [
  {
    level: "info",
    command: "source ~/.zshrc",
    output: "zsh: plugins loaded",
    status: "shell ready",
  },
  {
    level: "info",
    command: "cd ~/projects/portfolio",
    output: "path resolved",
    status: "workspace selected",
  },
  {
    level: "info",
    command: "pnpm run bootstrap",
    output: "modules: backend · frontend · api",
    status: "runtime modules loaded",
  },
  {
    level: "ok",
    command: "pnpm run check:quality",
    output: "tests + observability checks passed",
    status: "quality checks complete",
  },
  {
    level: "ok",
    command: "pnpm run deploy:preview",
    output: "environment synced",
    status: "preview environment synced",
  },
  {
    level: "ok",
    command: "echo 'ready to ship'",
    output: "ready",
    status: "status: ready",
  },
] as const;

function Preloader({
  setIsLoading,
  isDataFetched,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isDataFetched: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const wordTimeoutRef = useRef<number | null>(null);
  const finishTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (!isDataFetched) return;

    const delay = index === 0 ? 980 : 420;

    if (index < bootSteps.length - 1) {
      wordTimeoutRef.current = window.setTimeout(() => {
        setIndex((prevIndex) => prevIndex + 1);
      }, delay);
    }

    if (index === bootSteps.length - 1) {
      finishTimeoutRef.current = window.setTimeout(
        () => setIsLoading(false),
        760,
      );
    }

    return () => {
      if (wordTimeoutRef.current !== null) {
        clearTimeout(wordTimeoutRef.current);
        wordTimeoutRef.current = null;
      }
      if (finishTimeoutRef.current !== null) {
        clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = null;
      }
    };
  }, [index, isDataFetched, setIsLoading]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  }  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  const currentStep = bootSteps[Math.min(index, bootSteps.length - 1)];
  const progress = Math.min((index + 1) / bootSteps.length, 1);
  const visibleSteps = bootSteps.slice(
    0,
    Math.min(index + 1, bootSteps.length),
  );
  const displayedSteps = visibleSteps.slice(-3);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="introduction"
    >
      {!isDataFetched ? (
        <p className="preloader_word preloader_word--brand">
          Alexandre Tourret
        </p>
      ) : (
        dimension.width > 0 && (
          <>
            <div
              className="preloader_terminal"
              role="status"
              aria-live="polite"
            >
              <div className="preloader_terminal_head">
                <span className="preloader_dot" aria-hidden="true" />
                <span className="preloader_dot" aria-hidden="true" />
                <span className="preloader_dot" aria-hidden="true" />
                <span className="preloader_terminal_title">portfolio.boot</span>
              </div>

              <motion.p
                className="preloader_word"
                variants={opacity}
                initial="initial"
                animate="enter"
              >
                Alexandre Tourret · Software Engineer
              </motion.p>

              <div className="preloader_logs" aria-hidden="true">
                {displayedSteps.map((step, lineIndex) => (
                  <div key={step.command} className="preloader_log_group">
                    <p className="preloader_log_line">
                      <span className="preloader_log_prompt">
                        alex@portfolio %
                      </span>
                      <span
                        className={`preloader_log_level preloader_log_level--${step.level}`}
                      >
                        [{step.level}]
                      </span>
                      <span>{step.command}</span>
                      {lineIndex === displayedSteps.length - 1 && (
                        <span className="preloader_cursor" aria-hidden="true" />
                      )}
                    </p>
                    {lineIndex === displayedSteps.length - 1 && (
                      <p className="preloader_log_output">{step.output}</p>
                    )}
                  </div>
                ))}

                {index === bootSteps.length - 1 && (
                  <p className="preloader_log_line preloader_log_line--final">
                    <span className="preloader_log_prompt">
                      alex@portfolio %
                    </span>
                    <span>_</span>
                  </p>
                )}
              </div>

              <div className="preloader_hud" aria-hidden="true">
                <span className="preloader_hud_label">
                  {currentStep.status}
                </span>
                <div className="preloader_progress_track" role="presentation">
                  <span
                    className="preloader_progress_fill"
                    style={{ transform: `scaleX(${progress})` }}
                  />
                </div>
                <span className="preloader_hud_value">
                  step {Math.min(index + 1, bootSteps.length)}/
                  {bootSteps.length}
                </span>
              </div>
            </div>
            <svg>
              <motion.path
                variants={curve}
                initial="initial"
                exit="exit"
              ></motion.path>
            </svg>
          </>
        )
      )}
    </motion.div>
  );
}

export default Preloader;
