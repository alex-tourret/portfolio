import "../../styles/footer.scss";
import ArrowDiagonalRight from "../../utils/svgs/arrowDiagonalRight";
import { PROFILE, getCurrentYear } from "../../config/profile";
import { useSmoothScroll } from "../../utils/scroll/useSmoothScroll";

function Contact() {
  const currentYear = getCurrentYear();
  const { scrollToHash } = useSmoothScroll();

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
            <a
              href={`mailto:${PROFILE.email}`}
              className="contact_email"
              data-cursor-hero="yellow"
            >
              <span className="contact_email_address">{PROFILE.email}</span>
            </a>

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
