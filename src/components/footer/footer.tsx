import { useEffect, useRef, useState } from "react";
import "../../styles/footer.scss";
import ArrowDiagonalRight from "../../utils/svgs/arrowDiagonalRight";
import { PROFILE, getCurrentYear } from "../../config/profile";
import { useSmoothScroll } from "../../utils/scroll/useSmoothScroll";

type CopyState = "idle" | "copied" | "failed";

const copyLabels: Record<CopyState, string> = {
  idle: "Click to copy",
  copied: "Copied ✓",
  failed: "Copy failed, select the address instead",
};

function copyTextFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const didCopy = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error("Clipboard fallback failed");
  }
}

function Contact() {
  const currentYear = getCurrentYear();
  const { scrollToHash } = useSmoothScroll();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimer = useRef<number>();

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function copyToClipboard() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROFILE.email);
      } else {
        copyTextFallback(PROFILE.email);
      }
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 2400);
  }

  return (
    <footer>
      <section id="contact" className="contact">
        <div className="contact_shell">
          <div className="contact_intro">
            <p className="section_eyebrow">Contact</p>
            <h2 className="contact_title">Say hello.</h2>
            <p className="contact_lead">
              Questions about my work, side projects or chess openings:
              all welcome.
            </p>
          </div>

          <div className="contact_reach">
            <button
              type="button"
              className="contact_email"
              onClick={copyToClipboard}
              data-cursor-hero="yellow"
            >
              <span className="contact_email_address">{PROFILE.email}</span>
              <span
                className={`contact_email_hint is_${copyState}`}
                aria-live="polite"
              >
                {copyLabels[copyState]}
              </span>
            </button>

            <div className="contact_links">
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact_link"
              >
                LinkedIn
                <ArrowDiagonalRight />
              </a>
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact_link"
              >
                GitHub
                <ArrowDiagonalRight />
              </a>
              <a
                href={PROFILE.cvPublicPath}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="contact_link"
              >
                Download CV
                <span className="contact_link_down" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>

            <p className="contact_status">
              <span className="contact_status_dot" aria-hidden="true" />
              Open to a good conversation · Usually replies within 24 hours
            </p>
          </div>

          <div className="contact_bottom">
            <p>© {currentYear} Alexandre Tourret</p>
            <a
              href="#home"
              className="contact_top"
              onClick={(event) => {
                event.preventDefault();
                scrollToHash("#home");
              }}
            >
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Contact;
